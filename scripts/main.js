'use strict';


const {TextMessage} = require('hubot/es2015');
const {SlackAdapterService, AuthorizationService, CommandRepository, ConversationService, Logger, OutputChannel, Interaction, SchedulerService, Session, util} = require('./lib');
const {bot_config} = require("./config");
const logger = new Logger("main");

/**
 * The main entry point for the bot.  This class listens to all incoming messages and delegates out to commands.
 */
module.exports = robot => {
    Session.instance.conversation = new ConversationService(robot);
    Session.instance.outputChannel = new OutputChannel(robot);
    Session.instance.authService = new AuthorizationService();
    Session.instance.slackAdapter = new SlackAdapterService(robot.adapter);
    Session.instance.commandRepository = new CommandRepository(Session.instance.authService);
    const commandRepository = Session.instance.commandRepository;
    SchedulerService.registerAllJobs();

    if (util.isNullOrEmpty(bot_config.bot_name) && util.isNotNullOrEmpty(robot.name)) {
        bot_config.bot_name = robot.name;
    }

    robot.receiveMiddleware(async (context, next, done) => {
        try {
            if (!(context.response.message instanceof TextMessage) && !Session.instance.slackAdapter.isReaction(context.response.message)) {
                next();
                return;
            }

            let interaction = Interaction.from(context.response);
            if (!interaction.isInteractingWithBot) {
                // Check for unsolicited commands, as long as the message is not in a thread
                if (!interaction.isThreaded) {
                    let unsolicitedCommands = commandRepository.findUnsolicitedCommandsFor(interaction);

                    // Execute an commands, if we found any
                    if (util.isNotNullOrEmpty(unsolicitedCommands) && unsolicitedCommands.length > 0) {
                        await executeCommands(interaction, unsolicitedCommands);
                    }
                }
                next();
                return;
            }
            if (util.isNotNullOrEmpty(interaction.requestText) && interaction.requestText.includes("\n")) {
                logger.warn("Ignoring message with newline: '" + interaction.rawText + "'");
                next();
                return;
            }

            let commands = commandRepository.findCommandsFor(interaction);
            if (commands.length > 0 && commandRepository.isRootCommand(commands[0])) {
                // If we have a root command, then we need to reset any dialog because we're leaving the dialog tree
                interaction.resetDialog();
            } else if (commands.length === 0 && interaction.isInteractingWithBot && !interaction.isReactionToBot) {
                // If no commands match, then use fall back to the configured fallback command
                if (util.isNotNullOrEmpty(bot_config.fallback_command)) {
                    commands.push(commandRepository.createCommand(bot_config.fallback_command));
                }
            }

            await executeCommands(interaction, commands);
            next();
        } catch (err) {
            logger.error('Error during incoming message', err);
            done();
        }
    });

    /**
     * Executes the given commands for the given interaction.
     *
     * @param interaction {Interaction} - The interaction
     * @param commands {Command[]} - The commands
     * @returns {Promise<void>}
     */
    async function executeCommands(interaction, commands) {
        try {
            logMessage(interaction, commands);
            await executeCommandsFor(commands, interaction);
        } catch (err) {
            logger.error('Error during execution', err);
        }
    }

    /**
     * Logs the given message.
     *
     * @param interaction {Interaction}
     * @param commands {Command[]}
     */
    function logMessage(interaction, commands) {
        let logEntry = {};
        logEntry.type = interaction.requestRoomType;
        logEntry.threaded = interaction.isThreaded;
        logEntry.thread_ts = interaction.threadIdentifier;
        logEntry.user = interaction.user.real_name;
        logEntry.userId = interaction.user.id;
        if (util.isNotNullOrEmpty(interaction.requestText)) {
            logEntry.request = interaction.requestText;
        }
        if (util.isNotNullOrEmpty(interaction.reaction)) {
            logEntry.request = "Reaction: " + interaction.reaction.type + " " + interaction.reaction.reaction;
        }
        if (util.isNotNullOrEmpty(commands) && commands.length > 0) {
            logEntry.matchedCommands = commands.map(x => x.constructor && x.constructor.name ? x.constructor.name : "");
        } else {
            logEntry.matchedCommands = null;
        }
        logger.info(logEntry);
    }


    /**
     * Executes commands against the given response.
     *
     * @param commands {Command[]} - The commands to execute.
     * @param interaction {Interaction} - the bot response.
     */
    async function executeCommandsFor(commands, interaction) {
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];

            try {
                let commandInstance = commandRepository.retrieveCommandInstance(command);
                if (commandInstance == null) {
                    continue;
                }

                await commandInstance.execute(interaction);

                // Only execute the first command
                if (commands.length > 1) {
                    logger.warn("Multiple commands found; only executing the first");
                    return;
                }
            } catch (error) {
                logger.error("Error executing commands", error);
            }
        }
    }
};

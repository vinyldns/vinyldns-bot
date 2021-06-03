'use strict';

const Command = require("./command");
const UnsolicitedCommand = require("./unsolicited-command");
const util = require("./util");

class CommandRepository {
    /**
     * @param authService {AuthorizationService} - Authorization service.
     */
    constructor(authService) {
        this._authService = authService;
        CommandRepository.initialize();
    }

    /**
     * @returns {Command[]}
     */
    get allRootCommands() {
        return Array.from(CommandRepository._rootCommands.values());
    }

    /**
     * Finds all root commands applicable to the given interaction.
     *
     * @param {Interaction} interaction - The interaction to find commands for
     * @param {function(Command) : boolean} [filter] - Optional filter
     * @returns {Command[]}
     */
    findRootCommandsFor(interaction, filter) {
        if (util.isNullOrEmpty(filter)) {
            filter = x => this._authService.hasAccess(x.constructor.name, interaction.userId)
        }
        return this.allRootCommands
                   .map(x => this.retrieveCommandInstance(x))
                   .filter(filter);
    }

    /**
     * Creates an instance of the command for the given commandName.
     *
     * @param commandName {string} - The name of the command.
     * @return {Command} - The command if found.
     */
    createCommand(commandName) {
        return new (require("../commands/" + commandName + "-command.js"))();
    }

    /**
     * Finds unsolicted commands applicable for the current interaction
     *
     * @param interaction {Interaction} - The interaction to find commands for
     * @returns Command[] - The found commands.
     */
    findUnsolicitedCommandsFor(interaction) {
        return this._findCommandsFromViableCommands(interaction, Array.from(CommandRepository._unsolicitedCommands.values()))
    }

    /**
     * Finds commands applicable for the current interaction
     *
     * @param interaction {Interaction} - The interaction to find commands for
     * @returns Command[] - The found commands.
     */
    findCommandsFor(interaction) {
        let viableCommands = this.findRootCommandsFor(interaction);

        // Find any commands attached to an open dialog that may be viable
        if (interaction.hasOpenDialog) {
            viableCommands = viableCommands.concat(interaction.currentDialog.nextCommands);
        }

        return this._findCommandsFromViableCommands(interaction, viableCommands)
    }


    /**
     * Determines whether the given command is a root command.
     * @param command {Command}
     */
    isRootCommand(command) {
        if (command instanceof Command) {
            if (Array.from(CommandRepository._rootCommands.keys()).includes(command.constructor.name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Retrieves the command instance from an instance, or class provided by command.
     *
     * @param {function|Command} command - The command or command class.
     * @return {Command|null}
     */
    retrieveCommandInstance(command) {
        if (typeof command.prototype == "object" && typeof command.prototype.constructor == "function") {
            // Command is a class, instantiate
            return new command();
        } else if (command instanceof Command) {
            return command;
        }
        return null;
    }

    /**
     * Finds commands applicable for the current interaction
     *
     * @param interaction {Interaction} - The interaction to find commands for
     * @param viableCommands {Command[]} - The viable commands
     * @returns Command[] - The found commands.
     */
    _findCommandsFromViableCommands(interaction, viableCommands) {
        let commands = [];

        // For all of the viable commands, see if any match our incoming interaction
        for (let command of viableCommands) {
            let commandInstance = this.retrieveCommandInstance(command);
            if (commandInstance == null) {
                continue;
            }
            if (!this._authService.hasAccess(commandInstance.constructor.name, interaction.user.id)) {
                continue;
            }
            let canExecute = commandInstance.canExecute(interaction);
            if (canExecute) {
                if (this.isRootCommand(commandInstance)) {
                    // The only viable command is the root command, so we'll stop here
                    commands = [commandInstance];
                    break;
                } else {
                    commands.push(commandInstance);
                }
            }
        }

        return commands;
    }

    static initialize() {
        if (util.isNullOrEmpty(CommandRepository._allCommands)) {
            const normalizedPath = require("path").join(__dirname, "../commands");
            /** @type Map<string,Command> */
            CommandRepository._allCommands = new Map();
            /** @type Map<string,Command> */
            CommandRepository._rootCommands = new Map();
            /** @type Map<string,Command> */
            CommandRepository._unsolicitedCommands = new Map();
            require("fs").readdirSync(normalizedPath)
                         .filter(x => x.endsWith("-command.js"))
                         .forEach((file) => {
                             const commandClass = require("../commands/" + file);
                             CommandRepository._allCommands.set(file.replace(/-command\.js/, ""), commandClass);
                             const instance = new commandClass();
                             if (instance instanceof UnsolicitedCommand) {
                                 CommandRepository._unsolicitedCommands.set(file.replace(/-command\.js/, ""), commandClass)
                             } else if (instance.isRootCommand) {
                                 CommandRepository._rootCommands.set(file.replace(/-command\.js/, ""), commandClass)
                             }
                         });
        }
    }
}

module.exports = CommandRepository;

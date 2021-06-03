'use strict';

/**
 * Global singleton for holding references.
 */
class Session {
    constructor() {
    }

    /**
     * @returns {CommandRepository}
     */
    get commandRepository() {
        return this._commandRepository;
    }

    /**
     * @param value {CommandRepository}
     */
    set commandRepository(value) {
        this._commandRepository = value;
    }

    /**
     * @return {SlackAdapterService}
     */
    get slackAdapter() {
        return this._slackAdapter;
    }

    /**
     * @param value {SlackAdapterService}
     */
    set slackAdapter(value) {
        this._slackAdapter = value;
    }

    /**
     * @param authService {AuthorizationService}
     */
    set authService(authService) {
        this._authService = authService;
    }

    /**
     * @return {AuthorizationService}
     */
    get authService() {
        return this._authService;
    }

    /**
     * @param conversation {ConversationService}
     */
    set conversation(conversation) {
        this._conversation = conversation;
    }

    /**
     * @return {ConversationService}
     */
    get conversation() {
        return this._conversation;
    }

    /**
     * @param outputChannel {OutputChannel}
     */
    set outputChannel(outputChannel) {
        this._outputChannel = outputChannel;
    }

    /**
     * @return {OutputChannel}
     */
    get outputChannel() {
        return this._outputChannel;
    }
}

Session.instance = new Session();
module.exports = Session;
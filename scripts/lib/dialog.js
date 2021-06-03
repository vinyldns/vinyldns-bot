'use strict';

const EventEmitter = require('events');

class Dialog extends EventEmitter {
    /**
     * @param ttl {int} - The TTL for this dialog.
     */
    constructor(ttl) {
        super();
        this._ttl = ttl;
        this._commands = [];
    }

    /**
     * @return {Command[]}
     */
    get nextCommands() {
        this.renewExpirationTimer();
        return this._commands;
    }

    /**
     * @param commands {Command[]}
     */
    set nextCommands(commands) {
        this.renewExpirationTimer();
        this._commands = commands;
    }

    /**
     * Resets the dialog and any pending commands.
     */
    reset() {
        this.nextCommands = [];
        this.renewExpirationTimer();
    }

    /**
     * Starts the timer for expiring this dialog.
     */
    startExpirationTimer() {
        this._expiration = setTimeout(() => this.emit('expired'), this._ttl);
    }

    /**
     * Renews the timer for expiration.
     */
    renewExpirationTimer() {
        clearTimeout(this._expiration);
        this.startExpirationTimer();
    }

    /**
     * Closes out this dialog by marking it expired.
     */
    close() {
        clearTimeout(this._expiration);
        this.emit('expired');
    }
}

module.exports = Dialog;
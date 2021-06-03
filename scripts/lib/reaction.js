'use strict';

class Reaction {

    constructor(type, reaction, item) {
        this._type = type;
        this._reaction = reaction;
        this._item = item;
    }

    get type() {
        return this._type;
    }

    get reaction() {
        return this._reaction;
    }

    get item() {
        return this._item;
    }
}

module.exports = Reaction;
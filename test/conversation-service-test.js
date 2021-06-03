'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {ConversationService} = require("../scripts/lib");

function createMockRobot() {
    let dataStore = new Map();
    let mockRobot = {
        brain: {
            set: (k, v) => dataStore.set(k, v),
            get: k => dataStore.get(k),
            remove: k => dataStore.delete(k)
        }
    };
    return {dataStore, mockRobot};
}

describe('Conversation Service', () => {

    it("should create a dialog and store it", () => {
        let {dataStore, mockRobot} = createMockRobot();
        let mockInteraction = {user: {id: "user_id"}, threadIdentifier: "1020202029292.2020"};
        new ConversationService(mockRobot).openDialog(mockInteraction);
        expect(Array.from(dataStore.keys())[0]).to.eql("dlg_user_id_1020202029292.2020");
        expect(Array.from(dataStore.values())[0].constructor.name).to.eql("Dialog");
    });

    it("should return stored value", () => {
        let {dataStore, mockRobot} = createMockRobot();
        dataStore.set("dlg_user_id_1020202029292.2020", "some value");

        let mockInteraction = {user: {id: "user_id"}, threadIdentifier: "1020202029292.2020"};
        let result = new ConversationService(mockRobot).openDialog(mockInteraction);
        expect(result).to.eql("some value");
    });

    it("should delete dialogs on reset", () => {
        let {dataStore, mockRobot} = createMockRobot();
        let mockInteraction = {user: {id: "user_id"}, threadIdentifier: "1020202029292.2020"};
        const conversationService = new ConversationService(mockRobot);
        conversationService.openDialog(mockInteraction);

        expect(dataStore).to.have.lengthOf(1);
        conversationService.reset();
        expect(dataStore).to.have.lengthOf(0);
    });

    it("should delete dialogs for user on reset", () => {
        let {dataStore, mockRobot} = createMockRobot();
        let mockInteraction = {user: {id: "user_id"}, threadIdentifier: "1020202029292.2020"};
        const conversationService = new ConversationService(mockRobot);
        conversationService.openDialog(mockInteraction);

        expect(dataStore).to.have.lengthOf(1);
        conversationService.resetFor("user_id");
        expect(dataStore).to.have.lengthOf(0);
    });

    it("should not delete dialogs for non-matching user on reset", () => {
        let {dataStore, mockRobot} = createMockRobot();
        let mockInteraction = {user: {id: "user_id"}, threadIdentifier: "1020202029292.2020"};
        const conversationService = new ConversationService(mockRobot);
        conversationService.openDialog(mockInteraction);

        expect(dataStore).to.have.lengthOf(1);
        conversationService.resetFor("different_user_id");
        expect(dataStore).to.have.lengthOf(1);
    });
});

'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');

const Interaction = require("../scripts/lib/interaction");

describe('Interaction', () => {

    it("should detect direct message", () => {
        let mockRobot = {};
        let mockResponse = {
            message: {
                room: "D1111"
            }
        };
        expect(new Interaction(mockRobot, mockResponse).isDirectMessage).to.equal(true);
    });

    it("should get event timestamp", () => {
        let mockRobot = {};
        let mockResponse = {
            message: {
                room: "X1111"
            }
        };
        expect(new Interaction(mockRobot, mockResponse, {retrieveEventTimestampForMessage: () => "-1"}).eventTimestamp).to.equal("-1");
    });

    it("should send reaction to slack adapter", () => {
        let mockRobot = {};
        let mockResponse = {
            message: {
                room: "X1111"
            }
        };
        let result = {};
        new Interaction(mockRobot, mockResponse, {addReaction: (interaction, reaction) => result = {reaction: reaction}}).react("my_reaction");
        expect(result).to.eql({
            "reaction": "my_reaction"
        });
    });


    it("should detect not a direct message", () => {
        let mockRobot = {};
        let mockResponse = {
            message: {
                room: "X1111"
            }
        };
        expect(new Interaction(mockRobot, mockResponse).isDirectMessage).to.equal(false);
    });

    it("should find user by name", () => {
        let mockRobot = {
            brain: {
                userForName: () => {
                    return {id: "some_id", name: "some_username"}
                }
            }
        };
        let mockResponse = {
            message: {
                room: "X1111"
            }
        };
        expect(new Interaction(mockRobot, mockResponse).findUserForName("user")).to.eql({
            "id": "some_id",
            "name": "some_username"
        });
    });

    it("should return current dialog", () => {
        let mockRobot = {};
        let mockResponse = {};
        const interaction = new Interaction(mockRobot, mockResponse);
        interaction._conversation = {
            retrieveDialog: () => {
                return "retrieved_dialog";
            }
        };
        expect(interaction.currentDialog).to.equal("retrieved_dialog");
    });

    it("should end dialog", () => {
        let mockRobot = {};
        let mockResponse = {};
        const interaction = new Interaction(mockRobot, mockResponse);
        let dialogClosed = false;
        interaction._conversation = {
            retrieveDialog: () => {
                return {close: () => dialogClosed = true};
            }
        };
        interaction.endDialog()
        expect(dialogClosed).to.equal(true);
    });

    it("should reset dialog", () => {
        let mockRobot = {};
        let mockResponse = {};
        const interaction = new Interaction(mockRobot, mockResponse);
        let dialogReset = false;
        interaction._conversation = {
            retrieveDialog: () => {
                return {reset: () => dialogReset = true};
            }
        };
        interaction.resetDialog()
        expect(dialogReset).to.equal(true);
    });


    it("should call slack upload file on uploadFile", async () => {
        let mockRobot = {};
        let mockResponse = {};
        let uploadParams = {};
        let mockSlackAdapter = {
            isAvailable: () => true,
            uploadFile: (int, file, path) => {
                uploadParams = {interaction: int, fileName: file, filePath: path}
            }
        };
        const interaction = new Interaction(mockRobot, mockResponse, mockSlackAdapter);
        await interaction.uploadFile("string", "somefile");

        expect(uploadParams).to.eql({
            fileName: "string",
            filePath: "somefile",
            interaction: interaction
        });
    });
});

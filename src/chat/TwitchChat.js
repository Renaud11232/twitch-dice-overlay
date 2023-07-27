import {AbstractChat} from "./AbstractChat";

const tmi = require("tmi.js");
export class TwitchChat extends AbstractChat {

    constructor(config) {
        super(config);
        this.client = new tmi.Client({
            channels: [config.channel]
        });
        this.client.connect();
        this.client.on("message", (channel, tags, message) => {
            this.handleMessage(message, tags["display-name"]);
        });
        this.client.on("usernotice", (msgid, channel, tags, message) => {
            if(msgid === "announcement") {
                this.handleAnnouncement(message, tags["display-name"]);
            }
        });
    }

}
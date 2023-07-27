import {Chat} from "./Chat";

const tmi = require("tmi.js");
export class TwitchChat extends Chat {

    constructor(config) {
        super(config);
        this.client = new tmi.Client(config.twitch);
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
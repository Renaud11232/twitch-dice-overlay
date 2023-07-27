import {TwitchChat} from "./TwitchChat";
import {KickChat} from "./KickChat";

function getInstance(config) {
    switch(config.chatType) {
        case "twitch":
            return new TwitchChat(config);
        case "kick":
            return new KickChat(config);
        default:
            throw new Error(`Unsupported chat type : ${config.chatType}`);
    }
}
export const Chat = {
    getInstance
}
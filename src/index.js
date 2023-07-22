import "./styles.css";
import {TwitchChat} from "./providers/TwitchChat";
import {KickChat} from "./providers/KickChat";
import {Dice} from "./dice/Dice";

fetchConfig().then(config => {
    const dice = new Dice(config);

    let chat;
    if(config.chatType === "twitch") {
        chat = new TwitchChat(config);
    } else if (config.chatType === "kick") {
        chat = new KickChat(config);
    }

    chat.onRoll = function(rollValue) {
        dice.roll(`1d20@${rollValue}`);
    }
});

async function fetchConfig() {
    const response = await fetch("/config.json");
    return await response.json();
}
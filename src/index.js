import "./styles.css";
import {Dice} from "./dice/Dice";
import {Chat} from "./chat/Chat";

fetchConfig().then(config => {
    const dice = new Dice(config.dice);

    const chat = Chat.getInstance(config.chat);

    chat.onRoll = function(rollValue) {
        dice.roll(`1d20@${rollValue}`);
    }
});

async function fetchConfig() {
    const response = await fetch("/config.json");
    return await response.json();
}
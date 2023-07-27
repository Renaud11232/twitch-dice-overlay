import "./styles.css";
import {Dice} from "./dice/Dice";
import {Chat} from "./providers/Chat";

fetchConfig().then(config => {
    const dice = new Dice(config);

    const chat = Chat.getInstance(config);

    chat.onRoll = function(rollValue) {
        dice.roll(`1d20@${rollValue}`);
    }
});

async function fetchConfig() {
    const response = await fetch("/config.json");
    return await response.json();
}
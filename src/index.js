import "./styles.css";
import DiceBox from "@3d-dice/dice-box-threejs";
import {TwitchChat} from "./providers/TwitchChat";
import {KickChat} from "./providers/KickChat";

fetchConfig().then(config => {
    const DICE_BOXES = [];
    const MAX_DICE_BOXES = config.nbDiceBoxes === undefined ? 5 : config.nbDiceBoxes;
    let currentDiceBoxIndex = 0;

    for(let i = 0; i < MAX_DICE_BOXES; i++) {
        let diceBox = new DiceBox(`#dicebox${i}`, {
            gravity_multiplier: config.physics?.gravity_multiplier === undefined ? 600 : config.physics.gravity_multiplier,
            baseScale: config.physics?.baseScale === undefined ? 100 : config.physics.baseScale,
            strength: config.physics?.strength === undefined ? 2 : config.physics.strength
        });
        diceBox.initialize();
        DICE_BOXES.push(diceBox);
    }

    let chat;
    if(config.chatType === "twitch") {
        chat = new TwitchChat(config);
    } else if (config.chatType === "kick") {
        chat = new KickChat(config);
    }
    chat.onRoll = function(rollValue) {
        let diceBox = DICE_BOXES[currentDiceBoxIndex];
        currentDiceBoxIndex = (currentDiceBoxIndex + 1) % MAX_DICE_BOXES;

        diceBox.roll(`1d20@${rollValue}`)
            .then(() => {
                setTimeout(() => {
                    diceBox.clearDice();
                }, config.diceTimeout === undefined ? 5000 : config.diceTimeout);
            });
    }
});

async function fetchConfig() {
    const response = await fetch("/config.json");
    return await response.json();
}
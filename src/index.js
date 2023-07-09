import "./styles.css";
import DiceBox from "@3d-dice/dice-box-threejs";

const tmi = require("tmi.js");

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

    const client = new tmi.Client(config.twitch);
    client.connect();

    if(config.triggerType === "announcement") {
        client.on("usernotice", (msgid, channel, tags, message) => {
            if(msgid === "announcement") {
                handleInput(tags, message);
            }
        });
    } else if (config.triggerType === "message") {
        client.on("message", (channel, tags, message) => {
            handleInput(tags, message);
        });
    }

    function handleInput(tags, message) {
        if(tags["display-name"].toLowerCase() !== config.diceBotName) {
            return;
        }
        let messageMatch = message.match(config.messagePattern);
        if(messageMatch) {
            let diceBox = DICE_BOXES[currentDiceBoxIndex];
            currentDiceBoxIndex = (currentDiceBoxIndex + 1) % MAX_DICE_BOXES;

            diceBox.roll(`1d20@${messageMatch[1]}`)
                .then(() => {
                    setTimeout(() => {
                        diceBox.clearDice();
                    }, config.diceTimeout === undefined ? 5000 : config.diceTimeout);
                });
        }
    }
});

async function fetchConfig() {
    const response = await fetch("/config.json");
    return await response.json();
}
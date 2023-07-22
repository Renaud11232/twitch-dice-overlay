import DiceBox from "@3d-dice/dice-box-threejs";

export class Dice {
    constructor(config) {
        this.config = config;
        this.diceBoxes = [];
        this.maxDiceBoxes = config.nbDiceBoxes === undefined ? 5 : config.nbDiceBoxes;
        this.currentDiceBoxIndex = 0;
        for (let i = 0; i < this.maxDiceBoxes; i++) {
            let diceBox = new DiceBox(`#dicebox${i}`, {
                gravity_multiplier: config.physics?.gravity_multiplier === undefined ? 600 : config.physics.gravity_multiplier,
                baseScale: config.physics?.baseScale === undefined ? 100 : config.physics.baseScale,
                strength: config.physics?.strength === undefined ? 2 : config.physics.strength
            });
            diceBox.initialize();
            this.diceBoxes.push(diceBox);
        }
    }

    roll(value) {
        let diceBox = this.diceBoxes[this.currentDiceBoxIndex];
        this.currentDiceBoxIndex = (this.currentDiceBoxIndex + 1) % this.maxDiceBoxes;
        diceBox.roll(value).then(() => {
            setTimeout(() => {
                diceBox.clearDice();
            }, this.config.diceTimeout === undefined ? 5000 : this.config.diceTimeout);
        });
    }
}
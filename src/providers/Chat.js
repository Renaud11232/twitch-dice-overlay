export class Chat {

    constructor(config) {
        this.config = config;
    }

    handleMessage(content, author) {
        if(this.config.triggerType !== "message") {
            return;
        }
        this.handleDiceRoll(content, author);
    }

    handleAnnouncement(content, author) {
        if(this.config.triggerType !== "announcement") {
            return;
        }
        this.handleDiceRoll(content, author);
    }

    handleDiceRoll(content, author) {
        let diceRoll = this.getDiceRoll(content, author);
        if(diceRoll !== null && this.onRoll) {
            this.onRoll(diceRoll);
        }
    }

    getDiceRoll(message, author) {
        if(this.config.diceBotName.toLowerCase() !== author.toLowerCase()) {
            return null;
        }
        let messageMatch = message.match(this.config.messagePattern);
        if(messageMatch) {
            return parseInt(messageMatch[1]);
        }
        return null;
    }
}
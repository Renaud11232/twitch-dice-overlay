import {Chat} from "./Chat";
import {KickChatClient} from "../client/KickChatClient";

export class KickChat extends Chat {

    constructor(config) {
        super(config);
        this.client = new KickChatClient();
        this.client.onMessage = data => {
            console.log(data);
        }
        this.client.connectToChannels(config.kick.channels);
    }


}
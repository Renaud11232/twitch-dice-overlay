import {AbstractChat} from "./AbstractChat";
import {KickChatClient} from "../client/KickChatClient";

export class KickChat extends AbstractChat {

    constructor(config) {
        super(config);
        this.client = new KickChatClient();
        this.client.onMessage = data => {
            console.log(data);
        }
        this.client.connectToChannels(config.kick.channels);
    }


}
import {AbstractChat} from "./AbstractChat";
import Pusher from "pusher-js";

export class KickChat extends AbstractChat {

    constructor(config) {
        super(config);
        this.pusher = new Pusher("eb1d5f283081a78b932c", {
            cluster: "us2",
            enabledTransports: ["ws"]
        });
        const channel = this.pusher.subscribe(config.channel);
        channel.bind("App\\Events\\ChatMessageEvent", data => {
            this.handleMessage(data.content, data.sender.username);
        });
    }


}
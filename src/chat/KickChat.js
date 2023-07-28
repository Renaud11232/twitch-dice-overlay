import {AbstractChat} from "./AbstractChat";
import Pusher from "pusher-js";

export class KickChat extends AbstractChat {

    constructor(config) {
        super(config);
        this.pusher = new Pusher("eb1d5f283081a78b932c", {
            cluster: "us2",
            enabledTransports: ["ws"]
        });
        fetchKickChannel(config.channel).then(kickChannel => {
            const chatroom = this.pusher.subscribe(`chatrooms.${kickChannel.chatroom.id}.v2`);
            chatroom.bind("App\\Events\\ChatMessageEvent", data => {
                this.handleMessage(data.content, data.sender.username);
            });
            const channel = this.pusher.subscribe(`channel.${kickChannel.chatroom.channel_id}`);
        })
    }
}

async function fetchKickChannel(channelName) {
    const response = await fetch(`https://kick.com/api/v2/channels/${channelName}`);
    return await response.json();
}
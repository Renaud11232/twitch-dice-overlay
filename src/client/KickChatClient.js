//JS OO port of https://github.com/retconned/kickchat-client
export class KickChatClient {

    constructor() {
        this.onMessage = null;
        this.activeWebSockets = [];
        this.maxChannelsPerSocket = 10;
        this.url = "wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false";
    }

    _connectToChannels(socket, channels) {
        channels.forEach(channel => {
            const connect = JSON.stringify({
                event: "pusher:subscribe",
                data: {
                    auth: "",
                    channel: `${channel}`
                }
            })
            socket.send(connect);
        })
    }

    _createWebSocket(channels) {
        const socket = new WebSocket(this.url);
        socket.addEventListener("open", () => {
            this.activeWebSockets.push(socket);
            this._connectToChannels(socket, channels);
        })
        socket.addEventListener("message", event => {
            if(this.onMessage) {
                this.onMessage(JSON.parse(event.data));
            }
        })
        socket.addEventListener("close", () => {
            this.activeWebSockets = this.activeWebSockets.filter(s => s !== socket);
        })
    }

    _countConnectedChannels(socket) {
        let count = 0;
        socket.listeners("message").forEach(listener => {
            const connectEvent = JSON.parse(listener.toString());
            if(connectEvent && connectEvent.event === "pusher:subscribe") {
                count++;
            }
        });
        return count;
    }

    connectToChannels(channels) {
        let connectedChannelCount = 0;
        this.activeWebSockets.forEach(socket => {
            if(connectedChannelCount < this.maxChannelsPerSocket) {
                const channelsToConnect = channels.slice(connectedChannelCount, this.maxChannelsPerSocket - connectedChannelCount);
                this._connectToChannels(socket, channelsToConnect);
                connectedChannelCount += channelsToConnect.length;
            }
        })
        while (connectedChannelCount < channels.length) {
            const channelsToConnect = channels.slice(connectedChannelCount, connectedChannelCount + this.maxChannelsPerSocket);
            this._createWebSocket(channelsToConnect);
            connectedChannelCount += channelsToConnect.length;
        }
    }

}
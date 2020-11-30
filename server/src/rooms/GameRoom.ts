import { Room, Client } from "colyseus";

import { StateHandler } from "./StateHandler";
import { Player } from "../entities/Player";
import { Position2D, Collision } from "../collision/Collision";
import { BinaryFileAssetTask } from "babylonjs";

export class GameRoom extends Room<StateHandler> {
    maxClients = 8;

    async onCreate (options) {
        this.setSimulationInterval(() => this.onUpdate());
        this.setState(new StateHandler());

        this.onMessage("key", (client, message) => {
            this.state.players.get(client.sessionId).pressedKeys = message;
        });

        this.collision = await Collision.build('thinMaze');
    }

    collision : Collision;

    onJoin (client) {
        const player = new Player();
        player.name = `Player ${ this.clients.length }`;

        player.position.x = this.collision.map.spawns[0].x;
        player.position.y = 0;
        player.position.x = this.collision.map.spawns[0].x;
        player.position.heading = 0;
        player.animation = null;
        this.state.players.set(client.sessionId, player);
    }

    onUpdate () {
        this.state.players.forEach((player, sessionId) => {
            let step = 0.1;
            while (step > 0.01) {
                const np = new Position2D();
                np.x = player.position.x + Math.sin(player.position.heading) * player.pressedKeys.move * step;
                np.z = player.position.z + Math.cos(player.position.heading) * player.pressedKeys.move * step;
                if (this.collision.detect(np)) {
                    // console.log('no collision');
                    player.position.x = np.x;
                    player.position.z = np.z;
                    break;
                } else {
                    // console.log('collision');
                    step *= 0.5;
                }
            }

            player.position.heading += player.pressedKeys.spin * 0.03;
            player.animation = player.pressedKeys.animate;
        });
    }

    onLeave (client: Client) {
        this.state.players.delete(client.sessionId);
    }

    onDispose () {
    }

}

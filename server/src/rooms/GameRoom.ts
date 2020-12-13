import { Room, Client } from "colyseus";
// import { User, verifyToken } from "@colyseus/social";
import { StateHandler } from "./StateHandler";
import { Player } from "../entities/Player";
import { Position2D, Collision } from "../collision/Collision";

export class GameRoom extends Room<StateHandler> {
    maxClients = 8;
    hostId ;

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
        switch(this.state.stage) {
            case 'waiting':
                console.log("in waiting state");
                const player = new Player();
                player.name = `Player ${ this.clients.length }`;
                console.log("playerName =",player.name)
                this.respawnPlayer(player);
                this.state.players.set(client.sessionId, player);
                console.log("size =",this.state.players.size)
                if (this.state.players.size === 2){
                    this.state.stage = 'running';
                    this.state.players.forEach(this.respawnPlayer);
                }
                break;
            case 'running':
                let reachTarget = true;
                this.state.players.forEach((player, key, map) => {
                    let dx = player.position.x - this.collision.map.target.x;
                    let dz = player.position.z - this.collision.map.target.z;
                    reachTarget = reachTarget && Math.sqrt(dx*dx + dz*dz) < 7;
                })
                if (reachTarget) {
                    this.state.stage = 'wins';
                }
                break;
            case 'wins':
                break;
        }
    }

    onUpdate () {
        if (this.state.stage === 'wins') return;
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

    respawnPlayer = (player: Player) => {
        let i = Math.floor((Math.random() * this.collision.map.spawns.length));
        player.position.x = this.collision.map.spawns[i].x;
        player.position.y = 0;
        player.position.z = this.collision.map.spawns[i].z;
        player.position.heading = 0;
        player.animation = null;
    }

}
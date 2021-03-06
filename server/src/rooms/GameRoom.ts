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
            if (this.state.players.has(client.sessionId)) {
                this.state.players.get(client.sessionId).pressedKeys = message;
            }
            // console.log("message", message)
        });

        this.collision = await Collision.build('thinMaze');
        let print = () => {
            // console.info(this.state.stage);
            setTimeout(print, 1000);
        }
        print();

    }

    collision : Collision;

    onJoin (client) {
        switch(this.state.stage) {
            case 'waiting':
                console.log("in waiting state");
                const player = new Player();
                player.name = `Player ${ this.clients.length }`;
                if(player.name==='Player 1'){
                    this.hostId=client.sessionId;
                    console.log("host =",this.hostId)
                }
                this.respawnPlayer(player, 0);
                this.state.players.set(client.sessionId, player);
                if (this.state.players.size === 4) {
                    this.state.stage = 'running';
                    this.respawnPlayers();
                }
                break;
            case 'running':
                console.log("in running state")
                if (this.hasReachedTarget()) {
                    this.state.stage = 'winning';
                }
                break;
            case 'winning':
                break;
        }
    }

    onUpdate () {
        console.info(this.state);
        switch(this.state.stage) {
            case 'waiting':
                var respawn = false;
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

                    if(true || sessionId == this.hostId){
                        // player.start =
                        if(player.pressedKeys.start ===1){
                                    console.log('pressed M')
                                    this.state.stage = 'running';
                                            respawn= true;

                        }

                    }
                });

                if (respawn ){
                    this.respawnPlayers();
                    respawn = false;
                }
                break;
            case 'running':
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
                //
                if (this.hasReachedTarget()) {
                    this.state.stage = 'winning';
                    setTimeout(() => {
                        //
                        this.state.stage = 'waiting';
                        // this.state.players.forEach(this.respawnPlayer);
                        this.state.players.clear();
                    }, 10000);
                }
                break;
            case 'winning':
                break;
        }

    }

    onLeave (client: Client) {
        this.state.players.delete(client.sessionId);
        //
        switch(this.state.stage) {
            case 'waiting':
                break;
            case 'running':
                if (this.state.players.size === 0) {
                    this.state.stage = 'waiting';
                }
                break;
            case 'winning':
                break;
        }
    }

    onDispose () {
    }

    respawnPlayer = (player: Player, position: number) => {
        // Math.floor((Math.random() * this.collision.map.spawns.length))
        let i = position;
        player.position.x = this.collision.map.spawns[i].x;
        player.position.y = 0;
        player.position.z = this.collision.map.spawns[i].z;
        player.position.heading = 0;
        player.animation = null;
    }

    respawnPlayers = () => {
        let i = 0;
        for (var [key, value] of this.state.players) {
            this.respawnPlayer(value, i % this.collision.map.spawns.length);
            ++i;
        }
    }

    hasReachedTarget = () => {
        let reachTarget = true;
        this.state.players.forEach((player, key, map) => {
            let dx = player.position.x - this.collision.map.target.x;
            let dz = player.position.z - this.collision.map.target.z;
            reachTarget = reachTarget && Math.sqrt(dx*dx + dz*dz) < 7;
        });
        return this.state.players.size > 0 && reachTarget;
    }

}

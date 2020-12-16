"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const colyseus_1 = require("colyseus");
const StateHandler_1 = require("./StateHandler");
const Player_1 = require("../entities/Player");
const Collision_1 = require("../collision/Collision");
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 8;
        this.respawnPlayer = (player) => {
            let i = Math.floor((Math.random() * this.collision.map.spawns.length));
            player.position.x = this.collision.map.spawns[i].x;
            player.position.y = 0;
            player.position.z = this.collision.map.spawns[i].z;
            player.position.heading = 0;
            player.animation = null;
        };
    }
    onCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setSimulationInterval(() => this.onUpdate());
            this.setState(new StateHandler_1.StateHandler());
            this.onMessage("key", (client, message) => {
                this.state.players.get(client.sessionId).pressedKeys = message;
            });
            this.collision = yield Collision_1.Collision.build('thinMaze');
        });
    }
    onJoin(client) {
        switch (this.state.stage) {
            case 'waiting':
                const player = new Player_1.Player();
                player.name = `Player ${this.clients.length}`;
                this.respawnPlayer(player);
                this.state.players.set(client.sessionId, player);
                if (this.state.players.size === 2) {
                    this.state.stage = 'running';
                    this.state.players.forEach(this.respawnPlayer);
                }
                break;
            case 'running':
                let reachTarget = true;
                this.state.players.forEach((player, key, map) => {
                    let dx = player.position.x - this.collision.map.target.x;
                    let dz = player.position.z - this.collision.map.target.z;
                    reachTarget = reachTarget && Math.sqrt(dx * dx + dz * dz) < 7;
                });
                if (reachTarget) {
                    this.state.stage = 'wins';
                }
                break;
            case 'wins':
                break;
        }
    }
    onUpdate() {
        if (this.state.stage === 'wins')
            return;
        this.state.players.forEach((player, sessionId) => {
            let step = 0.1;
            while (step > 0.01) {
                const np = new Collision_1.Position2D();
                np.x = player.position.x + Math.sin(player.position.heading) * player.pressedKeys.move * step;
                np.z = player.position.z + Math.cos(player.position.heading) * player.pressedKeys.move * step;
                if (this.collision.detect(np)) {
                    // console.log('no collision');
                    player.position.x = np.x;
                    player.position.z = np.z;
                    break;
                }
                else {
                    // console.log('collision');
                    step *= 0.5;
                }
            }
            player.position.heading += player.pressedKeys.spin * 0.03;
            player.animation = player.pressedKeys.animate;
        });
    }
    onLeave(client) {
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
    }
}
exports.GameRoom = GameRoom;

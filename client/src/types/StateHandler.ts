import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";

export class StateHandler extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type('string') stage: 'waiting' | 'running' | 'winning' = 'waiting';
}
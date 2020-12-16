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
exports.Collision = exports.Position2D = void 0;
var fetch = require('node-fetch');
class Position2D {
    constructor() {
        this.x = 0;
        this.z = 0;
    }
}
exports.Position2D = Position2D;
class Collision {
    constructor(mapText) {
        this.map = JSON.parse(mapText);
    }
    static build(mapName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://cse218.blob.core.windows.net/assets/${mapName}.json`;
            const resp = yield fetch(url);
            const mapText = yield resp.text();
            return new Collision(mapText);
        });
    }
    detect(position) {
        const X = this.map.row.size;
        const Z = this.map.col.size;
        const x = Math.round((position.x - this.map.row.offset) / this.map.row.scale);
        const z = Math.round((position.z - this.map.col.offset) / this.map.col.scale);
        // console.log(X, Z, x, z);
        return x >= 0
            && x < X
            && z >= 0
            && z < Z
            && this.map.dat[x][z] === 0;
    }
}
exports.Collision = Collision;

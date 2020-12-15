var fetch = require('node-fetch');

export class Position2D {
    x: number = 0;
    z: number = 0;
}

interface Transform {
    size: number,
    offset: number,
    scale: number
}

interface HeightMap {
    row: Transform,
    col: Transform,
    dat: Array<Array<number>>,
    spawns: Array<Position2D>,
    target: Position2D
    //landmarkpos: Array<Position2D>
}

export class Collision {
    constructor(mapText: string) {
        this.map = JSON.parse(mapText);
    }

    map: HeightMap;

    public static async build(mapName: string) : Promise<Collision> {
        const url = `https://cse218.blob.core.windows.net/assets/${mapName}.json`
        const resp = await fetch(url);
        const mapText = await resp.text();
        return new Collision(mapText);
    }

    public detect(position: Position2D) : boolean {
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

import * as BABYLON from "babylonjs";
import Keycode from "keycode.js";

import {createScene} from "./game/createScene";
import "./index.css";

const canvas = document.getElementById('game') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
let choice = true;
if (choice){
    createScene(canvas,engine);
}
import * as BABYLON from "babylonjs";
import {rotateSmallMaze, mainMenu, impotDude} from './utils/utils'
import "./index.css";



const canvas = document.getElementById('game') as HTMLCanvasElement;
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() 
{ return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };

var showStartMenu = function(){
   
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.31, 0.37, 0.67, 0.5);	
  
    var camera = new BABYLON.ArcRotateCamera("camera1",  -Math.PI / 2, Math.PI / 4, 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
    light.intensity = 0.8;

    rotateSmallMaze(scene);
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 3, height:3}, scene);

    //start menu & other options
    mainMenu(scene,canvas,engine);

    return scene;
};

//main engine loop...
var engine;
    try {
    engine = createDefaultEngine();
    } catch(e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    engine = createDefaultEngine();
    }
        if (!engine) throw 'engine should not be null.';
        scene = showStartMenu();;
        sceneToRender = scene

        engine.runRenderLoop(function () {
            if (sceneToRender && sceneToRender.activeCamera) {
                sceneToRender.render();
            }
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });






// const startMenu = new GUI.SelectionPanel(name);
//make loading scene


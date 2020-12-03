import * as BABYLON from "babylonjs";
<<<<<<< HEAD
import {rotateSmallMaze, mainMenu, impotDude} from './utils/utils'
import "./index.css";
=======
import Keycode from "keycode.js";

import { client } from "./game/network";
import {ANIMATE} from "./types";
>>>>>>> main



const canvas = document.getElementById('game') as HTMLCanvasElement;
<<<<<<< HEAD
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

=======
const engine = new BABYLON.Engine(canvas, true);

// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
// var camera = new BABYLON.FollowCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 50, 0), scene);


// This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

//import maze from github, and add to scene
var baseURL =  "https://raw.githubusercontent.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N/main/server/src/assets/";
var mazeFile = "thinMaze.glb";
BABYLON.SceneLoader.ImportMesh("", baseURL, mazeFile, scene);

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);

// Skybox
var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
var skyBoxURL = baseURL + "nebula/nebula";
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(skyBoxURL, scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;

// Attach default camera mouse navigation
// camera.attachControl(canvas);

// Colyseus / Join Room
client.joinOrCreate<StateHandler>("game").then(room => {
    const playerViews: {[id: string]: BABYLON.AbstractMesh} = {};

    room.state.players.onAdd = function(player, key) {
        var Walk:BABYLON.Animatable;

        BABYLON.SceneLoader.ImportMesh("him", baseURL + "players/", "Dude.babylon", scene,
            function (newMeshes, particleSystems, skeletons) {
                playerViews[key] = newMeshes[0];
                Walk = scene.beginAnimation(skeletons[0], 0, 100, true, 2.0);
                console.log(newMeshes)
                if (playerViews[key] != null) {

                    playerViews[key].rotation.y = Math.PI;
                    playerViews[key].position = new BABYLON.Vector3(0, 0, -80);
                    playerViews[key].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
                }

            }
        );

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        // playerViews[key] = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        // playerViews[key] = BABYLON.Mesh.CreateBox("box1", 1, scene);
        // playerViews[key].scaling.set(0.3, 1, 0.3);

        // Move the sphere upward 1/2 its height
        // playerViews[key].position.set(player.position.x, player.position.y, player.position.z);
        // playerViews[key].rotation.set(0, 0, 0);

        // Update player position based on changes from the server.
        player.position.onChange = () => {
            if (playerViews[key] != null) {
                playerViews[key].position.set(player.position.x, player.position.y, player.position.z);
                playerViews[key].rotation.set(0, player.position.heading, 0);
            }

            if (Walk != null) {
                if (player.animation == ANIMATE.WALK) {
                    Walk.restart();
                } else {
                    Walk.pause();
                }
            }

            if (key === room.sessionId) {
                var dist = 0.1;
                var x = player.position.x + dist * Math.sin(player.position.heading);
                var z = player.position.z + dist * Math.cos(player.position.heading);
                camera.position.set(x, player.position.y + 5, z);
                camera.rotation.set(0, player.position.heading + Math.PI, 0);

            }
        };

        // Set camera to follow current player
        if (key === room.sessionId && playerViews[key] != null) {
            camera.setTarget(playerViews[key].position);
        }
    };

    room.state.players.onRemove = function(player, key) {
        scene.removeMesh(playerViews[key]);
        delete playerViews[key];
    };

    room.onStateChange((state) => {
        console.log("New room state:", state.toJSON());
    });

    // Keyboard listeners
    const keyboard: PressedKeys = { spin: 0, move: 0, animate:null };
    window.addEventListener("keydown", function(e) {
        if (e.which === Keycode.A) {
            keyboard.spin = -1;
        } else if (e.which === Keycode.D) {
            keyboard.spin = 1;
        } else if (e.which === Keycode.W) {
            keyboard.move = -1;
            keyboard.animate = ANIMATE.WALK;
        } else if (e.which === Keycode.S) {
            keyboard.move = 1;
        }
        room.send('key', keyboard);
    });

    window.addEventListener("keyup", function(e) {
        if (e.which === Keycode.A) {
            keyboard.spin = 0;
        } else if (e.which === Keycode.D) {
            keyboard.spin = 0;
        } else if (e.which === Keycode.W) {
            keyboard.move = 0;

        } else if (e.which === Keycode.S) {
            keyboard.move = 0;
        }
        keyboard.animate = null;
        room.send('key', keyboard);
    });

    // Resize the engine on window resize
    window.addEventListener('resize', function() {
        engine.resize();
    });
});

// Scene render loop
engine.runRenderLoop(function() {
    scene.render();
});
>>>>>>> main

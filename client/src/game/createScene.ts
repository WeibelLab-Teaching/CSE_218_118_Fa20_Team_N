
import "../index.css";

import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import Keycode from "keycode.js";

import {client } from "./network";
import {ANIMATE} from "../types";
import {name} from './displayName';

// Re-using server-side types for networking
// This is optional, but highly recommended
import { StateHandler } from "../../../server/src/rooms/StateHandler";
import { PressedKeys } from "../../../server/src/entities/Player";
import { Vector2, Vector3 } from "babylonjs";
import 'babylonjs-loaders';
import { text } from "body-parser";
import { playerControlMenu} from "../utils/utils";


export function createScene(canvas, engine){
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    //physics and gravity added to scene
    scene.enablePhysics ( new BABYLON.Vector3(0, -9.81,0));
    // This creates and positions a free camera (non-mesh)    Vector3( x=l/r,y=up,z=l/r)
    // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0.5, -10), scene);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 50, 0), scene);

    //consider UniversalCamera- 1st choice for fps, has collisions and can add many inputs

    // camera.applyGravity = true;

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas,true);


    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    //green material
    var testMat = new BABYLON.StandardMaterial("mat", scene);
    testMat.diffuseColor = new BABYLON.Color3(0,1,0);

    //import maze from github, and add to scene
    var baseURL =  "https://raw.githubusercontent.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N/main/server/src/assets/";
    var baseUrl2 = "https://raw.githubusercontent.com/Jmalva/TeamN_Assets/main/";
    var mazeName1 = "mazes/thinMaze.glb";
    // landmark paths and names
    var lmpath = "landmarks/";
    var internal_LMs = ["angel.stl", "nike.stl", "palm_tree.obj"];
    var external_LMs = ["eiffel_tower.stl", "pyramid.stl"];

    var brickMat = new BABYLON.StandardMaterial("brick",scene);
    // brickMat.bumpTexture = new BABYLON.Texture("https://i.imgur.com/yn98ktz.png",scene);
    brickMat.diffuseTexture  = new BABYLON.Texture("https://i.imgur.com/yn98ktz.png",scene);
    brickMat.diffuseTexture.scale(3);
	// brickMat.diffuseTexture.vOffset = 0.5;


    var maze =BABYLON.SceneLoader.ImportMesh("", baseUrl2, 'thinMaze.glb', scene, function(meshes){
        // apply my own materials
        meshes[1].checkCollisions = true;
        
    });

    
    //Dialog for User to Know Available Actions
    playerControlMenu();
    
    
    // Ground material
    var tempLMPath = "https://raw.githubusercontent.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N/ad-landmarks/server/src/assets/landmarks/";
    
    loadLandmarks(scene);
    
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
    var groundMat = new BABYLON.StandardMaterial("ground",scene);
    groundMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png",scene);
    groundMat.bumpTexture
    ground.material = groundMat;

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




    // Colyseus / Join Room
    client.joinOrCreate<StateHandler>("game").then(room => {
        const playerViews: {[id: string]: BABYLON.AbstractMesh} = {};
        console.log("New room state:", room.state.stage);
        var currentRoomState = room.state.stage;
        var advancedTexture1 = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var text1 = new GUI.TextBlock();

        room.state.players.onAdd = function(player, key) {
            var Walk:BABYLON.Animatable;
            console.log(player, "has been added at", key);

            BABYLON.SceneLoader.ImportMesh("him", baseURL + "players/", "Dude.babylon", scene,
                function (newMeshes, particleSystems, skeletons) {
                    playerViews[key] = newMeshes[0];
                    Walk = scene.beginAnimation(skeletons[0], 0, 100, true, 2.0);
                    if (playerViews[key] != null) {

                        playerViews[key].rotation.y = Math.PI;
                        playerViews[key].position = new BABYLON.Vector3(0, 0, -80);
                        playerViews[key].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
                    }

                }
        );

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
                    var dist = 0.05;
                    var x = player.position.x + dist * Math.sin(player.position.heading);
                    var z = player.position.z + dist * Math.cos(player.position.heading);
                    camera.position.set(x, player.position.y + 4, z);
                    camera.rotation.set(0, player.position.heading + Math.PI, 0);

                }
            };

            // Set camera to follow current player
            if (key === room.sessionId && playerViews[key] != null) {
                camera.setTarget(playerViews[key].position);
                camera.ellipsoid = new BABYLON.Vector3(1.5, 2, 1.5);
                // alt option
                camera.collisionMask=(0.5);
            }
        };

        room.state.players.onRemove = function(player, key) {
            scene.removeMesh(playerViews[key]);
            delete playerViews[key];
        };

        room.onStateChange((state) => {
            // console.log("New room state:", state.toJSON());
            // var text2 = new GUI.TextBlock();

            // if (state.stage == 'waiting') {
            //     // advancedTexture1.removeControl(text1)
            //     text1.text = "Waiting state..";
            //     text1.color = "green";
            //     text1.fontSize = 36;
            //     advancedTexture1.addControl(text1);
            // }
            //  if (state.stage == 'running') {
            //     advancedTexture1.removeControl(text1)
            //     text2.text = "Running state..";
            //     text2.color = "red";
            //     text2.verticalAlignment= GUI.Control.VERTICAL_ALIGNMENT_TOP;
            //     text2.fontSize = 36;
            //     advancedTexture1.addControl(text2);
            // }
            if (state.stage != currentRoomState) {
                if (state.stage == 'winning' ) {
                    advancedTexture1.removeControl(text1)
                    text1.text = "Congratulations!\nYou are amazeing!";
                    text1.color = "green";
                    text1.fontSize = 36;
                    advancedTexture1.addControl(text1);
                } else if (state.stage == 'waiting') {
                    advancedTexture1.removeControl(text1)
                    text1.text = "Waiting for others to join...\n Please press m to start";
                    text1.color = "green";
                    text1.fontSize = 36;
                    advancedTexture1.addControl(text1);
                } else {
                    advancedTexture1.removeControl(text1)
                    text1.text = "";
                    advancedTexture1.addControl(text1);
                }
            }
            
            // advancedTexture1.removeControl(text1)
            currentRoomState = state.stage;

        });
        room.state.players.onChange = (player, key) => {
            console.log(player, "have changes at", key);
        };

        // Keyboard listeners
        const keyboard: PressedKeys = { spin: 0, move: 0, animate:null, start:0 };
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
            else if (e.which === Keycode.M){
                keyboard.start = 1;
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
            else if (e.which === Keycode.M){
                keyboard.start = 0;
            }
            keyboard.animate = null;
            room.send('key', keyboard);
        });

        // Resize the engine on window resize
        window.addEventListener('resize', function() {
            engine.resize();
        });
    });

     //collisions..
     scene.collisionsEnabled = true;
     camera.checkCollisions = true;
     ground.checkCollisions = true;

    // Scene render loop
    engine.runRenderLoop(function() {
        scene.render();
    });

}
function loadLandmarks(scene){
    var tempLMPath = "https://raw.githubusercontent.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N/ad-landmarks/server/src/assets/landmarks/";

    var angel = BABYLON.SceneLoader.ImportMesh("", tempLMPath,
        "angel.stl",
        scene,
        function(newMeshes){
            newMeshes.forEach(function(mesh){
                mesh.scaling = new BABYLON.Vector3(0.05,0.05,0.05);
                mesh.position = new BABYLON.Vector3(22.11, 0, 20.9 );
            })
        } );

    var nike = BABYLON.SceneLoader.ImportMesh("", tempLMPath,
        "nike.stl",
        scene,
        function(newMeshes){
            newMeshes.forEach(function(mesh){
                mesh.scaling = new BABYLON.Vector3(0.04,0.04,0.04);
                mesh.position = new BABYLON.Vector3(14.76, 0, -29.5);
            })
        } );

    var palm = BABYLON.SceneLoader.ImportMesh("", tempLMPath,
        "palm_tree.obj",
        scene,
        function(newMeshes){
            newMeshes.forEach(function(mesh){
                mesh.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
                mesh.position = new BABYLON.Vector3(-11.0899, 0, -4.602);
            })
        } );
    var yellowMat = new BABYLON.StandardMaterial('pyramid',scene);
    yellowMat.diffuseColor =  new BABYLON.Color3(0.51, 0.5, 0.09);
    var pyramid = BABYLON.SceneLoader.ImportMesh("", tempLMPath,
        "pyramid.stl",
        scene,
        function(newMeshes){
            newMeshes.forEach(function(mesh){

                mesh.position = new BABYLON.Vector3(5.06, 0, 100);
                mesh.material= yellowMat;
            })
        } );
    var towerMat = new BABYLON.StandardMaterial('pyramid',scene);
    towerMat.diffuseColor =  new BABYLON.Color3(0.32, 0.05, 0.26);
    var tower = BABYLON.SceneLoader.ImportMesh("", tempLMPath,
        "eiffel_tower.stl",
        scene,
        function(newMeshes){
            newMeshes.forEach(function(mesh){
                mesh.rotation = new BABYLON.Vector3(-3.14/2, 0 , 0);
                mesh.scaling = new BABYLON.Vector3(0.8,0.8,0.8);
                mesh.position = new BABYLON.Vector3(-7.5, 0, -50);
                mesh.material =towerMat;
            })
        } );
}

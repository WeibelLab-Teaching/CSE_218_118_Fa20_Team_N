import { Scene } from "@babylonjs/core";
import * as BABYLON from "babylonjs";
import { Vector2, Vector3 } from "babylonjs";
import * as GUI from "babylonjs-gui";
import Keycode from "keycode.js";
import {rotateSmallMaze} from './utils/utils'

import {createScene} from "./game/createScene";
import "./index.css";
const canvas = document.getElementById('game') as HTMLCanvasElement;
var engine = null;//new BABYLON.Engine(canvas, true);
var scene = null;
var sceneToRender = null;
let choice = true;
var createDefaultEngine = function() 
{ return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };

var startMenu = function(){
   
    // scene.createDefaultSkybox

    //if user selects this -> start default game


    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.31, 0.37, 0.67, 0.5);	
  
    var camera = new BABYLON.ArcRotateCamera("camera1",  -Math.PI / 2, Math.PI / 4, 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
    light.intensity = 0.8;
   
    var blueMat = new BABYLON.StandardMaterial("blue", scene);
    blueMat.emissiveColor = new BABYLON.Color3(0,0,1);

    var redMat = new BABYLON.StandardMaterial("red", scene);
    redMat.emissiveColor = new BABYLON.Color3(1,0,0);
    
    rotateSmallMaze(scene);
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 3, height:3}, scene)
  

    //setcolor function
    var setColor = function(but) {   
		switch(but) {
            case 0: 
                return blueMat;
            break
            case 1: 
                // box.material = redMat;
                
            console.log("start was pressed!");
            break
        }
    } 
    //start Game
    var start = function(but){
        if(but){
            createScene(canvas,engine);
            console.log("start was pressed!");
        }
    }
    //select player TODO

    //enter userName
    var displayName = new GUI.InputText();
    displayName.text = "user";

    //select Maze function

    //share Link function


    // createFullScreen not to be used in webvr, ufse adbancedDynamicTexture.creeateformesh
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    var selectBox = new GUI.SelectionPanel("sp");
    selectBox.width = 0.30;
    selectBox.height = 0.25;
    selectBox.background = "white";
    selectBox.left = '5px';
    selectBox.top  = '130px';

    // start button
    var button1 = GUI.Button.CreateSimpleButton("", " Start Game");
            button1.width = 0.34;
            button1.height = 0.2;
            button1.color = "white";
            button1.fontSize = 15;
            button1.background = "red";
            button1.top         = '30px';
            button1.left        = '0px';

     button1.onPointerClickObservable.add(function (){
        createScene(canvas,engine);
        console.log("start was pressed!");
     });
    //  button1.link
    advancedTexture.addControl(selectBox);

	var transformGroup = new GUI.CheckboxGroup("Menu");
	transformGroup.addCheckbox("Share Game ~IP", );
    // transformGroup.addCheckbox("High", );


    var startMenu = new GUI.CheckboxGroup('Start');
     startMenu.addCheckbox("Start Game", function (){
        createScene(canvas,engine);
        console.log("start was pressed!");
     });

    var choosePlayerGroup = new GUI.SelectionPanel('player');
    // choosePlayerGroup.addToGroupRadio()
	
    //Add Available Options Here
    selectBox.addGroup(transformGroup); //generate link
    selectBox.addControl(button1); //startbutton
    
     
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
        scene = startMenu();;
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



import * as BABYLON from "babylonjs";

import { Vector2, Vector3 } from "babylonjs";
import * as GUI from "babylonjs-gui";
import {createScene} from "../game/createScene";
//base variables
var baseURL =  "https://raw.githubusercontent.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N/main/server/src/assets/";
var mazeName1 = "mazes/thinMaze.glb";
var mazeName2 = "mazes/hardMaze.babylon";

export function playerControlMenu(){
    // GUI
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // make panel to host our text and define dimension
    var panel = new GUI.StackPanel();   
    panel.width=.20;
    panel.height=.20;
    
    var text1 = new GUI.TextBlock("text1");
    text1.fontFamily = "Helvetica";
    text1.textWrapping = true;
    
    text1.text = "Player Controls:\nMove forward: W\nMove backward: S\n Spin Left: A  Spin Right: D";
    // \n To start the game press Enter";
    text1.color = "white";
    text1.fontSize = "16px";
    panel.addControl(text1);

    //style for panel
    var style = advancedTexture.createStyle();
    panel.style = style;
    
    // background and set alignment
    panel.background = 'black';
    panel.alpha=.85;
    panel.left = -40;
    panel.horizontalAlignment=GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment=GUI.Control.VERTICAL_ALIGNMENT_TOP;
    
    // add panel to UI
    advancedTexture.addControl(panel);   
}

 export function _loadingStateDialog() {}
 
export const rotateSmallMaze = (scene)=>{
    var brickMat = new BABYLON.StandardMaterial("brick",scene);
    brickMat.diffuseTexture  = new BABYLON.Texture("https://i.imgur.com/yn98ktz.png",scene);
    brickMat.diffuseTexture.scale(2);

    var testMat = new BABYLON.StandardMaterial("mat", scene);
    testMat.diffuseColor = new BABYLON.Color3(0,1,0);
    var assetsMan = new BABYLON.AssetsManager(scene);
    var meshTask = assetsMan.addMeshTask("","", baseURL,mazeName2);
    var m = meshTask.onSuccess = function(task){
        // task.loadedMeshes[0].position = new BABYLON.Vector3(0,0,0);
        var mesh = task.loadedMeshes[0];
        mesh.material = brickMat;
        mesh.scaling = new Vector3(1,1,1);
        mesh.setPositionWithLocalVector(new Vector3(0,.05,0));
        // brickMat.diffuseTexture.scale(.);

         //Sun animation
        scene.registerBeforeRender(function () {
            mesh.rotate(new Vector3(0,.5,0), 0.01,BABYLON.Space.LOCAL);
    });
        
    } 

    assetsMan.load();
}

export function mainMenu(scene,canvas,engine){
    
   
    var blueMat = new BABYLON.StandardMaterial("blue", scene);
    blueMat.emissiveColor = new BABYLON.Color3(0,0,1);

    var redMat = new BABYLON.StandardMaterial("red", scene);
    redMat.emissiveColor = new BABYLON.Color3(1,0,0);
    
    
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

    var startMenu = new GUI.CheckboxGroup('Start');
     startMenu.addCheckbox("Join Game", function (){
        createScene(canvas,engine);
        console.log("start was pressed!");
     });

    var choosePlayerGroup = new GUI.SelectionPanel('player');
    // choosePlayerGroup.addToGroupRadio()
	
    //Add Available Options Here
    selectBox.addControl(button1); //startbutton    
}

//dude?
// Dude
export const impotDude =(scene) =>{
    const walk = function (turn, dist) {
        this.turn = turn;
        this.dist = dist;
    }

    const track = [];
    track.push(new walk(180, 2.5));
    track.push(new walk(0, 5));
    //what is result?
    BABYLON.SceneLoader.ImportMeshAsync("him", baseURL, "/players/"+ "Dude.babylon", scene).then((result) => {
        var dude = result.meshes[0];
        dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);
        
        
        dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
        dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-90), BABYLON.Space.LOCAL);
        const startRotation = dude.rotationQuaternion.clone();    
        
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
        
        let distance = 0;
        let step = 0.015;
        let p = 0;
    
        // scene.onBeforeRenderObservable.add(() => {
        //     // if (carReady) {
        //     //     if (!dude.getChildren()[1].intersectsMesh(hitBox) && scene.getMeshByName("car").intersectsMesh(hitBox)) {
        //     //         return;
        //     //     }
                
        //     // }
        //     dude.movePOV(0, 0, step);
        //     distance += step;
            
        //     if (distance > track[p].dist) {
                
        //         dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
        //         p +=1;
        //         p %= track.length; 
        //         if (p === 0) {
        //             distance = 0;
        //             dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
        //             dude.rotationQuaternion = startRotation.clone();
        //         }
        //     }
            
        // })
    });
}
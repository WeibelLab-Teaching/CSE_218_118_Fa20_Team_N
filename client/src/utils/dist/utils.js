"use strict";
exports.__esModule = true;
exports.rotateSmallMaze = void 0;
var BABYLON = require("babylonjs");
var babylonjs_1 = require("babylonjs");
//base variables
var baseURL = "https://raw.githubusercontent.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N/main/server/src/assets/";
var mazeName1 = "mazes/thinMaze.glb";
var mazeName2 = "mazes/hardMaze.babylon";
exports.rotateSmallMaze = function (scene) {
    var brickMat = new BABYLON.StandardMaterial("brick", scene);
    brickMat.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/yn98ktz.png", scene);
    brickMat.diffuseTexture.scale(2);
    var testMat = new BABYLON.StandardMaterial("mat", scene);
    testMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    var assetsMan = new BABYLON.AssetsManager(scene);
    var meshTask = assetsMan.addMeshTask("", "", baseURL, mazeName2);
    var m = meshTask.onSuccess = function (task) {
        // task.loadedMeshes[0].position = new BABYLON.Vector3(0,0,0);
        var mesh = task.loadedMeshes[0];
        mesh.material = brickMat;
        mesh.scaling = new babylonjs_1.Vector3(1, 1, 1);
        mesh.setPositionWithLocalVector(new babylonjs_1.Vector3(0, .05, 0));
        // brickMat.diffuseTexture.scale(.);
        //Sun animation
        scene.registerBeforeRender(function () {
            mesh.rotate(new babylonjs_1.Vector3(0, .5, 0), 0.01, BABYLON.Space.LOCAL);
        });
    };
    assetsMan.load();
};

# aMAZEing

*Some of you may be lost in these troubling times, but why not get lost together?*

This project is a multiplayer game where players work together to find their way inside a maze. They can use the landmarks placed inside and around the maze as points of reference to help with directions; they can also communicate with each other via audio chat to share information.

**TO ACCESS THE APP, GO HERE: https://amazeingclient.herokuapp.com**

## What we wanted to accomplish

When presented with the task to come up with a project idea in October 2020, we were in the middle of the COVID-19 pandemic. We looked at our experiences dealing with the situation, and we realized a few things:

- The constant isolation we have been living in has significantly decreased our social interactions
- With fewer social interactions, the individuals have been feeling more lonely
- Overall, this environment has lead to an increase in cases of depression and anxiety across the whole population

This is why we decided to build a game that would allow people to find something to entertain themselves during isolation, while also giving them a chance to interact with different people to hopefully form a bond and have a virtual break from the loneliness we have all been feeling.

## How we accomplished it

Here you can see two storyboards to represent the core features of our application: a user walking around the maze, the ability to communicate with the other players, and the landmarks inside and outside of the maze.

Users can enter and walk around the maze to find the rest of the team and reach the exit.

![Storyboard 1](./readme_pics/storyboard1.png)

Users can communicate with the rest of the team and look at the landmarks to find their way through the maze.

![Storyboard 2](./readme_pics/storyboard2.png)

### Features

- A basic environment with a maze
- A menu to start the game
- Users can move in the environment
- Users can interact with each other
- The maze has a finish point
- Each user needs to reach the finish point in order to win
- The maze has landmarks to aid the players

![Start Menu](./readme_pics/startmenu.png)

![Overview](./readme_pics/overview.png)

![Player 1](./readme_pics/player1.png)

![Player 2](./readme_pics/player2.png)

![Landmark](./readme_pics/landmark.png)

![Victory](./readme_pics/victory.png)

### Architecture and Data Flow

This project uses Babylon.js to render the game environment, and Colyseus for the multiplayer game logic. The audio communication is implemented using WebRTC.

![Architecture Diagram](./readme_pics/architecture.png)

On the server side, we have two servers both running on Node.js. We have a game server consisting of two modules, one module providing audio chat functionality with WebRTC, the other one implementing the game logic with Colyseus. Colyseus is a framework that provides state synchronization between different clients. The second server is the web server, which simply hosts the client's JavaScript code. Both servers are hosted on the same Amazon EC2 instance when demoing remotely.

Both client and server code is written in TypeScript.

![Dataflow Diagram](./readme_pics/dataflow.png)

The client (user) sits in the middle of the data flow. For the audio chat part, the clients will send a WebRTC signal to the WebRTC server, which will respond with the other clients' port and address information. Then, the clients will establish a peer-to-peer connection with each other, without further need to talk to the WebRTC server. For the game state synchronization part, the clients will post their actions (e.g. keyboard presses) to the Colyseus server, which runs the game logic. The server will then calculate the new state and push it to the clients. It is important to note there is only one authoritative game logic running on the server: the action is going one-direction from client(s) to server, the updated state is also going one-direction from server to clients.

## How to get started

**TO ACCESS THE APP, GO HERE: https://amazeingclient.herokuapp.com**

Our repository structure is divided into two main directories:

- [server](./server)
- [client](./client)

The [readme_pics](./readme_pics) directory just contains the pictures rendered in this README.

Both the `server` and `client` directories have their own `package.json` as they are two environments saparate from each other, as outlined in the architecture diagrams.

The relevant files of `server` are all stored in `server/src`:

- [index.ts](./server/src/index.ts) is the main driver for the server code
- [assets/](./server/src/assets) has the graphic components of the game, like the maze itself, the avatars used to represent the players, and the landmarks
- [audio/Signaling.ts](./server/src/audio/Signaling.ts) has the WebRTC logic
- [collision/Collision.ts](./server/src/collision/Collision.ts) has the logic for collision detection (when a player collides against a wall)
- [entities/Player.ts](./server/src/entities/Player.ts) stores the properties of a player (like its coordinates)
- [rooms/](./server/src/rooms/) has the main game room logic inside `GameRoom.ts`, and defines the game room states inside `StateHandler.ts`

Equivalently, the main files of `client` are all stored in `client/src`:

- [webpack.config.js](./client/webpack.config.js) has the Webpack configuration so that Webpack knows how to pack the source code into `bundle.js`
- [index.css](./client/src/index.css) is the style sheet of the web page
- [index.html](./client/src/index.html) is the HTML of the web page; the body contains a `canvas` element for Babylon JS to render
- [main.ts](./client/src/main.ts) is the entrance script; it initializes the Babylon JS engine, the start menu, the Colyseus module, and the WebRTC audio chat module
- [types.ts](./client/src/types.ts) has the type definitions of client-only types, currently the player animcation enumerate
- [utils/](./client/src/utils/) has utility code; we separate it from main code to make the main code focus on game logic
- [game/createScene.ts](./client/src/game/createScene.ts) has the client-side game logic; depending on the state, either the start menu or the game canvas is rendered
- [audio/audio.ts](./client/src/audio/audio.ts) has the WebRTC audio chat code; it exports the `audio_init()` function as module initializer

### How to run locally

Check out this repository.

```
git clone https://github.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N.git
```

Inside this repository, there's two separate applications. The client (babylonjs + colyseus client) and the server (nodejs + colyseus server).

#### Server application

To be able to build the server application, you'll need to enter in the folder,
and install its dependencies first.

```
cd CSE_218_118_Fa20_Team_N/server
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn two web socket servers, listening on [ws://localhost:2657](ws://localhost:2657) and [ws://localhost:2658](ws://localhost:2658).

#### Client application

For the client, the steps are exactly the same. Install the dependencies:

```
cd CSE_218_118_Fa20_Team_N/client
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn the `webpack-dev-server`, listening on [http://localhost:8080](http://localhost:8080).

## Maintainance

This project was developed between October and December 2020 by Team N for the joint CSE 118/218 class at UC San Diego.

Our team is composed of:

- **Jocelyn Alvarez**, B.S. in Computer Engineering(Winter '21), Bay Area Native, interested in data science, full-stack developing and espresso based drinks 
- **Arnold De Guzman**, B.S. in Computer Engineering (UCSD Class of 2021), born in the Philippines and raised in San Diego. Interested in computer graphics and solving puzzles
- **Fan Jin**, M.S in computer science (UCSD class of 2021), born and raised in China and earned bachelor’s degree from Tsinghua. After graduation, he will become a software engineer at Amazon in Seattle. He loves music and traveling
- **Alberto Nencioni**, M.S. in Computer Science (UCSD Class of 2022) with specialization in Systems; born and raised in Italy, he moved to the U.S. for his undergraduate at UCSD, which he completed in 2020
- **Shanshan Xiao**, M.S. in Computer Science (UCSD Class of 2021) with specialization in A.I.; born and raised in China, she will graduate this quarter and move to  the Bay Area

These same students are responsible for maintaining the project.

## How to get help

If you have questions about this project, you can reach out to any of us at:

- jmalvare@ucsd.edu
- ajdeguzm@ucsd.edu
- f1jin@ucsd.edu
- anencion@ucsd.edu
- s3xiao@ucsd.edu

If you have more general questions about the tools we used, you can visit these links:

- [Babylon.js](https://doc.babylonjs.com/)
- [Colyseus](https://docs.colyseus.io/)
- [WebRTC](https://webrtc.org/getting-started/overview)

## License

Apache License 2.0

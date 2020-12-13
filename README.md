# aMAZEing

This project is a multiplayer game where players work together to find their way inside a maze. They can use the landmarks placed inside and around the maze as points of reference to help with directions; they can also communicate with each other via audio chat to share information.

## What we wanted to accomplish

When presented with the task to come up with a project idea in October 2020, we were in the middle of the COVID-19 pandemic. We looked at our experiences dealing with the situation, and we realized a few things:

- The constant isolation we have been living in has significantly decreased our social interactions
- With fewer social interactions, the individuals have been feeling more lonely
- Overall, this environment has lead to an increase in cases of depression and anxiety across the whole population

This is why we decided to build a game that would allow people to find something to entertain themselves during isolation, while also giving them a chance to interact with different people to hopefully form a bond and have a virtual break from the loneliness we have all been feeling.

## How we accomplished it

Here you can see two storyboards to represent the core features of our application: a user walking around the maze, the ability to communicate with the other players, and the landmarks inside and outside of the maze.

TODO ADD STORYBOARDS HERE

### Features

TODO ADD PICTURES

- A basic environment with a maze
- A menu to start the game
- Users can move in the environment
- Users can interact with each other
- The maze has a finish point
- Each user needs to reach the finish point in order to win
- Users spawn in different spots of the maze
- The maze has landmarks to aid the players

### Architecture and Data Flow

This project uses Babylon.js to render the game environment, and Colyseus for the multiplayer game logic. The audio communication is implemented using WebRTC.

## How to get started

### How to run locally

Check out this repository.

```
git clone https://github.com/endel/babylonjs-multiplayer-boilerplate.git
```

Inside this repository, there's two separate applications. The client (babylonjs + colyseus client) and the server (nodejs + colyseus server).

#### Client application

To be able to build the client application, you'll need to enter in the folder,
and install its dependencies first.

```
cd babylonjs-multiplayer-boilerplate/client
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn the `webpack-dev-server`, listening on [http://localhost:8080](http://localhost:8080).


#### Server application

For the server, the steps are exactly the same. Install the dependencies:

```
cd babylonjs-multiplayer-boilerplate/server
npm install
```

Now you can build and run it by running:

```
npm start
```

It will spawn a web socket server, listening on [ws://localhost:2657](ws://localhost:2657).

## Maintainance

This project was developed between October and December 2020 by Team N for the joint CSE 118/218 class at UC San Diego.

Our team was composed of:

- **Jocelyn Alvarez**,
- **Arnold De Guzman**,
- **Fan Jin**,
- **Alberto Nencioni**, M.S. in Computer Science (UCSD Class of 2022) with specialization in Systems; born and raised in Italy, he moved to the U.S. for his undergraduate at UCSD, which he completed in 2020
- **Shanshan Xiao**,

## How to get help

## License

Apache License 2.0

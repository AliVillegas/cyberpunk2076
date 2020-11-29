## **Contents**

[Running the project](#To-run)

[Deploying the project](#Deployment)

[Models](#Models)

[Project Requeriments](#Project-Requirements)

[Documentation](#Documentation)


## To run
install nodejs
and run the following at /cyberpunk2076/:

```
npm install
npm run
```
## Deployment

Bundle your code, and push it in your repo:
```bash
npm run build
git add
git commit -m "Deploying on GitHub Pages"
git push
```
## Formatting
The code can be formated with prettier:
```bash
npm run format
```

## Models 

Car https://sketchfab.com/3d-models/low-poly-car-27aa13c2bbd446d2bce15375c69b5792

Truck https://sketchfab.com/3d-models/cybertruck-8bbac406787f4bc5904544179dc9f709

Trailer  https://sketchfab.com/3d-models/truck-with-trailer-a8daa0214e994562b1723c57f899cec9

City https://sketchfab.com/3d-models/gradient-city-184aa31b02274d5288debcc3acfbb83c

## Project Requirements

-Collision with other cars

-Post processing Effects

-Objects moving in background 

-Music

-Game Menu

-Mobile compatibility 

## Documentation

This project was developed using ThreeJs. 
We used GLTF models for every object within our game 

***Documentation Notes*** 
[Main Menu](#Main-Menu)

[Scene](#Scene)

[Loading Models](#Loading-Models )

[Music ](#Music)

[Post Processing](#Post-processing)

[Obstacles](#Procedural-Obstacles)

[City](#City)

[Collisions](#Collisions)

[HUD](#Distance-travelled-and-Score )

[High Score](#Storing-User-High-Score )


### Main Menu
This was created using standard js html and css  with a responsive view in mind to allow mobile compatibility

### Scene
The scene is created using a Standard WebGL canvas compatible with Threejs 
Here we set the camera and renderers in order to control our scene 

### Loading Models 
For loading every model such as cars, incoming trucks and Trailers. Coins and the city
we used a GLTF loader bundled within Threejs Examples 

### Music 
In order to load music into our game we used a Three audiolistener. 
This allows you to create a media object bundled with our theme song 

### Post processing
For post processing effects we used Threejs Effectrenderer and EffectPasses.
In order to show a bloom effect within our scene. 

### Procedural Obstacles
Incoming cars, trucks and trailers spawn randomly throught our game. This spawning becomes harder and harder as the time goes on.
This was achieved using standard SetTimeoutFunctions and spawnrate variables. 
Furthermore a spawn percentage multiplier was chosen to manage the rarity of trucks and trailers 
The movement of these obstacles was managed using TWEEN animations 

### City
To populate our scene we decided to add a moving city background. 
This was achieved by loading a city model and then scaling its size massively 
The movement of the city was managed using TWEEN animations. With a really slow time we created the effect of going through the city. An array of 5 colors was created to spawn different variants of the city. And to further increase the uniqueness of each city we randomly rotated the spawn point of the city to simulate a different city every 10 seconds. 


### Coins 
Coins are spawned similarly as our obstacles. However, a rarity multiplier was applied in order to spawn figures such as squares, triangles and circles. These figures were created using THREE js groups and adding them to the scene as a single object. 

### Collisons 

These were possible using Threejs own collision implementation with Box3. So every time our friendly car came into contact with any obstacle a method is fired to modify the score of the user. 

### Distance Travelled and Score 

In order to display the HUD info to the user, we used css and html text. This is being modified on every frame with js. 

### Storing User High Score

We used localstorage to save the user highest score for next games. 





## Live Demo


Live demo of current build: https://alivillegas.github.io/cyberpunk2076/

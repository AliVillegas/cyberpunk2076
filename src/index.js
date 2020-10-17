import * as THREE from 'three'
import * as OrbitControls from 'three-orbitcontrols'
import * as FBXLoader from 'three-fbx-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as TWEEN from 'three-tween'


import { WEBGL } from './webgl'
import './modal'
import { Vector3 } from 'three'
//CHECKING IF USER IS ON A SMARTPHONE
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
if (isMobile.any()) {
    var mobileMessage = document.getElementById("mobileMessage");
    mobileMessage.style.display = "block";
    var content = 'some content';
    document.getElementsByTagName('body')[0].innerHTML = "";
} else {

    var game = document.getElementById("game");
    game.style.display = "block";
}

if (WEBGL.isWebGLAvailable()) {
    var camera, scene, renderer
    var controls
    var objects = []
    var cursorX;
    var cursorY;
    var mainShip;
    var mouse;
    var gltfLoader;
    let mainShipColor = 0xffd300
    let mainShipColorLights = 0x5d1de7
        //CAR
    const baseScale = 0.05 * 0.05
        //OBSTACLES
    let spwanItem = false
    let obstacles = []
        //TWEEN 
    let interpolationType = TWEEN.Interpolation.Linear,
        easingFunction = TWEEN.Easing.Quadratic.InOut;
    let carMoving = null
    init()
    render()

    function init() {
        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            10000
        )
        camera.position.set(0, 0, -100)
        camera.lookAt(0, 0, 0)

        scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf0f0f0)
        mouse = new THREE.Vector2();

        // lights

        var ambientLight = new THREE.AmbientLight(0x606060, 1)
        scene.add(ambientLight)

        var directionalLight = new THREE.DirectionalLight(0xffffff)
        directionalLight.position.set(1, 0.75, 0.5).normalize()
        scene.add(directionalLight)

        renderer = new THREE.WebGLRenderer({ antialias: true })

        //controls
        controls = new OrbitControls(camera, renderer.domElement);

        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        scene.background = new THREE.Color(0x222222);

        document.body.appendChild(renderer.domElement)

        // Instantiate a loader
        var loader = new GLTFLoader();
        gltfLoader = loader
            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        var dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/js/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        // Load a glTF resource
        gltfLoader.load(
            // resource URL
            'static/models/car/scene.gltf',
            // called when the resource is loaded
            function(car) {
                mainShip = car.scene
                car.scene.traverse((o) => {
                    if (o.isMesh) {
                        console.log(o.name)
                        if (o.name === "Low_Poly_Car_Mat1_0") {
                            o.material.emissive = new THREE.Color(mainShipColor)
                        }
                        //material.emissive = new THREE.Color(mainShipColor);

                        if (o.name === "Rear_Bumper_Mat8_0" || o.name === "Emergency_Light_Mat5_0") {
                            o.material.emissive = new THREE.Color(mainShipColorLights)
                        }

                    }
                });
                //console.log(car)
                car.animations; // Array<THREE.AnimationClip>
                car.scene; // THREE.Group
                car.scenes; // Array<THREE.Group>
                car.cameras; // Array<THREE.Camera>
                car.asset; // Object
                //car.scene.material.color.set("#FF")
                car.scene.scale.set(baseScale, baseScale, baseScale)
                car.scene.rotation.y += 3.1416
                car.scene.position.z = -95
                    //console.log(car.scene)
                scene.add(mainShip);

            },
            // called while loading is progressing
            function(xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function(error) {

                console.log('An error happened');

            }
        );
        doSomethingAfterXseconds(3)

        // listeners
        window.addEventListener('resize', onWindowResize, false)
    }

    function createGlowingBox() {

    }
    document.onmousemove = function(e) {
        var raycaster = new THREE.Raycaster(); // create once
        // create once
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        //console.log("Cursor at: " + mouse.x + ", " + mouse.y)
        //z rotations +- 0.5
        if (mainShip) {

            //mainShip.rotation.z = -0.5
            mainShip.position.set(-mouse.x * 3, mouse.y * 2, -95)

            //carGoingRight = false
            cursorX = mouse.x
            cursorY = mouse.y
        }

    }

    function spawnIncomingCar() {
        console.log("Spawning incoming Car")
        gltfLoader.load(
            // resource URL
            'static/models/car/scene.gltf',
            // called when the resource is loaded
            function(car) {
                car.scene.scale.set(baseScale, baseScale, baseScale)
                car.scene.traverse((o) => {
                    if (o.isMesh) {

                        o.material.emissive = new THREE.Color(Math.random() * 0xffffff);
                    }
                });
                console.log(car)
                spawnObstacleAtDistance(car.scene)
            },
            // called while loading is progressing
            function(xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function(error) {

                console.log('An error happened');

            }
        );
    }

    function doSomethingAfterXseconds(s) {
        setTimeout(
            function() {
                console.log("Doing something after x time")
                var geometry = new THREE.BoxGeometry(1, 1, 1);
                var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                var cube = new THREE.Mesh(geometry, material);
                spawnIncomingCar()
                doSomethingAfterXseconds(3)
            }, s * 1000);

    }

    function spawnObstacleAtDistance(threeDObj) {
        scene.add(threeDObj);
        let obstacle = {
            object3d: threeDObj,
            animateMovement: true,
            animateRotation: true,
            displacementAnimation: null,
            animationSpeed: randomIntBetweenXY(1, 5) //seconds
        }
        obstacles.push(obstacle)

    }

    function randomIntBetweenXY(min, max) {
        return Math.floor(Math.random() * max) + min
    }

    function onWindowResize() {
        console.log("Window is being resized")
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }

    function render() {
        requestAnimationFrame(render);
        //console.log(cube.position)


        //OBSTACLES Animations
        if (obstacles.length > 0 && mainShip) {

            //console.log(obstacles[0].object3d.position)
            obstacles.forEach(obs => {
                if (obs.animateMovement) {
                    obs.displacementAnimation = new TWEEN.Tween(obs.object3d.position).to({
                        x: camera.position.x - Math.random() * randomIntBetweenXY(-2, 2),
                        y: camera.position.y + Math.random() * randomIntBetweenXY(-2, -1),
                        z: camera.position.z
                    }, 1000 * obs.animationSpeed).interpolation(interpolationType).easing(easingFunction).start().onComplete(function() {
                        /*obs.object3d.geometry.dispose();
                        obs.object3d.material.dispose();*/
                        scene.remove(obs.object3d);
                        // NEED TO REMOVE ARRAY
                    });
                }
                obs.animateMovement = false
            });
        }
        //TWEEN Animations
        renderer.render(scene, camera)
        if (mainShip && cursorY && cursorX) {
            //console.log(mainShip.rotation)
            mainShip.rotation.set(-cursorY * 0.8, 3.1415, -cursorX)
                /*
                carMoving =
                    new TWEEN.Tween(mainShip.rotation).to({ x: -cursorY, z: -cursorX }, 0.001)
                    .interpolation(interpolationType)
                    .easing(easingFunction)
                    .start(); */
        }

        controls.update();
        TWEEN.update();
    }
} else {
    var warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}
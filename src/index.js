import * as THREE from 'three'
import * as OrbitControls from 'three-orbitcontrols'
import * as FBXLoader from 'three-fbx-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as TWEEN from 'three-tween'


import { WEBGL } from './webgl'
import './modal'
import { Vector3 } from 'three'

if (WEBGL.isWebGLAvailable()) {
    var camera, scene, renderer
    var controls
    var objects = []
    var cursorX;
    var cursorY;
    var mainShip;
    var mouse;
    var gltfLoader;

    //TWEEN 
    let interpolationType = TWEEN.Interpolation.Linear,
        easingFunction = TWEEN.Easing.Quadratic.Out;
    let carGoingRight = false,
        carGoingLeft = false,
        carGoingUp = false,
        carGoingDown = false,
        carGoingStraight = false,
        noRotation = null,
        rotatetoRight = null,
        rotatetoLeft = null,
        rotateUp = null,
        rotateDown = null
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

                console.log(car)
                car.animations; // Array<THREE.AnimationClip>
                car.scene; // THREE.Group
                car.scenes; // Array<THREE.Group>
                car.cameras; // Array<THREE.Camera>
                car.asset; // Object
                //car.scene.material.color.set("#FF")
                car.scene.scale.set(0.05, 0.05, 0.05)
                car.scene.rotation.y += 3.1416
                console.log(car.scene)
                mainShip = car.scene
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
        console.log("Cursor at: " + mouse.x + ", " + mouse.y)
            //z rotations +- 0.5
        if (mainShip) {
            //HORIZONTAL MOVEMENT
            if (mouse.x > -0.1 && mouse.x < 0.1 && mouse.y > -0.1 && mouse.y < 0.1) {
                carGoingStraight = true
                carGoingUp = false
                carGoingDown = false
                carGoingLeft = false
                carGoingRight = false
            }
            if (mouse.x > 0.1) {
                carGoingRight = true
                    //console.log("Car going right")
            } else if (mouse.x < -0.1) {
                carGoingLeft = true
                carGoingRight = false
                    //console.log("Car going left")

            } else {
                carGoingRight = false
                carGoingLeft = false
            }

            //VERTICAL MOVEMENT

            if (mouse.y > 0.25) {
                carGoingUp = true
                carGoingDown = false

                //console.log("Car going up")
            } else if (mouse.y < -0.25) {
                carGoingDown = true
                carGoingUp = false
                console.log("Car going down")

            }
            //mainShip.rotation.z = -0.5
            mainShip.position.set(-mouse.x * 50, mouse.y * 25, 0)

            //carGoingRight = false
            cursorX = mouse.x
            cursorY = mouse.y
        }

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

        //TWEEN Animations
        renderer.render(scene, camera)

        if (carGoingRight) {
            if (rotatetoLeft) {
                rotatetoLeft.stop()
            }
            rotatetoRight =
                new TWEEN.Tween(mainShip.rotation).to({ z: -cursorX }, 0.01)
                .interpolation(interpolationType)
                .easing(easingFunction)
                .start();
        } else if (carGoingLeft) {
            if (rotatetoRight) {
                rotatetoRight.stop()
            }
            rotatetoLeft =
                new TWEEN.Tween(mainShip.rotation).to({ z: -cursorX }, 0.01)
                .interpolation(interpolationType)
                .easing(easingFunction)
                .start();
        }

        //VERTICAL ANIMATIONS
        if (carGoingUp) {
            if (rotateDown) {
                rotateDown.stop()
            }
            rotateUp =
                new TWEEN.Tween(mainShip.rotation).to({ x: -cursorY }, 0.01)
                .interpolation(interpolationType)
                .easing(easingFunction)
                .start();
        } else if (carGoingDown) {
            if (rotateUp) {
                rotateUp.stop()
            }
            rotateDown =
                new TWEEN.Tween(mainShip.rotation).to({ x: -cursorY }, 0.01)
                .interpolation(interpolationType)
                .easing(easingFunction)
                .start();
        }
        if (carGoingDown == false && carGoingLeft == false && carGoingRight == false && carGoingUp == false && carGoingStraight) {
            if (rotateUp) {
                rotateUp.stop()
            }
            if (rotateDown) {
                rotateDown.stop()
            }
            if (rotatetoRight) {
                rotatetoRight.stop()
            }
            if (rotatetoLeft) {
                rotatetoLeft.stop()
            }

            noRotation =
                new TWEEN.Tween(mainShip.rotation).to({ x: 0, z: 0 }, 1.5)
                .interpolation(interpolationType)
                .easing(easingFunction)
                .start();
        }

        controls.update();
        TWEEN.update();
    }
} else {
    var warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}
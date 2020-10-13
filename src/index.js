import * as THREE from 'three'
import * as OrbitControls from 'three-orbitcontrols'
import { WEBGL } from './webgl'
import './modal'
import { Vector3 } from 'three'

if (WEBGL.isWebGLAvailable()) {
    var camera, scene, renderer
    var controls
    var objects = []
    var cursorX;
    var cursorY;
    var cube;
    var mouse;
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

        var ambientLight = new THREE.AmbientLight(0x606060)
        scene.add(ambientLight)

        var directionalLight = new THREE.DirectionalLight(0xffffff)
        directionalLight.position.set(1, 0.75, 0.5).normalize()
        scene.add(directionalLight)

        renderer = new THREE.WebGLRenderer({ antialias: true })

        //controls
        //controls = new OrbitControls(camera, renderer.domElement);

        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(renderer.domElement)


        //
        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var bottomBorderFloor = new THREE.Mesh(geometry, material);
        bottomBorderFloor.position.set(0, 0, 0)
        cube = bottomBorderFloor
        scene.add(bottomBorderFloor);

        // lsiteners
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
        cube.position.set(-mouse.x * 20, mouse.y * 20, 0)

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
        console.log(cube.position)
            //controls.update();

        renderer.render(scene, camera)
    }
} else {
    var warning = WEBGL.getWebGLErrorMessage()
    document.body.appendChild(warning)
}
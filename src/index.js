import * as THREE from 'three'
import * as OrbitControls from 'three-orbitcontrols'
import * as FBXLoader from 'three-fbx-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as TWEEN from 'three-tween'

import { WEBGL } from './webgl'
import './modal'
import { Vector3 } from 'three'
//CHECKING IF USER IS ON A SMARTPHONE
let d = Date();
let version = d.toString()
console.log('Version: ' + version)
function isMobile() {
	let check = false
		; (function (a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4)
				)
			)
				check = true
		})(navigator.userAgent || navigator.vendor || window.opera)
	return check
}

if (isMobile()) {
	console.log('Is on Mobile')
	var mobileMessage = document.getElementById('mobileMessage')
	mobileMessage.style.display = 'block'
	let canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);
} else {
	console.log('Is on Desktop')
	var game = document.getElementById('game')
	game.style.display = 'block'
}

//THREEJS
if (WEBGL.isWebGLAvailable()) {
	var camera, scene, renderer
	var controls
	var objects = []
	var cursorX
	var cursorY
	var mainShip
	var mouse
	var gltfLoader
	let mainShipColor = 0xffd300
	let mainShipColorLights = 0x5d1de7
	let everyXSecondsCounter = 3
	let spawnRate = 0.1

	//CAR
	const baseScale = 0.05 * 0.05
	//OBSTACLES
	let spwanItem = false
	let obstacles = []
	//TWEEN
	let interpolationType = TWEEN.Interpolation.Linear,
		easingFunction = TWEEN.Easing.Quadratic.InOut
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
		mouse = new THREE.Vector2()

		// lights

		var ambientLight = new THREE.AmbientLight(0x606060, 1)
		scene.add(ambientLight)

		var directionalLight = new THREE.DirectionalLight(0xffffff)
		directionalLight.position.set(1, 0.75, 0.5).normalize()
		scene.add(directionalLight)

		renderer = new THREE.WebGLRenderer({ antialias: true })

		//controls
		controls = new OrbitControls(camera, renderer.domElement)

		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		scene.background = new THREE.Color(0x222222)

		document.body.appendChild(renderer.domElement)

		// Instantiate a loader
		var loader = new GLTFLoader()
		gltfLoader = loader
		// Optional: Provide a DRACOLoader instance to decode compressed mesh data
		var dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('/examples/js/libs/draco/')
		loader.setDRACOLoader(dracoLoader)

		// Load a glTF resource
		gltfLoader.load(
			// resource URL
			'static/models/car/scene.gltf',
			// called when the resource is loaded
			function (car) {
				mainShip = car.scene
				car.scene.traverse((o) => {
					if (o.isMesh) {
						//console.log(o.name)
						if (o.name === 'Low_Poly_Car_Mat1_0') {
							o.material.emissive = new THREE.Color(mainShipColor)
						}
						if (
							o.name === 'Rear_Bumper_Mat8_0' ||
							o.name === 'Emergency_Light_Mat5_0'
						) {
							o.material.emissive = new THREE.Color(mainShipColorLights)
						}
					}
				})
				//console.log(car)
				car.animations // Array<THREE.AnimationClip>
				car.scene // THREE.Group
				car.scenes // Array<THREE.Group>
				car.cameras // Array<THREE.Camera>
				car.asset // Object
				//car.scene.material.color.set("#FF")
				car.scene.scale.set(baseScale, baseScale, baseScale)
				car.scene.rotation.y += 3.1416
				car.scene.position.z = -95
				//console.log(car.scene)
				scene.add(mainShip)
			},
			// called while loading is progressing
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
			},
			// called when loading has errors
			function (error) {
				console.log('An error happened')
			}
		)
		increaseSpawnRateEveryXSeconds(5)
		doSomethingAfterXseconds(everyXSecondsCounter)

		// listeners
		window.addEventListener('resize', onWindowResize, false)
	}

	function createGlowingBox() { }
	document.onmousemove = function (e) {
		var raycaster = new THREE.Raycaster() // create once
		// create once
		mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
		mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
		raycaster.setFromCamera(mouse, camera)
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
		console.log('Spawning incoming Car')
		gltfLoader.load(
			// resource URL
			'static/models/car/scene.gltf',
			// called when the resource is loaded
			function (car) {
				car.scene.scale.set(baseScale, baseScale, baseScale)
				car.scene.traverse((o) => {
					if (o.isMesh) {
						o.material.emissive = new THREE.Color(Math.random() * 0xffffff)
					}
				})
				//console.log(car)
				spawnObstacleAtDistance(car.scene)
			},
			// called while loading is progressing
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
			},
			// called when loading has errors
			function (error) {
				console.log('An error happened')
			}
		)
	}

	function doSomethingAfterXseconds(s) {
		console.log("Spawning car every x seconds: " + everyXSecondsCounter)
		setTimeout(function () {
			console.log('Doing something after x time')
			var geometry = new THREE.BoxGeometry(1, 1, 1)
			var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
			var cube = new THREE.Mesh(geometry, material)
			spawnIncomingCar()

			increaseSpawnRateEveryXSeconds(5)
			doSomethingAfterXseconds(everyXSecondsCounter)
		}, s * 1000)
	}
	function increaseSpawnRateEveryXSeconds(s) {
		setTimeout(function () {
			if(everyXSecondsCounter < 2){
				spawnRate = 0.05
			}
			if(everyXSecondsCounter < 0.1){
				spawnRate = 0
			}
			if (everyXSecondsCounter - spawnRate < 0) {

			} else {
				everyXSecondsCounter -= spawnRate

			}

		}, s * 1000)
	}

	function spawnObstacleAtDistance(threeDObj) {
		scene.add(threeDObj)
		let obstacle = {
			object3d: threeDObj,
			animateMovement: true,
			animateRotation: true,
			displacementAnimation: null,
			animationSpeed: 5 - everyXSecondsCounter, //seconds
		}
		console.log("Incoming car Speed: " + obstacle.animationSpeed)
		obstacles.push(obstacle)
	}

	function randomIntBetweenXY(min, max) {
		return Math.floor(Math.random() * max) + min
	}

	function onWindowResize() {
		console.log('Window is being resized')
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()

		renderer.setSize(window.innerWidth, window.innerHeight)
		render()
	}

	function render() {
		requestAnimationFrame(render)
		//console.log(cube.position)

		//OBSTACLES Animations
		if (obstacles.length > 0 && mainShip) {
			//console.log(obstacles[0].object3d.position)
			obstacles.forEach((obs) => {
				if (obs.animateMovement) {
					let posNeg = Math.random() < 0.5 ? -1 : 1;

					obs.displacementAnimation = new TWEEN.Tween(obs.object3d.position)
						.to(
							{
								x:
									camera.position.x + Math.random() * randomIntBetweenXY(-8, 8) *posNeg,
								y:
									camera.position.y +
									Math.random() * randomIntBetweenXY(-4, 4) * posNeg,
								z: camera.position.z,
							},
							1000 * obs.animationSpeed
						)
						.interpolation(interpolationType)
						.easing(easingFunction)
						.start()
						.onComplete(function () {
							/*obs.object3d.geometry.dispose();
									  obs.object3d.material.dispose();*/
							scene.remove(obs.object3d)
							// NEED TO REMOVE ARRAY
						})
				}
				obs.animateMovement = false
			})
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

		controls.update()
		TWEEN.update()
	}
} else {
	var warning = WEBGL.getWebGLErrorMessage()
	document.body.appendChild(warning)
}

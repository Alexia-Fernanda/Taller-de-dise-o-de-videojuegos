import './style.css'; // <--- ¡Añade esta línea para que limpie la pantalla!
import * as THREE from 'three';

// 1. ESCENA
const scene = new THREE.Scene();

// 2. CÁMARA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. CUBO
//lo voy a cambiar a esfera
const geometry = new THREE.CircleGeometry( 2,9);
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Diccionario para registrar qué teclas están presionadas
const keys = {

w: false,
a: false,
s: false,
d: false,
shift: false

};

// 5. BUCLE DE ANIMACIÓN (Game Loop)



function animate() {
requestAnimationFrame(animate);
console.log(cube.position.x);

// 1. CALCULAR VELOCIDAD (Si presiona Shift, corre al doble de velocidad)
//cambiando los numeros de aca, podemos hacer que vaya mas lento o rapido
let currentSpeed = 0.005;
if (keys.shift) {
currentSpeed = 0.012; // Velocidad de Sprint
}

// --- MECÁNICA DE MOVIMIENTO ---
//esta parte es el como se va mover el cubo, mientras que con shift avanza mas rapido
//si cambias el cube.position.y a cube.rotation.y va a rotar el cubo con las teclas que 
//tu gustes
if (keys.w) cube.rotation.y += currentSpeed; // Arriba
if (keys.s) cube.rotation.y -= currentSpeed; // Abajo
if (keys.a) cube.rotation.x -= currentSpeed; // Izquierda
if (keys.d) cube.rotation.x += currentSpeed; // Derecha

// --- LIMITAR LA POSICIÓN (Lógica de colisión con el borde) ---
// Límite Derecha (X positivo)
if (cube.position.x > 10) {
cube.position.x = 10;
}
// Límite Izquierda (X negativo)
else if (cube.position.x < -10) {
cube.position.x = -10;
}

// Límite Arriba (Y positivo)
if (cube.position.y > 10) {
cube.position.y = 10;
}
// Límite Abajo (Y negativo)
else if (cube.position.y < -10) {
cube.position.y = -10;
}
//la parte de aca para arriba es para delimitar hasta donde va a llegar el cubo, cual es su limite
//en la pantalla

// Mantener una leve rotación para que se siga viendo en 3D

//esto es con la rapidez que rota el cubo
//si queremos que se quede quieto, lo dejamos en cero, si queremos que se mueva le podemos poner un numero
//pero para que no vaya tan rapido poner 0.005 o X numero
cube.rotation.x += 0.0;
cube.rotation.y += 0.0;

renderer.render(scene, camera);
}

animate();

// 6. AJUSTE DE PANTALLA (Hacer el juego responsivo)
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});

// Detectar cuando se presiona la tecla
window.addEventListener('keydown', (event) => {
let key = event.key.toLowerCase();

// Si presionaron cualquier Shift, lo normalizamos a 'shift'
if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = true;
}
});

window.addEventListener('keyup', (event) => {
let key = event.key.toLowerCase();

if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = false;
}
});

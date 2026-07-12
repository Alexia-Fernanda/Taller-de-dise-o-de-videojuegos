import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ==========================================
// CONFIGURACIÓN DE LA ESCENA (CAMPO)
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Cielo azul brillante

// Neblina optimizada para ver la vegetación a lo lejos
scene.fog = new THREE.Fog(0x87CEEB, 30, 75);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 12); 
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ==========================================
// LUCES
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 15, 5);
scene.add(dirLight);

// ==========================================
// VARIABLES DEL JUEGO
// ==========================================
let buenas = 0;
let malas = 0;
const velocidadObstaculo = 0.18;

const buenasTxt = document.getElementById('buenas-txt');
const malasTxt = document.getElementById('malas-txt');

// ==========================================
// SUELO (Pasto Verde Amplio)
// ==========================================
const sueloGeo = new THREE.PlaneGeometry(80, 100); 
const sueloMat = new THREE.MeshStandardMaterial({ color: 0x1c3b11, roughness: 0.9 });
const suelo = new THREE.Mesh(sueloGeo, sueloMat);
suelo.rotation.x = -Math.PI / 2; 
scene.add(suelo);

const loader = new GLTFLoader();

// ==========================================
// JUGADOR (Carga del modelo del Gato)
// ==========================================
let jugador = null; 

loader.load(
    '/models/cat.glb', 
    (gltf) => {
        const contenedor = new THREE.Group();
        const modelo = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(modelo);
        const center = box.getCenter(new THREE.Vector3());
        modelo.position.set(-center.x, -box.min.y, -center.z); 
        contenedor.add(modelo);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const escalaDeseada = 2.0; 
        const factorEscala = escalaDeseada / maxDim;
        contenedor.scale.set(factorEscala, factorEscala, factorEscala);
        
        contenedor.position.set(0, 0, 5); 
        jugador = contenedor;
        scene.add(jugador);
        console.log('¡Gato cargado con éxito!');
    }, 
    undefined,
    (error) => console.error('Error al cargar el gato:', error)
);

// ==========================================
// OBSTÁCULO (Contenedor y carga del Ratón)
// ==========================================
const obstaculo = new THREE.Group();
scene.add(obstaculo);

function reiniciarObstaculo() {
    obstaculo.position.z = -35; 
    obstaculo.position.x = (Math.random() - 0.5) * 6; 
    obstaculo.position.y = 0; 
}
reiniciarObstaculo();

let ratonModeloInterno = null; 

loader.load(
    '/models/raton.glb', 
    (gltf) => {
        const modeloObstaculo = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(modeloObstaculo);
        const center = box.getCenter(new THREE.Vector3());
        modeloObstaculo.position.set(-center.x, -box.min.y, -center.z);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const tamanoDeseadoRaton = 1.5; 
        const factorEscalaRaton = tamanoDeseadoRaton / maxDim;
        modeloObstaculo.scale.set(factorEscalaRaton, factorEscalaRaton, factorEscalaRaton);
        
        obstaculo.add(modeloObstaculo);
        ratonModeloInterno = modeloObstaculo;
        console.log('¡Ratón cargado con éxito!');
    },
    undefined,
    (error) => console.error('Error al cargar raton.glb:', error)
);

// ==========================================
// 🌿 / 🌸 VEGETACIÓN DECORATIVA SISTEMÁTICA
// ==========================================

function cargarObjetoDecorativo(rutaModel, x, z, tamanoDeseado) {
    loader.load(
        rutaModel, 
        (gltf) => {
            const modelo = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(modelo);
            const center = box.getCenter(new THREE.Vector3());
            modelo.position.set(-center.x, -box.min.y, -center.z);
            
            const contenedor = new THREE.Group();
            contenedor.add(modelo);
            
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const factorEscala = tamanoDeseado / maxDim;
            contenedor.scale.set(factorEscala, factorEscala, factorEscala);
            
            contenedor.position.set(x, 0, z);
            contenedor.rotation.y = Math.random() * Math.PI * 2; 
            
            scene.add(contenedor);
        },
        undefined,
        (error) => console.error(`Error al cargar ${rutaModel}:`, error)
    );
}


const modelosDisponibles = [
    { ruta: '/models/planta.glb', altura: 2.5 },
    { ruta: '/models/flores.glb', altura: 2.2 } // Sube a 2.2 o 2.5 si antes eran muy pequeñas
];

const totalPorLado = 20;

for (let i = 0; i < totalPorLado; i++) {
    // Escogemos un modelo de la lista superior para la izquierda y otro para la derecha
    const itemIzq = modelosDisponibles[Math.floor(Math.random() * modelosDisponibles.length)];
    const itemDer = modelosDisponibles[Math.floor(Math.random() * modelosDisponibles.length)];

    // Distribución lado izquierdo
    let xIzquierda = -6 - Math.random() * 12;
    let zIzquierda = 10 - Math.random() * 75; 
    cargarObjetoDecorativo(itemIzq.ruta, xIzquierda, zIzquierda, itemIzq.altura);

    // Distribución lado derecho
    let xDerecha = 6 + Math.random() * 12;
    let zDerecha = 10 - Math.random() * 75; 
    cargarObjetoDecorativo(itemDer.ruta, xDerecha, zDerecha, itemDer.altura);
}

// ==========================================
// CONTROLES DE TECLADO
// ==========================================
const teclas = { Left: false, Right: false };

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = false;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// BUCLE DE ANIMACIÓN Y LÓGICA DEL JUEGO
// ==========================================
function animate() {
    requestAnimationFrame(animate);

    if (!jugador) return;

    if (teclas.Left && jugador.position.x > -4) jugador.position.x -= 0.15;
    if (teclas.Right && jugador.position.x < 4) jugador.position.x += 0.15;

    if (ratonModeloInterno) {
        obstaculo.position.z += velocidadObstaculo;

        const objetivoGato = new THREE.Vector3(obstaculo.position.x, jugador.position.y, obstaculo.position.z);
        jugador.lookAt(objetivoGato);

        const posicionGatoGlobal = new THREE.Vector3();
        jugador.getWorldPosition(posicionGatoGlobal);
        ratonModeloInterno.lookAt(posicionGatoGlobal.x, ratonModeloInterno.position.y, posicionGatoGlobal.z);

        const distancia = jugador.position.distanceTo(obstaculo.position);
        if (distancia < 1.8) { 
            malas++;
            if (malasTxt) malasTxt.innerText = malas;
            reiniciarObstaculo();
        }

        if (obstaculo.position.z > jugador.position.z + 2) {
            buenas++;
            if (buenasTxt) buenasTxt.innerText = buenas;
            reiniciarObstaculo();
        }
    }

    renderer.render(scene, camera);
}

animate();
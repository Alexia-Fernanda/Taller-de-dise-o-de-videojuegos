//esto es para verificar que esta conectado

console.log ('main conectado')

//1-primero se crea la escena
const scene= new THREE.Scene();


//2-se define la camara
const fov=75; //punto de vista
const aspectRatio= window.innerWidth / window.innerHeight;
const near=0.1;
const far= 1000;


const camera= new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far
)
camera.position.z=2;


//3- se crea el Renderer es el el que dibuja todo en el lienzo
const renderer = new THREE.WebGLRenderer(); //Dibuja
renderer.setSize(window.innerWidth, window.innerHeight);//tamaño del canvas
document.body.appendChild(renderer.domElement); //se agrega al html


//4- se agrega el Cubo que esta formado por una geometria y unh material
const geometry = new THREE.BoxGeometry();
const material= new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
})
//se agrefa a la escena
const cube = new THREE.Mesh(geometry,material);
scene.add(cube);


camera.lookAt(cube.position); //siempre va a mirar kla camara al cubo, va despus de definir el cuboi


renderer.render(scene,camera);


//animar al cubo
function animate(){
   
    requestAnimationFrame(animate)//anima cosas de forma fluida
    cube.rotation.y += 0.01; //velocidad de rotacion
    renderer.render(scene,camera) // se vuelve a renderizar la escena
}


animate()

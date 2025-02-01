// Variables para las rotaciones de cada planeta
let angle_sun = 0;
let angle_mercury = 0;
let angle_venus = 0;
let angle_earth = 0;
let angle_moon = 0;
let angle_mars = 0;
let angle_jupiter = 0;
let angle_saturn = 0;
let angle_uranus = 0;
let angle_neptune = 0;

const earthSize = 100;  // Tamaño de la Tierra
const moonSize = earthSize * 0.27; // Tamaño de la Luna (27% del tamaño de la Tierra)
const moonDistance = earthSize * 40; // Distancia entre Tierra y Luna (40 radios terrestres)

// Variables camara
let cam;
let camX = 0,
  camY = 0,
  camZ = 1000; // Posición inicial de la cámara
let camRotX = 0,
  camRotY = 0; // Rotación acumulada de la cámara
let dragging = false; // Estado: si se está arrastrando el ratón

function preload() {
  sun_img = loadImage("./img/solete2k.jpg");
  mercury = loadImage("./img/Mercurio2K.jpg");
  venus = loadImage("./img/Venus.jpg");
  venus_atm = loadImage("./img/VenusAtm.jpg");
  earth = loadImage("./img/8k_earth_daymap.jpg");
  earth_clouds = loadImage("./img/earth_clouds_2048.png");
  moon = loadImage("./img/moon-texture.jpg");
  mars = loadImage("./img/marte.jpg");
  jupiter = loadImage("./img/jupiter.jpg");
  saturn = loadImage("./img/saturno.jpg");
  saturn_ring = loadImage("./img/saturn_ring.png");
  uranus = loadImage("./img/uranus.jpg");
  neptune = loadImage("./img/neptuno.jpg");

  space = loadImage("./img/background-space.jpg");
  makemake_map = loadImage("./img/makemake.jpg");
  death_star = loadImage("./img/death_star_1.png");
  mistery = createVideo("./img/points.mp4");
}

console.log("esto rula!");

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  mistery.hide();
 
}

function draw() {
  const speed = 15;

  if (keyIsDown(87)) cam.move(0, 0, -speed); // W
  if (keyIsDown(83)) cam.move(0, 0, speed); // S
  if (keyIsDown(65)) cam.move(-speed, 0, 0); // A
  if (keyIsDown(68)) cam.move(speed, 0, 0); // D

  // Limitar el ángulo vertical de la cámara
  camRotX = constrain(camRotX, -PI / 2, PI / 2);

  // Actualizar rotación de la cámara
  if (dragging) {
    cam.pan(camRotY); // Rotación horizontal
    cam.tilt(camRotX); // Rotación vertical
  }

  //* Crear como constantes o ir declarandolas a medida que se vayan necesitando
  // Actualizar ángulos de rotación de los planetas
  angle_sun += 0.01; // Rotación del Sol
  angle_mercury += 0.1; // Rotación de Mercurio
  angle_venus += 0.08; // Rotación de Venus
  angle_earth += 0.05; // Rotación de la Tierra
  angle_moon += 0.09; // Rotación de la Tierra
  angle_mars += 0.03; // Rotación de Marte
  angle_jupiter += 0.02; // Rotación de Júpiter
  angle_saturn += 0.01; // Rotación de Saturno
  angle_uranus += 0.007; // Rotación de Urano
  angle_neptune += 0.005; // Rotación de Neptuno

  
  //Luces
  background(0, 0, 0, 0);
  lights()
  pointLight(255, 255, 255, 0, 0, 0);
  pointLight(160, 160, 160, -1000, -1000, 500);

  noStroke();  


  // Creación planetas
  createPlanet(150, 150, sun_img, angle_sun, 0, 0, true);
  createPlanet(15, 15, mercury, angle_mercury, 300, 0, true);
  createPlanet(25, 25, venus, angle_venus, 450, 0, true);
  createPlanet(27, 25, venus_atm, angle_venus, 450, 0, true);
  createPlanet(30, 30, earth, angle_earth, 600, 0, true);
  createPlanet(31, 30, earth_clouds, angle_earth, 600, 0, false);
  createPlanet(17, 17, moon, angle_moon, 600, 0, true);
  createPlanet(20, 20, mars, angle_mars, 750, 0, true);
  createPlanet(100, 100, jupiter, angle_jupiter, 1100, 0, true);
  createPlanet(85, 85, saturn, angle_saturn, 1400, 0, true);
  createPlanet(89, 89, saturn_ring, angle_saturn, 1400, 0, true);
  createPlanet(70, 70, uranus, angle_uranus, 1700, 0, true);
  createPlanet(65, 65, neptune, angle_neptune, 2000, 0, true);

  smooth();
}

// Funcion para generar los planetas
const createPlanet = (sizeX, sizeY, img, angle, translateX, translateY, followOrbit) => {
  if (followOrbit){
    push();    
  } 
  rotateY(radians(angle));
  translate(translateX, translateY);
  texture(img);
  sphere(sizeX, sizeY);
  if (followOrbit){
    pop();
  }
  console.log("yessss");
};
 

// Cambia la rotación de la cámara al arrastrar el ratón
function mouseDragged() {
  const sensitivity = 0.001; // Sensibilidad del arrastre
  camRotY = (mouseX - pmouseX) * sensitivity;
  camRotX = (mouseY - pmouseY) * sensitivity;
  dragging = true;
}

// Detener la cámara al soltar el ratón
function mouseReleased() {
  dragging = false;
  // Resetear rotaciones para detener el movimiento
  camRotX = 0;
  camRotY = 0;
}

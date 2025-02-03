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

// Variables para las rotaciones AXIALES (sobre su eje)
let rotation_sun = 0;
let rotation_mercury = 0;
let rotation_venus = 0;
let rotation_earth = 0;
let rotation_moon = 0;
let rotation_mars = 0;
let rotation_jupiter = 0;
let rotation_saturn = 0;
let rotation_uranus = 0;
let rotation_neptune = 0;

const earthSize = 60;  // Tamaño de la Tierra
const moonSize = earthSize * 0.27; // Tamaño de la Luna (27% del tamaño de la Tierra)
const moonDistance = earthSize * 4; // Distancia entre Tierra y Luna (40 radios terrestres)



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


  rotation_sun += 0.02;      // Sol: 27 días terrestres por rotación
  rotation_mercury += 0.015; // Mercurio: 58 días
  rotation_venus -= 0.01;    // Venus: -243 días (rotación retrógrada)
  rotation_earth += 0.05;    // Tierra: 1 día
  rotation_moon += 0.002;    // Luna: 27 días (rotación sincrónica)
  rotation_mars += 0.03;     // Marte: 1.02 días
  rotation_jupiter += 0.1;   // Júpiter: 9.9 horas
  rotation_saturn += 0.08;   // Saturno: 10.7 horas
  rotation_uranus += 0.04;   // Urano: -17h (eje inclinado)
  rotation_neptune += 0.03;  // Neptuno: 16h
  
  //Luces
  background(0, 0, 0, 0);
  lights()
  pointLight(255, 255, 255, 0, 0, 0);
  pointLight(160, 160, 160, -1000, -1000, 500);

  noStroke();  


  createPlanet(150, 150, sun_img, 0, 0, 0, false, rotation_sun); // Sol


   push();
   rotateY(radians(angle_mercury));
   translate(300, 0, 0);
   rotateY(radians(rotation_mercury));
   texture(mercury);
   sphere(15);
   pop();

   push();
   rotateY(radians(angle_venus));
   translate(450, 0, 0);
   push();
   rotateY(radians(rotation_venus));
   texture(venus);
   sphere(25);
   texture(venus_atm);
   sphere(27);
   pop();
   pop();

   push();
  rotateY(radians(angle_earth)); // Órbita terrestre
  translate(600, 0, 0);
  
  // Tierra
  push();
  rotateY(radians(rotation_earth));
  texture(earth);
  sphere(earthSize);
  texture(earth_clouds);
  sphere(earthSize * 1.03);
  pop();
  
  // Luna
  push();
  rotateY(radians(angle_moon)); // Órbita lunar
  translate(moonDistance, 0, 0);
  rotateY(radians(rotation_moon));
  texture(moon);
  sphere(moonSize);
  pop();
  
  pop();


  push();
  rotateY(radians(angle_mars));
  translate(950, 0, 0);
  rotateY(radians(rotation_mars));
  texture(mars);
  sphere(20);
  pop();

  push();
  rotateY(radians(angle_jupiter));
  translate(1300, 0, 0);
  rotateY(radians(rotation_jupiter));
  texture(jupiter);
  sphere(100);
  pop();

  push();
  rotateY(radians(angle_saturn));
  translate(1800, 0, 0);
  rotateY(radians(rotation_saturn));
  texture(saturn);
  sphere(85);
  // Anillos
  push();
  rotateX(PI/2); // Orientar anillos
  texture(saturn_ring);
  torus(89, 15); 
  pop();
  pop();


  push();
  rotateY(radians(angle_uranus));
  translate(2200, 0, 0);
  rotateY(radians(rotation_uranus));
  texture(uranus);
  sphere(70);
  pop();

  push();
  rotateY(radians(angle_neptune));
  translate(2600, 0, 0);
  rotateY(radians(rotation_neptune));
  texture(neptune);
  sphere(65);
  pop();

  smooth();

 }

// Funcion para generar los planetas
const createPlanet = (sizeX, sizeY, img, orbitalAngle, translateX, translateY, followOrbit, rotationAngle) => {
  if (followOrbit) push();
  rotateY(radians(orbitalAngle));
  translate(translateX, translateY);
  rotateY(radians(rotationAngle));  // Nueva línea para rotación axial
  texture(img);
  sphere(sizeX, sizeY);
  if (followOrbit) pop();
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

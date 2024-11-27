let angle = 0;
let angle_2 = 0;

// Variables camara
let cam;
let camX = 0, camY = 0, camZ = 1000; // Posición inicial de la cámara
let camRotX = 0, camRotY = 0; // Rotación acumulada de la cámara
let dragging = false; // Estado: si se está arrastrando el ratón


function preload(){
    img = loadImage('./img/8k_earth_daymap.jpg');
    img_2 = loadImage('./img/earth_clouds_2048.png');
    img_3 = loadImage('./img/moon-texture.jpg');
    img_4 = loadImage('./img/background-space.jpg');
    makemake_map = loadImage('./img/makemake.jpg'); 
    death_star = loadImage('./img/death_star_1.png');
    mistery =createVideo('./img/points.mp4');
  }

console.log('esto rula!');

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    cam = createCamera();
    mistery.hide();
}
  
  
function draw() {

  const speed = 15;

  if (keyIsDown(87)) cam.move(0, 0, -speed); // W
  if (keyIsDown(83)) cam.move(0, 0, speed);  // S
  if (keyIsDown(65)) cam.move(-speed, 0, 0); // A
  if (keyIsDown(68)) cam.move(speed, 0, 0);  // D

  // Limitar el ángulo vertical de la cámara
  camRotX = constrain(camRotX, -PI / 2, PI / 2);


  // Actualizar rotación de la cámara
  if (dragging) {
    cam.pan(camRotY); // Rotación horizontal
    cam.tilt(camRotX); // Rotación vertical
  }

  angle += 0.05; // Velocidad de rotación de la Tierra
  angle_2 -= 0.3; // Velocidad de rotación de la Luna

  // Tierra
  earth = () => sphere(300,200);
  clouds = () => sphere(305,200);
  earth_texture = () => texture(img_2);

  //Luna
  moon = () => sphere(40,100);
  moon_texture = () => texture(img_3);
  
  // Luces y fondo
  lights();
  background(0,0,0,0);

  // Luces direccionales
  let c = color (255,255,255);
  directionalLight(c, createVector(0,1,0));
  directionalLight(c, createVector(1,0,0));
  pointLight(160,160,160,-1000,-1000,500);

  ambientMaterial(5,5,5);
  noStroke();

  rotateY(radians(angle));
  texture(img);
  earth();

  rotateY(radians(angle)/3);
  earth_texture();
  clouds();
  
  rotateY(radians(angle_2)/2);
  moon_texture();
  translate(-600, 0);
  moon();

  smooth();
}

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

//! Mierda, No borrar



    // earth_sphere_check = select('#earth_sphere_check').elt;
    // earth_trump_style_check = select('#earth_trump_style_check').elt;
    // earth_makemake_check = select('#earth_makemake_check').elt;
    // moon_sphere_check = select('#moon_sphere_check').elt;
    // moon_death_star_check = select('#moon_death_star_check').elt;
    // moon_mistery_check = select('#moon_mistery_check').elt;





  // if (earth_trump_style_check.checked) {
  //   earth = () => ellipsoid(300,50,300,100);
  //   clouds = () => ellipsoid(305,50,300,300);
  //   earth_texture = () => texture(img_2);
  // }

  // if (earth_makemake_check.checked) {
  //   earth = () => sphere(100,200);
  //   clouds = () => sphere(105,200);
  //   earth_texture = () => texture(makemake_map);
  // }

  // if(moon_death_star_check.checked) {
  //   moon = () => sphere(40,100);
  //   moon_texture = () => texture(death_star);
  // }

  // if(moon_mistery_check.checked) {
  //   mistery.loop();
  //   moon = () => sphere(40,100);
  //   moon_texture = () => texture(mistery);
  // }
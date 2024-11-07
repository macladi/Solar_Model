let angle = 0;
let angle_2 = 0;

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
    earth_sphere_check = select('#earth_sphere_check').elt;
    earth_trump_style_check = select('#earth_trump_style_check').elt;
    earth_makemake_check = select('#earth_makemake_check').elt;
    moon_sphere_check = select('#moon_sphere_check').elt;
    moon_death_star_check = select('#moon_death_star_check').elt;
    moon_mistery_check = select('#moon_mistery_check').elt;
    mistery.hide();
}
  
  
function draw() {

  earth = () => sphere(300,200);
  moon = () => sphere(40,100);
  moon_texture = () =>(img_3);
  clouds = () => sphere(305,200);
  earth_texture = () => texture(img_2);

  if (earth_sphere_check.checked) {
    earth = () => sphere(300,200);
    clouds = () => sphere(305,200);
    earth_texture = () => texture(img_2);
  }

  if (earth_trump_style_check.checked) {
    earth = () => ellipsoid(300,50,300,100);
    clouds = () => ellipsoid(305,50,300,300);
    earth_texture = () => texture(img_2);
  }

  if (earth_makemake_check.checked) {
    earth = () => sphere(100,200);
    clouds = () => sphere(105,200);
    earth_texture = () => texture(makemake_map);
  }

  if(moon_sphere_check.checked) {
    moon = () => sphere(40,100);
    moon_texture = () => texture(img_3);
  }

  if(moon_death_star_check.checked) {
    moon = () => sphere(40,100);
    moon_texture = () => texture(death_star);
  }

  if(moon_mistery_check.checked) {
    mistery.loop();
    moon = () => sphere(40,100);
    moon_texture = () => texture(mistery);
  }

  lights();
  background(0,0,0,0);
  let c = color (255,255,255);
  let lightDir = createVector(0,1,0);
  directionalLight(c, lightDir);
  let lightDir_2 = createVector(1,0,0);
  directionalLight(c, lightDir_2);
  ambientMaterial(5,5,5);
  pointLight(160,160,160,-1000,-1000,500);
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
  orbitControl();
  angle+=0.1;
  angle_2-=0.3; 
}
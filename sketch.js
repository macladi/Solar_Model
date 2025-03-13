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

  let currentView = "sun";
  let speedMultiplier = 1;

  const earthSize = 60;  // Tamaño de la Tierra
  const moonSize = earthSize * 0.27; // Tamaño de la Luna (27% del tamaño de la Tierra)
  const moonDistance = earthSize * 4; // Distancia entre Tierra y Luna (40 radios terrestres)

  let defaultCamPosition = { x: 0, y: 0, z: 1000 };
  let earthCamPosition = { x: 600, y: 0, z: 1000 };


  // Variables camara
  let cam;
  let camX = 0,
    camY = 0,
    camZ = 1000; // Posición inicial de la cámara
  let camRotX = 0,
    camRotY = 0; // Rotación acumulada de la cámara
  let dragging = false; // Estado: si se está arrastrando el ratón

  let miFuente;

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

    miFuente = loadFont('fonts/Poppins-Font/Poppins-Black.ttf');
  }

  console.log("esto rula!");

  function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    cam = createCamera();
    mistery.hide();
    textFont(miFuente);

    // Añade event listeners para los checkboxes
    document.getElementById('sun_check').addEventListener('change', () => {
      if (document.getElementById('sun_check').checked) {
        currentView = 'sun';
        resetView();
      }
    });

    document.getElementById('earth_check').addEventListener('change', () => {
      if (document.getElementById('earth_check').checked) {
        currentView = 'earth';
        resetView();
      }
    });

    document.getElementById('death_star_check').addEventListener('change', () => {
      if (document.getElementById('death_star_check').checked) {
        currentView = 'death_star';
        resetView();
      }
    });

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
    angle_sun += 0.01 * speedMultiplier;
    angle_mercury += 0.1 * speedMultiplier;
    angle_venus += 0.08 * speedMultiplier;
    angle_earth += 0.05 * speedMultiplier;
    angle_moon += 0.09 * speedMultiplier;
    angle_mars += 0.03 * speedMultiplier;
    angle_jupiter += 0.02 * speedMultiplier;
    angle_saturn += 0.01 * speedMultiplier;
    angle_uranus += 0.007 * speedMultiplier;
    angle_neptune += 0.005 * speedMultiplier;


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


    const sunCheck = document.getElementById('sun_check').checked;
    const earthCheck = document.getElementById('earth_check').checked;

    // Actualizar vista actual
    if (sunCheck) currentView = 'sun';
    else if (earthCheck) currentView = 'earth';

    if (currentView === 'sun') {

      push();
      rotateY(-frameCount * 0.001); // Opcional: rotación suave de las órbitas
      drawOrbit(300);    // Mercurio
      drawOrbit(550);    // Venus
      drawOrbit(900);    // Tierra
      drawOrbit(1350);    // Marte
      drawOrbit(1750);   // Júpiter
      drawOrbit(2300);   // Saturno
      drawOrbit(2900);   // Urano
      drawOrbit(3300);   // Neptuno
      pop();


      createPlanet(150, 150, sun_img, 0, 0, 0, false, rotation_sun); // Sol
      // drawPlanetName("Sol", 0, -180, 0); // Nombre del Sol
      drawPlanetName("Sol", 0, -100, 0);

      // text("Sol", 0 ,0);

      push();
      rotateY(radians(angle_mercury));
      translate(300, 0, 0);
      rotateY(radians(rotation_mercury));
      texture(mercury);
      sphere(15);
      pop();

      push();
      rotateY(radians(angle_venus));
      translate(550, 0, 0);
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
      translate(900, 0, 0);
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
      translate(1350, 0, 0);
      rotateY(radians(rotation_mars));
      texture(mars);
      sphere(20);
      pop();

      push();
      rotateY(radians(angle_jupiter));
      translate(1750, 0, 0);
      rotateY(radians(rotation_jupiter));
      texture(jupiter);
      sphere(100);
      pop();

      push();
      rotateY(radians(angle_saturn));
      translate(2300, 0, 0);
      rotateY(radians(rotation_saturn));
      texture(saturn);
      sphere(85);
      // Anillos
      push();
      rotateX(PI/2); // Orientar anillos
      texture(saturn_ring);
      torus(100, 5); 
      torus(110, 7); 
      torus(115, 11); 
      torus(130, 13); 
      torus(150, 3); 
      pop();
      pop();


      push();
      rotateY(radians(angle_uranus));
      translate(2900, 0, 0);
      rotateY(radians(rotation_uranus));
      texture(uranus);
      sphere(70);
      pop();

      push();
      rotateY(radians(angle_neptune));
      translate(3300, 0, 0);
      rotateY(radians(rotation_neptune));
      texture(neptune);
      sphere(65);
      pop();

    } else if (currentView === 'earth') {
      
      push();
      translate(900, 0, 0);
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

    } else if (currentView === 'death_star') {
      
      push();
      translate(900, 0, 0);
      push();
      texture(death_star);
      sphere(earthSize);
      pop();
      
      pop();
    }
    smooth();
  }

  // Funcion para generar los planetas
  const createPlanet = (sizeX, sizeY, img, orbitalAngle, translateX, translateY, followOrbit, rotationAngle) => {
    if (followOrbit) push();
    rotateY(radians(orbitalAngle));
    translate(translateX, translateY);
    rotateY(radians(rotationAngle));  
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


  function resetView() {
    if (currentView === 'sun') {
      cam.setPosition(0, 0, 1000);
      cam.lookAt(0, 0, 0);
    } else if (currentView === 'earth') {
      const earthOrbitRadius = 900;
      const cameraDistance = 200;
      cam.setPosition(earthOrbitRadius + cameraDistance, 100, cameraDistance);
      cam.lookAt(earthOrbitRadius, 0, 0);
    } else if (currentView === 'death_star') {
      const earthOrbitRadius = 900;
      const cameraDistance = 200;
      cam.setPosition(earthOrbitRadius + cameraDistance, 100, cameraDistance);
      cam.lookAt(earthOrbitRadius, 0, 0);
    }
  }


  // Detener la cámara al soltar el ratón
  function mouseReleased() {
    dragging = false;
    camRotX = 0;
    camRotY = 0;
  }

  function drawOrbit(radius) {
    noFill();
    stroke(110); 
    strokeWeight(0.5);
    beginShape();
    for (let angle = 0; angle < 360; angle += 5) {
      let x = cos(radians(angle)) * radius;
      let z = sin(radians(angle)) * radius;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
  }


  function changeSpeed(multiplier) {
    speedMultiplier = multiplier;
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`speed${multiplier}x`).classList.add('active');
  }


  // function drawPlanetName(name, x, y, z) {
  //   push();
  //   resetMatrix();
  //   // Usamos una cámara ortográfica para superponer el texto
  //   ortho();
  //   fill(255);
  //   textAlign(CENTER, CENTER);
  //   textSize(30);
  //   // Convertimos las coordenadas de la escena 3D a 2D (se asume que (width/2, height/2) es el centro)
  //   text(name, screenPos.x, screenPos.y - 50);
  //   pop();
  // }

  function drawPlanetName(name, x, y, z) {
    push();
    
    // Convierte la posición 3D del planeta a coordenadas de pantalla
    let screenPos = screenPosition(x, y, z);
  
    // Si está dentro de la pantalla, dibuja el texto
    if (screenPos.x > 0 && screenPos.x < width && screenPos.y > 0 && screenPos.y < height) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(30);
      text(name, screenPos.x, screenPos.y - 40); // Ajusta la posición del texto
    }
  
    pop();
  }
  
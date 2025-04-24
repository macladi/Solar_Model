let textures = {};
let starBackground;
let bodies = [];
let selectedBody = null;

let camYaw = 0, camPitch = 75, camRadius = 800;
let camCenter, panFromCenter, panToCenter;
let panT = 0, panDuration = 500, isPanning = false;

let isDragging = false, lastMouseX = 0, lastMouseY = 0;
const dragSensitivity = 0.01;

let showOrbits = true;
let speedValue = 0.2;
let zoomValue = 800;

let menuDiv;
let toggleMenuBtn;
let menuVisible = true;
let infoVisible = false;

let targetZoom = zoomValue;

const realInfo = {
  Sun: {
    type: 'Star',
    radiusKm: 696340,
    distanceKm: 0,
    orbitalPeriod: '—',
    rotationPeriod: '25-36 days',
    temperature: '5,778 K',
    fact: 'Contains 99.86% of the Solar System’s mass.'
  },
  Mercury: {
    type: 'Planet',
    radiusKm: 2439.7,
    distanceKm: 57.9,
    orbitalPeriod: '88 days',
    rotationPeriod: '58.6 days',
    temperature: '167°C',
    fact: 'Has no atmosphere to retain heat.'
  },
  Venus: {
    type: 'Planet',
    radiusKm: 6051.8,
    distanceKm: 108.2,
    orbitalPeriod: '225 days',
    rotationPeriod: '243 days (retrograde)',
    temperature: '464°C',
    fact: 'Hottest planet due to greenhouse effect.'
  },
  Earth: {
    type: 'Planet',
    radiusKm: 6371,
    distanceKm: 149.6,
    orbitalPeriod: '365.25 days',
    rotationPeriod: '24 hours',
    temperature: '15°C',
    fact: 'Only planet known to support life.'
  },
  Moon: {
    type: 'Moon',
    radiusKm: 1737.4,
    distanceKm: 0.384,
    orbitalPeriod: '27.3 days',
    rotationPeriod: '27.3 days',
    temperature: '-53°C average',
    fact: 'Always shows the same face to Earth.'
  },
  Mars: {
    type: 'Planet',
    radiusKm: 3389.5,
    distanceKm: 227.9,
    orbitalPeriod: '687 days',
    rotationPeriod: '24.6 hours',
    temperature: '-63°C',
    fact: 'Home to the tallest volcano in the solar system.'
  },
  Jupiter: {
    type: 'Planet',
    radiusKm: 69911,
    distanceKm: 778.5,
    orbitalPeriod: '12 years',
    rotationPeriod: '9.9 hours',
    temperature: '-108°C',
    fact: 'Has a storm (the Great Red Spot) lasting centuries.'
  },
  Saturn: {
    type: 'Planet',
    radiusKm: 58232,
    distanceKm: 1_434,
    orbitalPeriod: '29 years',
    rotationPeriod: '10.7 hours',
    temperature: '-139°C',
    fact: 'Least dense planet; would float in water.'
  },
  Uranus: {
    type: 'Planet',
    radiusKm: 25362,
    distanceKm: 2_871,
    orbitalPeriod: '84 years',
    rotationPeriod: '17.2 hours (retrograde)',
    temperature: '-195°C',
    fact: 'Rotates on its side.'
  },
  Neptune: {
    type: 'Planet',
    radiusKm: 24622,
    distanceKm: 4_495,
    orbitalPeriod: '165 years',
    rotationPeriod: '16.1 hours',
    temperature: '-200°C',
    fact: 'Has the fastest winds in the solar system.'
  }
};

function preload() {
  const names = ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  names.forEach(name => {
    textures[name] = loadImage(`textures/${name.toLowerCase()}.jpg`);
  });
  starBackground = loadImage('textures/stars.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camCenter = createVector(0, 0, 0);

  styleTag = createElement('style', `
    .card {
      width: 200px;
      background-color: rgba(36, 40, 50, 0.5);
      background-image: linear-gradient(139deg, rgba(36,40,50,0.5) 0%, rgba(37,28,40,0.5) 100%);
      border-radius: 10px;
      padding: 15px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;

      /* oculto por defecto */
      visibility: hidden;
      opacity: 0;
      transform: scale(0.9);
      transition: visibility 0s 0.3s, opacity 0.3s ease-out, transform 0.3s ease-out;
    }

    .card.show {
      /* cuando tiene .show, aparece */
      visibility: visible;
      opacity: 1;
      transform: scale(1);
      transition-delay: 0s;
    }
    .card .separator {
      border-top: 1.5px solid #42434a;
      margin: 0 10px;
    }
    .card .list {
      list-style: none;
      padding: 0 10px;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card .element {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #eee;
      gap: 10px;
      transition: all .3s ease-out;
      padding: 4px 7px;
      border-radius: 6px;
      cursor: pointer;
    }
    .card .element .label {
      text-align: center;
      font-weight: 600;
    }
    .card .element:hover {
      background-color: #5353ff;
      color: #fff;
      transform: translate(1px, -1px);
    }
    .info-card {
      width: 240px;
      background: rgb(32,119,254)
      border-radius: 10px;
      padding: 15px;
      color: #ececec;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .info-header {
      margin: 0;
      font-size: 1.4em;
      text-align: center;
    }
    .info-grid {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 10px;
    }
    .info-row {
      display: contents;
    }
    .info-icon {
      font-size: 1.2em;
      line-height: 1;
    }
    .info-text {
      font-weight: 500;
    }
    .info-fact {
      margin: 8px 0 0 0;
      font-style: italic;
      border-left: 3px solid #5353ff;
      padding-left: 8px;
    }
    .btn-donate {
      --clr-font-main: hsla(0 0% 20% / 100);
      --btn-bg-1: hsla(194 100% 69% / 1);
      --btn-bg-2: hsla(217 100% 56% / 1);
      --btn-bg-color: hsla(360 100% 100% / 1);
      --radii: 0.5em;
      cursor: pointer;
      min-width: 200px;
      min-height: auto;
      font-size: var(--size, 1.2rem);
      font-weight: 1000;
      transition: 0.8s;
      background-size: 280% auto;
      background-image: linear-gradient(
        325deg,
        var(--btn-bg-2) 0%,
        var(--btn-bg-1) 55%,
        var(--btn-bg-2) 90%
      );
      border: none;
      border-radius: var(--radii);
      color: var(--btn-bg-color);
      box-shadow:
        0px 0px 20px rgba(71, 184, 255, 0.5),
        0px 5px 5px -1px rgba(58, 125, 233, 0.25),
        inset 4px 4px 8px rgba(175, 230, 255, 0.5),
        inset -4px -4px 8px rgba(19, 95, 216, 0.35);
    }

    .btn-donate:hover {
      background-position: right top;
    }

    @media (prefers-reduced-motion: reduce) {
      .btn-donate {
        transition: linear;
      }
    }
  `);
  styleTag.parent(document.head);

  bodies.push(new CelestialBody('Sun', 50, 0, 0, textures['Sun'], null, 'The Sun is the star at the center.'));
  const planetData = [
    ['Mercury', 5, 80, 0.02, 'Closest to Sun.'],
    ['Venus', 12, 110, 0.015, 'Thick toxic atmosphere.'],
    ['Earth', 12, 140, 0.01, 'Our home.'],
    ['Mars', 8, 180, 0.008, 'The Red Planet.'],
    ['Jupiter', 25, 250, 0.005, 'Largest planet.'],
    ['Saturn', 22, 320, 0.004, 'Famous rings.'],
    ['Uranus', 18, 380, 0.003, 'Rotates on its side.'],
    ['Neptune', 18, 440, 0.002, 'Strongest winds.']
  ];
  planetData.forEach(p => {
    let [name, r, d, s, info] = p;
    let pl = new CelestialBody(name, r, d, s * 1.5, textures[name], bodies[0], info);
    bodies.push(pl);
    if (name === 'Earth') {
      bodies.push(new CelestialBody('Moon', 4, 20, 0.03 * 1.5, textures['Moon'], pl, 'Orbits Earth.'));
    }
  });
  menuDiv = createDiv().addClass('card show')   // arranca abierto
    .style('position', 'absolute').style('top', '50px').style('right', '10px');
  infoDiv = createDiv().addClass('card')        // arranca cerrado
    .style('position', 'absolute').style('top', '10px').style('left', '10px');

  toggleMenuBtn = createButton('☰')
    .addClass('btn-donate')
    .style('position', 'absolute')
    .style('top', '10px')
    .style('right', '10px')
    .mousePressed(() => {
      menuVisible = !menuVisible;
      if (menuVisible) menuDiv.addClass('show');
      else menuDiv.removeClass('show');
    });

  // LISTA DE CONTROLES
  let controlList = createElement('ul').addClass('list').parent(menuDiv);

  // -- Velocidad --
  let liSpeed = createElement('li').addClass('element').parent(controlList);
  createElement('span', '-').addClass('label').parent(liSpeed)
    .mousePressed(() => {
      speedValue = max(0.001, speedValue - 0.1);
      select('#speedDisp').html(`SPEED: ${speedValue.toFixed(2)}`);
    });
  createElement('span', `SPEED: ${speedValue.toFixed(2)}`)
    .addClass('label').id('speedDisp').parent(liSpeed);
  createElement('span', '+').addClass('label').parent(liSpeed)
    .mousePressed(() => {
      speedValue = min(10, speedValue + 0.1);
      select('#speedDisp').html(`SPEED: ${speedValue.toFixed(2)}`);
    });

  // -- Zoom --
  let liZoom = createElement('li').addClass('element').parent(controlList);
  createElement('span', '-').addClass('label').parent(liZoom)
    .mousePressed(() => {
      targetZoom = min(2000, targetZoom + 50);
      zoomValue = targetZoom;
    });
  createElement('span', `ZOOM`)
    .addClass('label').id('zoomDisp').parent(liZoom);
  createElement('span', '+').addClass('label').parent(liZoom)
    .mousePressed(() => {
      targetZoom = max(150, targetZoom - 50);
      zoomValue = targetZoom;
    });

  // -- Toggle órbitas --
  let liOrbit = createElement('li', 'Toggle Orbits (O)')
    .addClass('element').style('justify-content', 'center').parent(controlList);
  liOrbit.mousePressed(() => showOrbits = !showOrbits);

  // -- Reset --
  let liReset = createElement('li', 'Reset (Space)')
    .addClass('element').style('justify-content', 'center').parent(controlList);
  liReset.mousePressed(() => {
    resetCamera();
    speedValue = 0.2; zoomValue = targetZoom = 800;
    select('#speedDisp').html(`SPEED: ${speedValue.toFixed(2)}`);
    select('#zoomDisp').html(`ZOOM`);
  });

  // Separador
  createElement('div').addClass('separator').parent(menuDiv);

  // LISTA DE PLANETAS
  let planetList = createElement('ul').addClass('list').parent(menuDiv);
  bodies.forEach(b => {
    let li = createElement('li').addClass('element').parent(planetList).mousePressed(() => {
      console.log(b);
      panFromCenter = camCenter.copy();
      panToCenter = b.getPosition();
      panT = 0; isPanning = true;
      selectedBody = b; showInfo(b);
    });
    createElement('span', b.name).addClass('label').style('width', '100%').parent(li)

  });
}

function draw() {
  background(0);

  // Smooth zoom transition
  camRadius = lerp(camRadius, targetZoom, 0.05); // Adjust the third parameter for smoother or faster zoom

  // Update camera speed
  let camX = camCenter.x + camRadius * cos(camYaw) * cos(camPitch);
  let camY = camCenter.y + camRadius * sin(camPitch);
  let camZ = camCenter.z + camRadius * sin(camYaw) * cos(camPitch);
  camera(camX, camY, camZ, camCenter.x, camCenter.y, camCenter.z, 0, 1, 0);

  // Planetary motion and panning speed
  bodies.forEach(b => b.update(speedValue)); // Pass speedValue to control planet speed

  if (isPanning) {
    panT += deltaTime;
    let t = min(panT / panDuration, 1);
    let e = (--t) * t * t + 1;
    camCenter = p5.Vector.lerp(panFromCenter, panToCenter, e);
    if (panT >= panDuration) isPanning = false;
  } else if (selectedBody) {
    camCenter = selectedBody.getPosition().copy();
  }


  pointLight(255, 255, 200, 0, 0, 0);
  ambientLight(30);

  // Draw background stars
  push();
  noLights();
  noStroke();
  texture(starBackground);
  scale(-1, 1, 1);
  sphere(2000, 64, 64);
  pop();

  if (showOrbits) drawOrbits();

  bodies.forEach(b => { b.update(); b.display(); });
}



function drawOrbits() {
  push();
  noFill();
  stroke(150);
  strokeWeight(0.5);
  bodies.forEach(b => {
    if (b.parent && b.orbitRadius > 0) {
      push();
      let c = b.parent.getPosition();
      translate(c.x, c.y, c.z);
      beginShape();
      for (let a = 0; a < TWO_PI + 0.1; a += 0.1) vertex(cos(a) * b.orbitRadius, 0, sin(a) * b.orbitRadius);
      endShape(CLOSE);
      pop();
    }
  });
  pop();
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (isDragging && !isPanning) {
    let dx = (mouseX - lastMouseX) * dragSensitivity;
    let dy = (mouseY - lastMouseY) * dragSensitivity;
    camYaw += dx;
    camPitch = constrain(camPitch + dy, -HALF_PI + 0.1, HALF_PI - 0.1);
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function keyPressed() {
  if (key === 'o' || key === 'O') showOrbits = !showOrbits;
  if (key === ' ') { // Espacio para deseleccionar
    resetCamera()
    infoDiv.removeClass('show');
  }
}

function showInfo(b) {
  const d = realInfo[b.name];
  console.log(d);
  if (!d) return;

  // Vacía primero el contenido anterior
  infoDiv.html('');
  // Asegúrate de que tenga la clase base de tarjeta
  infoDiv.addClass('info-card');

  // Título
  createElement('h2', b.name)
    .addClass('info-header')
    .parent(infoDiv);

  // Lista en grid
  const grid = createElement('ul')
    .addClass('info-grid')
    .parent(infoDiv);

  // Helper para crear cada fila con icono y texto
  const addRow = (icon, label, value) => {
    const li = createElement('li').addClass('info-row').parent(grid);
    createElement('span', icon).addClass('info-icon').parent(li);
    createElement('span', `${label}: ${value}`).addClass('info-text').parent(li);
  };

  addRow('🔭', 'Type', d.type);
  addRow('📏', 'Radius', `${d.radiusKm.toLocaleString()} km`);
  addRow('🌌', 'Dist. from ' + (b.parent ? b.parent.name : 'Sun'),
    `${d.distanceKm.toLocaleString()} million km`);
  addRow('⏳', 'Orbital Period', d.orbitalPeriod);
  addRow('🔄', 'Rotation Period', d.rotationPeriod);
  addRow('🌡️', 'Temperature', d.temperature);

  // Hecho curioso
  createElement('p', d.fact)
    .addClass('info-fact')
    .parent(infoDiv);

  // Finalmente hazlo visible
  infoDiv.addClass('show');
}


function resetCamera() {
  // Reset de ángulos y zoom
  camYaw = 0;
  camPitch = -0.4; // o el pitch que quieras por defecto
  targetZoom = 800;
  camRadius = targetZoom;

  // Centro de cámara en el Sol
  const sun = bodies[0];
  camCenter = sun.getPosition().copy();

  // Si quieres que al dibujar se quede pegado al Sol:
  selectedBody = sun;
  isPanning = false;

  // Ocultar info
  infoDiv.removeClass('show');
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
class CelestialBody {
  constructor(name, radius, orbitRadius, speed, tex, parent, info) {
    this.name = name;
    this.radius = radius;
    this.orbitRadius = orbitRadius;
    this.speed = speed;
    this.texture = tex;
    this.parent = parent;
    this.info = info;
    this.angle = random(TWO_PI);
  }

  update(customSpeed) {
    // Use customSpeed (e.g., speedValue) to modify the orbital movement
    if (this.orbitRadius > 0) {
      this.angle += (customSpeed || this.speed) * (deltaTime * 0.001);
    }
  }

  getPosition() {
    let x = cos(this.angle) * this.orbitRadius;
    let z = sin(this.angle) * this.orbitRadius;
    if (this.parent) {
      let p = this.parent.getPosition();
      return createVector(p.x + x, p.y, p.z + z);
    }
    return createVector(0, 0, 0);
  }

  display() {
    push();
    let pos = this.getPosition();
    translate(pos.x, pos.y, pos.z);
    if (!this.parent) {
      push();
      noLights();
      noStroke();
      texture(this.texture);
      sphere(this.radius, 24, 24);
      pop();
    } else {
      ambientMaterial(80);
      noStroke();
      texture(this.texture);
      sphere(this.radius, 24, 24);
    }
    pop();
  }
}

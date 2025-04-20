let textures = {};
let starBackground;
let bodies = [];
let selectedBody = null;

// Camera orbit params
let camYaw = 0, camPitch = 0, camRadius = 800;
// Camera center and panning
let camCenter, panFromCenter, panToCenter;
let panT = 0, panDuration = 1000, isPanning = false;

// Mouse drag
let isDragging = false, lastMouseX = 0, lastMouseY = 0;
const dragSensitivity = 0.01;

// Orbit toggle
let showOrbits = true;

// Picking buffer
let pickBuffer;

// Sidebar menu
let menuDiv;
let closeBtn;
let resetBtn;

function preload() {
  const names = ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  names.forEach(name => {
    textures[name] = loadImage(`textures/${name.toLowerCase()}.jpg`);
  });
  starBackground = loadImage('textures/stars.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Initialize camera center at origin
  camCenter = createVector(0, 0, 0);

  // Picking buffer
  pickBuffer = createGraphics(windowWidth, windowHeight, WEBGL);

  // Create bodies
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

  // Sidebar menu
  menuDiv = createDiv('').id('menuDiv')
    .style('position', 'absolute')
    .style('top', '50px').style('right', '0')
    .style('width', '250px').style('max-height', '80%')
    .style('overflow', 'auto')
    .style('background', 'rgba(0,0,0,0.8)')
    .style('color', '#fff').style('padding', '16px')
    .style('font-family', 'sans-serif')
    .hide();

  // Close button
  closeBtn = createButton('×')
    .style('position', 'absolute').style('top', '8px').style('right', '8px')
    .style('background', 'none').style('border', 'none').style('color', '#fff')
    .style('font-size', '20px').mousePressed(() => {
      menuDiv.hide();
      resetCamera();
    });
}

function draw() {
  background(0);

  // 1) Update panning
  if (isPanning) {
    panT += deltaTime;
    let t = min(panT / panDuration, 1);
    // ease-out cubic
    let e = (--t) * t * t + 1;
    camCenter = p5.Vector.lerp(panFromCenter, panToCenter, e);
    if (panT >= panDuration) isPanning = false;
  }

  // Compute camera position
  let camX = camCenter.x + camRadius * cos(camYaw) * cos(camPitch);
  let camY = camCenter.y + camRadius * sin(camPitch);
  let camZ = camCenter.z + camRadius * sin(camYaw) * cos(camPitch);

  // 2) Render picking buffer
  pickBuffer.push();
  pickBuffer.clear();
  pickBuffer.camera(camX, camY, camZ, camCenter.x, camCenter.y, camCenter.z, 0, 1, 0);

  // Render celestial bodies for picking
  bodies.forEach((b, i) => {
    pickBuffer.push();
    let pos = b.getPosition();
    pickBuffer.translate(pos.x, pos.y, pos.z);
    pickBuffer.noStroke();
    pickBuffer.fill(i + 1, 0, 0);  // Assign a unique ID based on the index
    pickBuffer.sphere(b.radius, 24, 24);
    pickBuffer.pop();
  });

  pickBuffer.pop();

  // 3) Main scene rendering
  pointLight(255, 255, 200, 0, 0, 0);
  ambientLight(30);
  camera(camX, camY, camZ, camCenter.x, camCenter.y, camCenter.z, 0, 1, 0);

  // Starfield
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

  // Pick
  let pix = pickBuffer.get(mouseX, mouseY);
  let id = pix[0];

  console.log("pix: ", pix);
  console.log("id: ", id);

  if (id > 0 && id <= bodies.length) {
    // start pan
    panFromCenter = camCenter.copy();
    panToCenter = bodies[id - 1].getPosition();
    panT = 0;
    isPanning = true;
    selectedBody = bodies[id - 1];
    showMenu(selectedBody);
  }
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
}

function showMenu(b) {
  menuDiv.html(`
    <h2>${b.name}</h2>
    <p>${b.info}</p>
    <p><em>Distance:</em> ${b.orbitRadius}</p>
    <p><em>Radius:</em> ${b.radius}</p>
  `);
  menuDiv.show();
  closeBtn.show();
  resetBtn.show();
}

function resetCamera() {
  // Reset the camera parameters
  camYaw = 0;
  camPitch = 0;
  camRadius = 800;
  camCenter = createVector(0, 0, 0);
  panFromCenter = null;
  panToCenter = null;
  panT = 0;
  isPanning = false;
  menuDiv.hide();  // Close the menu after reset
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pickBuffer = createGraphics(windowWidth, windowHeight, WEBGL);
}

// CelestialBody class unchanged...
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

  update() {
    if (this.orbitRadius > 0) this.angle += this.speed * (deltaTime * 0.001);
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
    // Sun
    if (!this.parent) {
      push();
      noLights();
      noStroke();
      texture(this.texture);
      sphere(this.radius, 24, 24);
      pop();
    }
    // Planet or moon
    else {
      ambientMaterial(80);
      noStroke();
      texture(this.texture);
      sphere(this.radius, 24, 24);
    }
    pop();
  }
}

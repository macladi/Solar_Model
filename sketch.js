let textures = {};
let starBackground;
let bodies = [];
let selectedBody = null;

let camYaw = 0, camPitch = 0, camRadius = 800;
let camCenter, panFromCenter, panToCenter;
let panT = 0, panDuration = 1000, isPanning = false;

let isDragging = false, lastMouseX = 0, lastMouseY = 0;
const dragSensitivity = 0.01;

let showOrbits = true;
let speedValue = 0.2;
let zoomValue = 800;

let menuDiv;
let toggleMenuBtn;
let menuVisible = true;

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

  menuDiv = createDiv().style('position', 'absolute').style('top', '50px').style('right', '10px').style('padding', '10px').style('background', '#000').style('color', '#fff').style('max-width', '200px').style('z-index', '10').style('border-radius', '5px');

  infoDiv = createDiv().style('position', 'absolute').style('top', '10px').style('left', '10px').style('padding', '10px').style('background', '#000').style('color', '#fff').style('max-width', '300px').style('z-index', '10').style('border-radius', '5px');

  // Toggle menu button
  toggleMenuBtn = createButton('☰')
    .style('position', 'absolute')
    .style('top', '10px').style('right', '10px')
    .style('width', '40px').style('height', '40px')
    .style('font-size', '24px')
    .style('border', 'none')
    .style('background', '#000').style('color', '#fff')
    .style('border-radius', '5px')
    .style('z-index', '20')
    .mousePressed(() => {
      menuVisible = !menuVisible;
      if (menuVisible) menuDiv.show();
      else menuDiv.hide();
    });

  // Speed control buttons
  let speedDisplay = createDiv()
    .parent(menuDiv)
    .style('margin', '10px 0')
    .html(`Speed: ${speedValue.toFixed(3)}`);

  createButton('-')
    .parent(menuDiv)
    .style('margin', '10px 0')
    .mousePressed(() => {
      speedValue = max(0.001, speedValue - 0.2);
      speedDisplay.html(`Speed: ${speedValue.toFixed(2)}`);
    });

  createButton('+')
    .parent(menuDiv)
    .style('margin', '10px 0')
    .mousePressed(() => {
      speedValue = min(200, speedValue + 0.2);
      speedDisplay.html(`Speed: ${speedValue.toFixed(2)}`);
    });

  // Zoom control buttons
  let zoomDisplay = createDiv()
    .parent(menuDiv)
    .style('margin', '10px 0')
    .html(`Zoom: ${zoomValue}`);

  // Zoom control buttons
  createButton('-')
    .parent(menuDiv)
    .style('margin', '10px 0')
    .mousePressed(() => {
      targetZoom = max(100, targetZoom - 50); // Change target zoom
      zoomDisplay.html(`Zoom: ${targetZoom}`);
    });

  createButton('+')
    .parent(menuDiv)
    .style('margin', '10px 0')
    .mousePressed(() => {
      targetZoom += 50; // Change target zoom
      zoomDisplay.html(`Zoom: ${targetZoom}`);
    });


  // Toggle orbit visibility
  createButton('Toggle Orbits (O)')
    .parent(menuDiv)
    .style('margin', '10px 0')
    .style('display', 'block')
    .mousePressed(() => {
      showOrbits = !showOrbits;
    });

  // Add Reset Button for Zoom and Speed
  createButton('Reset')
    .parent(menuDiv)
    .style('margin', '10px 0')
    .mousePressed(() => {
      resetCamera();
      speedValue = 0.2;
      zoomValue = 800;
      speedDisplay.html(`Speed: ${speedValue.toFixed(1)}`);
      zoomDisplay.html(`Zoom: ${zoomValue}`);
    });




  // Existing planet buttons
  bodies.forEach(body => {
    createButton(body.name)
      .parent(menuDiv)
      .style('display', 'block')
      .style('margin', '4px 0')
      .style('width', '100%')
      .style('background', '#333')
      .style('color', '#fff')
      .style('border', 'none')
      .style('padding', '6px')
      .style('text-align', 'left')
      .mousePressed(() => {
        panFromCenter = camCenter.copy();
        panToCenter = body.getPosition();
        panT = 0;
        isPanning = true;
        selectedBody = body;
        showInfo(body);
      });
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
    selectedBody = null;
  }
}

function showInfo(b) {
  const d = realInfo[b.name];
  if (!d) return;

  const html = `
    <h2>${b.name}</h2>
    <p><strong>Type:</strong> ${d.type}</p>
    <p><strong>Radius:</strong> ${d.radiusKm.toLocaleString()} km</p>
    <p><strong>Distance from ${b.parent ? b.parent.name : 'Sun'}:</strong> ${d.distanceKm.toLocaleString()} million km</p>
    <p><strong>Orbital Period:</strong> ${d.orbitalPeriod}</p>
    <p><strong>Rotation Period:</strong> ${d.rotationPeriod}</p>
    <p><strong>Temperature:</strong> ${d.temperature}</p>
    <p><em>${d.fact}</em></p>
  `;

  infoDiv.html(html);
}


function resetCamera() {
  camYaw = 0;
  camPitch = 0;
  camRadius = 800;
  camCenter = createVector(0, 0, 0);
  isPanning = false;
  targetZoom = 800; // Reset target zoom
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

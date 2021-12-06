let walls = [];
let ray;
let particle;
let player;
let xoff = 0;
let yoff = 10000;
let inactivityTimer;
let reconnectMsg = false;
let fullscreenToggle = false;

const mapH = 720;
const mapW = 1280;
let sliderFOV;

let players = [];
let playersPos = [];
let playersData = [];
const playerSize = 13;
const renderHeight = 25;

var socket;
var startTime;
var latency = 0;
let fr = 0;
let camera;
let cZ = 0;

let regularFont;
function preload(){
  regularFont = loadFont('assets/Helvetica.ttf');
  hauntedBusTexture = loadImage('assets/hauntedbus.jpg');
  ultraWideMonitorTexture = loadImage('assets/ultrawidemonitor.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  frameRate(60);
  camera = createCamera();
  angleMode(DEGREES);
  cZ = (height/2.0) / tan((PI/3)/2.0);

  socket = io.connect('/');
  socket.on('receivePos', recivePos);
  
  socket.on('hit', function(){
    console.log('died');
    particle.respawn(mapW, mapH);
  });

  setInterval(function(){
    startTime = Date.now();
    socket.emit('pingg');
  }, 2000);
  setInterval(function(){
    fr = frameRate();
  }, 500);

  socket.on('pongg', function(){
    latency = Date.now() - startTime;
  });
  
  socket.on('pinggg', function(){
    socket.emit('ponggg');
  });
  
  walls = [
    new Boundary(0, 0, mapW, 0, 0),
    new Boundary(mapW, 0, mapW, mapH, 90),
    new Boundary(mapW, mapH, 0, mapH, 0),
    new Boundary(0, mapH, 0, 0, 90)
  ];
  particle = new Particle(mapW, mapH);
  players = [new Player(200, 200, 90)];
  // sliderFOV = createSlider(60, 120, 80, 5);
  // sliderFOV.input(changeFOV);
}

function recivePos(data) {
  players = data.players;
  playersPos = data.playersPos;
  playersData = [];
  for (let i = 0; i < players.length; i++){
    if (players[i] == socket.id){
      players.splice(i, 1);
      playersPos.splice(i * 3, 3);
    }
  }
  
  for (let i = 0; i < playersPos.length; i += 3){
    let playerUUID = null;
    if (i == 0){
      playerUUID = players[i];
    }else{
      playerUUID = players[i/3];
    }
    playersData.push(new Player(playersPos[i], playersPos[i + 1], playersPos[i + 2], playerUUID, playerSize));
    //playersData[i].getEndpoints();
  }
}

function changeFOV(){
  //const fov = sliderFOV.value();
  //particle.updateFOV(fov);
}

function keyPressed() {
  if (key == 'f'){
    if (fullscreenToggle == false){
      fullscreen(1);
      resizeCanvas(displayWidth, displayHeight);
    }else {
      fullscreen(0);
      resizeCanvas(windowWidth, windowHeight);
    }
    
  }
  if (keyCode == UP_ARROW){
    for (let player of playersData){
      player.getEndpoints();
    }
    let shootObjects = walls.concat(playersData);
    // shootObjects = walls.concat(playersData);
    const hitPlayer = particle.shoot(shootObjects, playersData);
    if (hitPlayer != 'noHit'){
      for (let player of playersData){
        if (player.uuid == hitPlayer){
          socket.emit('hitPlayer', hitPlayer);
          console.log('shot ' + hitPlayer);
        }
      }
    }
  }
}

function draw() {
  if (walls.length > 9){
    walls.splice(10, walls.length - 9);
  }
  
  var myPos = {
    x: particle.pos.x,
    y: particle.pos.y,
    heading: particle.heading
  }
  var socketID = {
    ID: socket.id
  }

  socket.emit('sendPos', myPos);

  if (keyIsDown(LEFT_ARROW)){
    particle.rotate(-3);
  } else if (keyIsDown(RIGHT_ARROW)){
    particle.rotate(3);
  }
  if (keyIsDown(87)){
    particle.move(3, walls, playerSize);
  } else if (keyIsDown(83)){
    particle.move(-3, walls, playerSize);
  }
  if (keyIsDown(65)){
    particle.strafe(-3, walls, playerSize);
  } else if (keyIsDown(68)){
    particle.strafe(3, walls, playerSize);
  }

  if (!focused){
    inactivityTimer++;
  } else if (inactivityTimer != 3000){
    inactivityTimer = 0;
  }

  background(0);
  
  for (let wall of walls){ // ** Wall Renderer **
    push();
    angleMode(DEGREES);
    translate(wall.midpoint.x, 0, wall.midpoint.y);
    rotateY(wall.angle);
    //texture(ultraWideMonitorTexture);
    plane(wall.size, renderHeight);
    pop();
  }
  for (let player of playersData){
    push();
    angleMode(DEGREES);
    player.getEndpoints();
    translate(player.x, 0, player.y);
    rotateY(player.heading + 90);
    texture(hauntedBusTexture);
    plane(playerSize, renderHeight);
    pop();
  }
  
  push();
  particle.look();
  camera.camera(particle.pos.x, 0, particle.pos.y, particle.camPos.x, 0, particle.camPos.y, 0, 1, 0);
  
  camera.perspective(particle.fov, float(width)/float(height), cZ/10.0, cZ*10.0);
  pop();
  
  textFont(regularFont);
  push();
  //translate(particle.pos.x, particle.pos.y, 0);
  //rotateY(particle.heading);
  fill(255);
  stroke(0);
  strokeWeight(5);
  text("fps: " + round(fr), 10, 20);
  text(round(latency) + 'ms', 10, 40);
  text("X: " + round(particle.pos.x), 10, 60);
  text("Y: " + round(particle.pos.y), 10, 80);
  text('alpha-release-0.1', width - 110, 20);
  pop();
}

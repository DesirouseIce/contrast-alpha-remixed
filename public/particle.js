class Particle {
  constructor(mapW, mapH) {
    this.fov = 70;
    this.heading = 0;
    this.spawnloc = [10, mapW - 10];
    this.pos = createVector(random(this.spawnloc), random(mapH/2 - 40, mapH/2 + 40));                                                                         // -
    this.camPos = createVector(0, 0);
  }
  
  updateFOV(fov){ // - updates the FOV from slider input
    this.fov = fov;
  }
  
  rotate(angle){    // - rotates veiw left and right
    this.heading += angle;
  }
  
  move(amt, walls, playerSize){  // - particle/player foward and backward movement
    const vel = p5.Vector.fromAngle(radians(this.heading));
    vel.setMag(amt);
    this.pos.add(vel);
    let collision = false;
    for(let wall of walls){
      if (collideLineCircle(wall.x1, wall.y1, wall.x2,  wall.y2, this.pos.x, this.pos.y, playerSize)) collision = true;
    }
    if (collision) this.pos.sub(vel);
  }
  
  strafe(amt, walls, playerSize){ // - particle/player strafe movement
    const vel = p5.Vector.fromAngle(radians(this.heading) + radians(90));
    vel.setMag(amt);
    this.pos.add(vel);
    let collision = false;
    for(let wall of walls){
      if (collideLineCircle(wall.x1, wall.y1, wall.x2, wall.y2, this.pos.x, this.pos.y, playerSize)) collision = true;
    }
    if (collision) this.pos.sub(vel);
  }
  
  look(){
    const vec = p5.Vector.fromAngle(radians(this.heading));
    vec.setMag(3);
    this.camPos.set(this.pos);
    this.camPos.add(vec);
  }
  
  update(x, y){  // - updates position with x and y coords.
    this.pos.set(x, y);
  }
  
  // ** Legacy shoot method **
  shoot(shootObjects, playersData) {
    const ray = new Ray(this.pos, radians(this.heading));
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < shootObjects.length; i++){
      const pt = ray.cast(shootObjects[i]);
      if (pt){
        let d = p5.Vector.dist(this.pos, pt);
        const a = ray.dir.heading() - radians(this.heading);
        d *= cos(a);
        if (d < record){
          record = d;
          closest = pt;
        }
      }
    }
    let hit = 'noHit';
    if (playersData.length > 0){
      for (let player of playersData){
        if (collidePointLine(closest.x, closest.y, player.a.x, player.a.y, player.b.x, player.b.y)){
          hit = player.uuid;
        }
      }
    }
    return hit;
  }
          
  respawn(mapW, mapH){
    this.spawnloc = [10, mapW - 10];
    this.pos = createVector(random(this.spawnloc), random(mapH/2 - 40, mapH/2 + 40));                                                                         // -
  }
}

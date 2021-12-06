class Player{
  constructor(x, y, heading, uuid, playerSize){
    this.x = x;
    this.y = y;
    this.heading = heading;
    this.uuid = uuid;
    this.playerSize = playerSize;
    
    this.a = null;
    this.b = null;
  }
  
  getEndpoints(){
    let a = createVector(this.x - this.playerSize, this.y);  // ** Creates Endpoints **
    let b = createVector(this.x + this.playerSize, this.y);
    
    let a_mid = createVector(a.x - this.x, a.y - this.y);  // ** Makes the midpoint the origin **
    let b_mid = createVector(b.x - this.x, b.y - this.y);
    
    let a_rotated = createVector(cos(this.heading) * a_mid.x - sin(this.heading) * a_mid.y,  // ** Uses a rotation matrix to rotate endpoints **
                                  sin(this.heading) * a_mid.x + cos(this.heading) * a_mid.y);
    let b_rotated = createVector(cos(this.heading) * b_mid.x - sin(this.heading) * b_mid.y,
                                  sin(this.heading) * b_mid.x + cos(this.heading) * b_mid.y);
    
    a_rotated.x = a_rotated.x + this.x;  // ** adds the midpoint coordinates to return the endpoints to previous origin **
    a_rotated.y = a_rotated.y + this.y;
    b_rotated.x = b_rotated.x + this.x;
    b_rotated.y = b_rotated.y + this.y;
    
    this.a = createVector(a_rotated.x, a_rotated.y);
    this.b = createVector(b_rotated.x, a_rotated.y);
    //return (a_rotated, b_rotated);  // ** final points after rotation **
  }
}
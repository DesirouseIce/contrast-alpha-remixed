class Boundary{
  constructor(x1, y1, x2, y2, angle){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.angle = angle;
    this.midpoint = createVector((this.x1 + this.x2)/2, (this.y1 + this.y2)/2);
    this.size = sqrt(sq(this.x2 - this.x1) + sq(this.y2 - this.y1));
    
    this.a = createVector(this.x1, this.y1);
    this.b = createVector(this.x2, this.y2);
    
  }
}
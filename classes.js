module.exports.Bomb = class Bomb {
  
  constructor({x,y}, BOMBS) {
    this.x = x;
    this.y = y;
    this.exploded = false
    this.id = Math.random()
    
    setTimeout(() => {
      this.explode()
    }, 3000)
    
    setTimeout(() => {
      const index = BOMBS.findIndex(bomb => bomb.id === this.id)
      BOMBS.splice(index, 1)
      this.dead = true;
    }, 4000)
  }
  
  explode() {
    this.exploded = true;
  }
  
}
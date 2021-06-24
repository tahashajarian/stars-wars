export default class Enemi {
  constructor({ ctx, x, y, radius, color, velocity }) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.strokeStyle = this.color
    this.ctx.stroke()
  }

  update(velocity) {
    this.draw()
    this.x += velocity.x
    this.y += velocity.y
  }
}

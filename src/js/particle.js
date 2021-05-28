export default class Particle {
  constructor({ ctx, x, y, radius, color, velocity, frication }) {
    this.frication = frication
    this.ctx = ctx
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    this.ctx.save()
    this.ctx.globalAlpha = this.alpha
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    this.ctx.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= this.frication
    this.velocity.y *= this.frication
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.alpha -= 0.01
  }
}

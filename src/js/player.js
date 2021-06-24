export default class Player {
  constructor({ ctx, x, y, radius, color }) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    // this.ctx.beginPath()
    // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    // this.ctx.fillStyle = this.color
    // this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    this.ctx.moveTo(this.x + 35, this.y)
    this.ctx.arc(this.x, this.y, this.radius - 15, 0, Math.PI, false)
    this.ctx.moveTo(this.x - 10, this.y - 10)
    this.ctx.arc(
      this.x - 15,
      this.y - 10,
      this.radius - 45,
      0,
      Math.PI * 2,
      true
    ) // Left eye
    this.ctx.moveTo(this.x + 20, this.y - 10)
    this.ctx.arc(
      this.x + 15,
      this.y - 10,
      this.radius - 45,
      0,
      Math.PI * 2,
      true
    ) // Right eye
    this.ctx.strokeStyle = this.color
    this.ctx.stroke()
    // this.ctx.fill()
  }

  update(velocity) {
    this.draw()
    this.x += velocity.x
    this.y += velocity.y
  }
}

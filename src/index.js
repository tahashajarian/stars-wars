import gsap from 'gsap'

import Player from './js/player'
import Enemi from './js/enemi'
import Projectile from './js/projectile'
import Particle from './js/particle'

import './styles/index.scss'
import { getPositionOfEvent, convertEventName } from './js/convert-event'

class GameManager {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx = this.canvas.getContext('2d')
    this.scoreEl = document.querySelector('#scoreEl')
    this.startGameEl = document.querySelector('#startGameEl')
    this.modalEl = document.querySelector('#modalEl')
    this.modalScoreEl = document.querySelector('#modalScoreEl')
    this.fpsEl = document.querySelector('#fps')
    this.highScoreEl = document.querySelector('#highScoreEl')
    this.score = 0
    this.animateId = 0
    this.projectiles = []
    this.enemies = []
    this.particles = []
    this.isDraging = false
    this.lastCalledTime = 0
    this.numberFps = 0
    this.enemiTimeCreate = 100
    this.fireSpeed = 5
    this.highScore = localStorage.getItem('high-score') || 0
    this.mousePosition = { x: 0, y: 0 }
  }

  startGame() {
    this.player = new Player({
      ctx: this.ctx,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 10,
      color: 'white',
    })

    this.startGameEl.onclick = () => {
      this.init()
      this.animate()
      this.modalEl.style.display = 'none'
    }

    window.addEventListener(convertEventName('mousedown'), (e) => {
      this.isDraging = true
      this.mousePosition = getPositionOfEvent(e)
    })

    window.addEventListener(convertEventName('mouseup'), () => {
      this.isDraging = false
    })

    window.addEventListener(convertEventName('mousemove'), (e) => {
      this.mousePosition = getPositionOfEvent(e)
    })

    this.highScoreEl.innerHTML = this.highScore
    window.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  init() {
    this.player = new Player({
      ctx: this.ctx,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 10,
      color: 'white',
    })
    this.projectiles = []
    this.enemies = []
    this.particles = []
    this.updateScore(0)
  }

  updateScore(score) {
    this.score = score
    this.scoreEl.innerHTML = score
  }

  spawnEnemies() {
    const radius = Math.random() * (30 - 5) + 5
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : this.canvas.width + radius
      y = Math.random() * this.canvas.height
    } else {
      x = Math.random() * this.canvas.width
      y = Math.random() < 0.5 ? 0 - radius : this.canvas.height + radius
    }
    const angel = Math.atan2(
      this.canvas.height / 2 - y,
      this.canvas.width / 2 - x
    )
    const velocity = {
      x: Math.cos(angel),
      y: Math.sin(angel),
    }
    const enemi = new Enemi({ ctx: this.ctx, x, y, radius, color, velocity })
    this.enemies.push(enemi)
  }

  animate() {
    this.numberFps += 1
    this.animatedId = requestAnimationFrame(() => this.animate())
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.player.draw()
    this.projectiles.forEach((projectile, index) => {
      projectile.update()
      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > this.canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > this.canvas.height
      ) {
        setTimeout(() => {
          this.projectiles.splice(index, 1)
        }, 0)
      }
    })
    this.enemies.forEach((enemi, index) => {
      enemi.update()
      let dist = Math.hypot(enemi.x - this.player.x, enemi.y - this.player.y)
      if (dist - enemi.radius - this.player.radius < 0) {
        cancelAnimationFrame(this.animatedId)
        this.modalEl.style.display = 'flex'
        this.modalScoreEl.innerHTML = this.score
        if (this.score > this.highScore) {
          this.highScore = this.score
          localStorage.setItem('high-score', this.highScore)
          this.highScoreEl.innerHTML = this.highScore
        }
      }
      this.projectiles.forEach((projectile, projectileIndex) => {
        dist = Math.hypot(projectile.x - enemi.x, projectile.y - enemi.y)
        // hit the enemy
        if (dist - enemi.radius - projectile.radius < -2) {
          if (enemi.radius - 10 > 10) {
            setTimeout(() => {
              this.projectiles.splice(projectileIndex, 1)
              gsap.to(enemi, {
                radius: enemi.radius - 10,
              })
            }, 0)
            this.score += 1
          } else {
            this.score += 2
            if (this.score > 1000) {
              this.enemiTimeCreate = 50
            }
            setTimeout(() => {
              this.projectiles.splice(projectileIndex, 1)
              this.enemies.splice(index, 1)
            }, 0)
          }
          this.scoreEl.innerHTML = this.score
          for (let i = 0; i < enemi.radius * 2; i += 1) {
            const particle = new Particle({
              ctx: this.ctx,
              x: projectile.x,
              y: projectile.y,
              radius: Math.random() * 2,
              color: enemi.color,
              velocity: {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              },
              frication: 0.99,
            })
            this.particles.push(particle)
          }
        }
      })
    })
    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1)
      } else {
        particle.update()
      }
    })
    const countedFps = parseInt(this.requestAnimFrame(), 10)
    if (this.numberFps % 5 === 0) {
      this.fpsEl.innerText = countedFps + ' fps'
    }
    if (this.numberFps % this.enemiTimeCreate === 0) {
      this.spawnEnemies()
    }
    if (this.isDraging) {
      if (this.numberFps % this.fireSpeed === 0) this.fire(this.mousePosition)
    }
  }

  fire(mousePosition) {
    const angel = Math.atan2(
      mousePosition.y - this.canvas.height / 2,
      mousePosition.x - this.canvas.width / 2
    )
    const velocity = {
      x: Math.cos(angel) * 5,
      y: Math.sin(angel) * 5,
    }
    const projectile = new Projectile({
      ctx: this.ctx,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 5,
      color: 'white',
      velocity,
    })
    this.projectiles.push(projectile)
  }

  requestAnimFrame() {
    let fps
    if (!this.lastCalledTime) {
      this.lastCalledTime = Date.now()
      fps = 0
    }

    const delta = (Date.now() - this.lastCalledTime) / 1000
    this.lastCalledTime = Date.now()
    fps = 1 / delta
    return fps
  }
}
const gameManager = new GameManager()
gameManager.startGame()

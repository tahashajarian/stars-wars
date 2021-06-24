import gsap from 'gsap'

import Player from './js/player'
import Enemi from './js/enemi'
import Projectile from './js/projectile'
import Particle from './js/particle'

import './styles/index.scss'
import { getPositionOfEvent, convertEventName } from './js/convert-event'
import Controller from './js/controller'
import SoundManager from './js/sound-manager'

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
    this.enemiTimeCreate = 40
    this.fireSpeed = 10
    this.highScore = localStorage.getItem('high-score') || 0
    this.mousePosition = { x: 0, y: 0 }
    this.playerSpeed = 3
  }

  startGame() {
    this.player = new Player({
      ctx: this.ctx,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 10,
      color: 'white',
    })
    this.soundManager = new SoundManager()
    this.startGameEl.onclick = () => {
      this.init()
      this.animate()
      this.modalEl.style.display = 'none'
      this.soundManager.playGround(true)
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
    this.controller = new Controller()
  }

  init() {
    this.player = new Player({
      ctx: this.ctx,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 50,
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
    const angel = Math.atan2(this.player.y - y, this.player.x - x)
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
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
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
      const angel = Math.atan2(this.player.y - enemi.y, this.player.x - enemi.x)
      const velocity = {
        x: Math.cos(angel),
        y: Math.sin(angel),
      }
      enemi.update(velocity)
      let dist = Math.hypot(enemi.x - this.player.x, enemi.y - this.player.y)
      if (dist - enemi.radius - this.player.radius < 0) {
        cancelAnimationFrame(this.animatedId)
        this.soundManager.die()
        this.soundManager.playGround(false)
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
            this.soundManager.damage()
          } else {
            this.score += 2
            this.soundManager.explode()
            setTimeout(() => {
              this.projectiles.splice(projectileIndex, 1)
              this.enemies.splice(index, 1)
            }, 0)
          }
          this.scoreEl.innerHTML = this.score
          for (let i = 0; i < enemi.radius; i += 1) {
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
            if (this.particles.length < 100) {
              this.particles.push(particle)
            }
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

    // move player
    const playerVelocity = { x: 0, y: 0 }
    if (this.controller.up) playerVelocity.y -= this.playerSpeed
    if (this.controller.right) playerVelocity.x += this.playerSpeed
    if (this.controller.down) playerVelocity.y += this.playerSpeed
    if (this.controller.left) playerVelocity.x -= this.playerSpeed
    this.player.update(playerVelocity)
    if (
      this.controller.up ||
      this.controller.right ||
      this.controller.down ||
      this.controller.left
    ) {
      if ((this.numberFps % this.playerSpeed) * 2 === 0)
        this.soundManager.move()
    }
    if (this.player.x < 0) {
      this.player.x = this.canvas.width
    }
    if (this.player.x > this.canvas.width) {
      this.player.x = 0
    }
    if (this.player.y < 0) {
      this.player.y = this.canvas.height
    }
    if (this.player.y > this.canvas.height) {
      this.player.y = 0
    }
  }

  fire(mousePosition) {
    const angel = Math.atan2(
      mousePosition.y - this.player.y,
      mousePosition.x - this.player.x
    )
    const velocity = {
      x: Math.cos(angel) * 5,
      y: Math.sin(angel) * 5,
    }
    const projectile = new Projectile({
      ctx: this.ctx,
      x: this.player.x + ((this.player.radius / 2) * velocity.x) / 2,
      y: this.player.y + ((this.player.radius / 2) * velocity.y) / 2,
      radius: 5,
      color: 'white',
      velocity,
    })
    this.projectiles.push(projectile)
    this.soundManager.fire()
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

/* eslint-disable indent */
import fireSound from '../sounds/shoot.mp3'
import damageSound from '../sounds/damage.mp3'
import explodeSound from '../sounds/explode.mp3'
import dieSound from '../sounds/die.mp3'
import moveSound from '../sounds/move.mp3'
import plagGroundSound from '../sounds/playground.mp3'

export default class SoundManager {
  constructor() {
    this.playGroundSound = new Audio(plagGroundSound)
    this.playGroundSound.loop = true
  }

  fire() {
    this.fireSound = new Audio(fireSound)
    this.fireSound.play()
  }

  damage() {
    this.damageSound = new Audio(damageSound)
    this.damageSound.play()
  }

  explode() {
    this.explodeSound = new Audio(explodeSound)
    this.explodeSound.play()
  }

  die() {
    this.dieSound = new Audio(dieSound)
    this.dieSound.play()
  }

  move() {
    this.moveSound = new Audio(moveSound)
    this.moveSound.play()
  }

  playGround(mustPlay) {
    if (mustPlay) {
      this.playGroundSound.play()
    } else {
      this.playGroundSound.pause()
    }
  }
}

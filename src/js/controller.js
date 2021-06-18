import { isMobile } from "./detect-device"

/* eslint-disable indent */
export default class Controller {
  constructor() {
    this.right = false
    this.left = false
    this.up = false
    this.down = false
    this.isMobile = isMobile()
    if (this.isFinite) {
      this.createHandle()
    } else {
      window.addEventListener('keyup', (e) => this.handleKeyPress(e))
      window.addEventListener('keydown', (e) => this.handleKeyPress(e))
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleKeyPress(e) {
    const { keyCode, type } = e
    const state = type === 'keydown'
    switch (keyCode) {
      case 37:
      case 65:
        this.left = state
        break
      case 38:
      case 87:
        this.up = state
        break
      case 39:
      case 68:
        this.right = state
        break
      case 40:
      case 83:
        this.down = state
        break
      default:
        break
    }
    
    createHandle() {

    }
    // eslint-disable-next-line no-console
  }
}

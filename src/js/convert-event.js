import { isMobile } from './detect-device'

/* eslint-disable indent */
export const convertEventName = (event) => {
  if (isMobile()) {
    switch (event) {
      case 'mousedown':
        return 'touchstart'
      case 'mousemove':
        return 'touchmove'
      case 'mouseup':
        return 'touchend'

      default:
        return event
    }
  } else {
    return event
  }
}

/* eslint-disable indent */
export const convertEvent = (event) => {
  if (isMobile()) {
    return event.touches[0]
  }
  return event
}

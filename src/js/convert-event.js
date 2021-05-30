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
export const getPositionOfEvent = (event) => {
  if (isMobile()) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    }
  }
  return {
    x: event.clientX,
    y: event.clientY,
  }
}

import Slider from './slider.js'
import supportTouchDevice from './supportTouchDevice'
import supportMouseAndKeyboard from './supportMouseAndKeyboard'

export default supportMouseAndKeyboard(supportTouchDevice(Slider))

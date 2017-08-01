import { Component } from 'react'
import { spring } from 'react-motion'

export default function supportTouchDevice(Slider) {
  class TouchSlider extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isPressed: false,
        pressed: [0, 0],
        delta: [0, 0]
      }
    }
    componentDidMount() {
      document.addEventListener('touchstart', this.start.bind(this))
      document.addEventListener('touchmove', this.move.bind(this))
      document.addEventListener('touchend', this.end.bind(this))
    }
    start(e) {
      const source = e.touches ? e.touches[0] : e
      const { pageX, pageY } = source
      if (this.state.delta[0] !== 0) {
        return
      }
      this.setState({
        isPressed: true,
        pressed: [pageX, pageY]
      })
    }
    move(e) {
      const source = e.touches ? e.touches[0] : e
      const { pageX, pageY } = source
      if (e.preventDefault) {
        e.preventDefault()
      }
      const { isPressed, pressed } = this.state
      let [x, y] = pressed
      if (isPressed) {
        this.setState({
          delta: [pageX - x, pageY - y]
        })
      }
    }
    end() {
      const { pageIndex, pageCount, pageHeight } = this.props
      const { delta } = this.state
      let [x, y] = delta
      let newDelta = [0, 0]
      if ((y > 0 && 0 < pageIndex) || (y < 0 && pageIndex < pageCount - 1)) {
        if (Math.abs(y) > pageHeight * 0.2) {
          newDelta = [x, y > 0 ? pageHeight : -pageHeight]
        } else {
          newDelta = [1, 0]
        }
      }
      if (
        (y > 0 && pageIndex === 0) ||
        (y < 0 && pageIndex === pageCount - 1)
      ) {
        newDelta = [1, 0]
      }
      this.setState({
        isPressed: false,
        delta: newDelta
      })
    }
    handlePage() {
      const { onPage, pageIndex } = this.props
      const { isPressed, pressed, delta } = this.state
      if (arguments.length) {
        onPage.apply(this, Array.prototype.slice.call(arguments, 0))
        return
      }
      if (isPressed) {
        return
      }
      if (pressed[0]) {
        if (delta[1]) {
          let nextPage = pageIndex + (delta[1] > 0 ? -1 : 1)
          onPage(nextPage)
        }
        this.setState({
          pressed: [0, 0],
          delta: [0, 0]
        })
      }
    }
    render() {
      let { style } = this.props
      if (style) {
        return <Slider {...this.props} />
      }
      const { isPressed, delta } = this.state
      if (isPressed) {
        let [, y] = delta
        style = {
          offset: y
        }
      } else if (delta[0]) {
        let [, y] = delta
        style = {
          offset: spring(y, { stiffness: 260, damping: 30, precision: 1 })
        }
      }
      return (
        <Slider
          {...this.props}
          style={style}
          onPage={this.handlePage.bind(this)}
        />
      )
    }
  }
  TouchSlider.propTypes = Slider.propTypes
  TouchSlider.defaultProps = {
    pageHeight: window.innerHeight
  }
  return TouchSlider
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { addWheelListener, removeWheelListener } from 'wheel'
import { Motion, spring } from 'react-motion'

const wrapperStyle = {
  WebkitTransform: 'translate3d(0, 0, 0)',
  transform: 'translate3d(0, 0, 0)',
  height: '100%'
}

function connectToTouchDevice(Slider) {
  return class TouchSlider extends Component {
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
      const { onPage, pageIndex, style } = this.props
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
}

function connectToMouseAndKeyboard(Slider) {
  return class WrappedSlider extends Component {
    constructor(props) {
      super(props)
      this.state = {
        direction: 0
      }
    }
    handlePrev() {
      const { direction } = this.state
      const { pageIndex } = this.props
      if (direction) {
        return
      }
      if (pageIndex > 0) {
        this.setState({
          direction: -1
        })
      }
    }
    handleNext() {
      const { direction } = this.state
      if (direction) {
        return
      }
      let { pageIndex, pageCount } = this.props
      if (pageIndex < pageCount - 1) {
        this.setState({
          direction: 1
        })
      }
    }
    componentDidMount() {
      this.onWheel = e => {
        const { deltaY } = e
        if (deltaY < 0) {
          this.handlePrev()
        } else if (deltaY > 0) {
          this.handleNext()
        }
        if (e.preventDefault) {
          e.preventDefault()
        }
      }
      this.onKeydown = e => {
        if (e.key === 'ArrowUp') {
          this.handlePrev()
        } else if (e.key === 'ArrowDown') {
          this.handleNext()
        }
      }
      addWheelListener(document.body, this.onWheel)
      document.addEventListener('keydown', this.onKeydown)
    }
    componentWillUnmount() {
      removeWheelListener(document.body, this.onWheel)
      document.removeEventListener('keydown', this.onKeydown)
    }
    handlePage() {
      let { pageIndex, onPage, style } = this.props
      let { direction } = this.state
      if (arguments.length) {
        onPage.apply(this, Array.prototype.slice.call(arguments, 0))
        return
      }
      if (direction) {
        onPage(pageIndex + direction)
        this.setState({
          direction: 0
        })
      }
    }
    render() {
      const { direction } = this.state
      let { pageHeight, style } = this.props
      if (style) {
        return <Slider {...this.props} />
      }
      if (direction) {
        style = {
          offset: spring(-direction * pageHeight)
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
}

class Slider extends Component {
  updateStyle(value) {
    // https://github.com/chenglou/react-motion/issues/322
    // onRest in react-motion doesn't trigger re-render
    // here we could determine whether the previous animation has ended
    // by checking out if currentStyle === lastStyle && nextStyle === initialStyle
    let { pageIndex, style, pageHeight } = this.props
    let { offset } = value
    let newOffset = `${Math.abs(offset) === pageHeight && style.offset === 0
      ? -pageHeight * pageIndex
      : -pageHeight * pageIndex + offset}px`
    return {
      WebkitTransform: `translate3d(0, ${newOffset}, 0)`,
      transform: `translate3d(0, ${newOffset}, 0)`
    }
  }
  handleMotionRest() {
    this.props.onPage()
  }
  render() {
    const { style, children } = this.props
    return (
      <div style={{ height: '100%' }}>
        <Motion style={style} onRest={this.handleMotionRest.bind(this)}>
          {value =>
            <div
              style={Object.assign({}, wrapperStyle, this.updateStyle(value))}>
              {children}
            </div>}
        </Motion>
      </div>
    )
  }
}

Slider.propTypes = {
  pageIndex: PropTypes.number,
  pageCount: PropTypes.number,
  pageHeight: PropTypes.number,
  onPage: PropTypes.func,
  children: PropTypes.any,
  style: PropTypes.object
}
Slider.defaultProps = {
  pageIndex: 0,
  pageCount: 1,
  pageHeight: window.innerHeight,
  style: {
    offset: 0
  },
  onPage: () => {}
}

export default connectToMouseAndKeyboard(connectToTouchDevice(Slider))

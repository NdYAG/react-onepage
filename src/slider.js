import { Component } from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'

const wrapperStyle = {
  WebkitTransform: 'translate3d(0, 0, 0)',
  transform: 'translate3d(0, 0, 0)',
  height: '100%'
}

export default class Slider extends Component {
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
  pageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  pageHeight: PropTypes.number.isRequired,
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

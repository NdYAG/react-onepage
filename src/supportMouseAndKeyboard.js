import { Component } from 'react'
import { addWheelListener, removeWheelListener } from 'wheel'
import { spring } from 'react-motion'

export default function supportMouseAndKeyboard(Slider) {
  class WrappedSlider extends Component {
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
  WrappedSlider.propTypes = Slider.propTypes
  return WrappedSlider
}

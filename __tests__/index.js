import { Component } from 'react'
import renderer from 'react-test-renderer'
import Slider from '../src'

const events = {}
document.addEventListener = jest.fn((event, callback) => {
  events[event] = callback
})

class App extends Component {
  constructor() {
    super()
    this.state = { pageIndex: 0 }
  }
  handlePage(pageIndex) {
    this.setState({ pageIndex })
  }
  render() {
    return (
      <Slider
        pageIndex={this.state.pageIndex}
        onPage={this.handlePage.bind(this)}>
        <div>0</div>
        <div>1</div>
        <div>2</div>
      </Slider>
    )
  }
}

const slider = <App />

it('renders correctly', () => {
  const tree = renderer.create(slider).toJSON()
  expect(tree).toMatchSnapshot()
})

it('slides to prev/next when hit arrow up/down', done => {
  const component = renderer.create(slider)
  let tree
  events.keydown({ key: 'ArrowDown' })
  setTimeout(() => {
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    events.keydown({ key: 'ArrowUp' })
    setTimeout(() => {
      tree = component.toJSON()
      expect(tree).toMatchSnapshot()
      done()
    }, 2000)
  }, 2000)
})

it('slides to prev/next when mouse wheel forwards/backwards', done => {
  const component = renderer.create(slider)
  let tree
  events.wheel({ deltaY: 20 })
  setTimeout(() => {
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    events.wheel({ deltaY: -20 })
    setTimeout(() => {
      tree = component.toJSON()
      expect(tree).toMatchSnapshot()
      done()
    }, 2000)
  }, 2000)
})

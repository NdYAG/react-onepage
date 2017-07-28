import React from 'react'
import ReactDOM from 'react-dom'
import Slider from '../src'
import styled from 'styled-components'

const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
`

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      pageIndex: 0
    }
  }
  handlePage(pageIndex) {
    this.setState({
      pageIndex
    })
  }
  render() {
    let { pageIndex } = this.state
    const pageCount = 3
    let pages = Array.apply(null, Array(pageCount)).map((_, i) => {
      return (
        <Page>
          {i}
        </Page>
      )
    })
    return (
      <Slider
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageHeight={window.innerHeight}
        onPage={this.handlePage.bind(this)}>
        {pages}
      </Slider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

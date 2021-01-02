import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Slider from '../src'

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
`

class App extends React.Component {
  render() {
    return (
      <Slider pageCount={10}>
        {pageIndex => <Content>{pageIndex}</Content>}
      </Slider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

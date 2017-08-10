# React OnePage Slider

A fullpage slider based on react-motion, with support for desktop and mobile.

![](http://7d9o0k.com1.z0.glb.clouddn.com/onepage-demo.gif)

## Install

```shell
npm install react-onepage
```

## API

* pageIndex: number
* onPage: (nextPageIndex: number) => {}

```js
import React, { Component } from 'react'
import Slider from 'react-onepage'

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
```

## Questions

**1. Set container height**

It's suggested to set `height: 100%` or `height: 100vh` for root and container elements of slider, so that the initial rendering is correct.

**2. I have elements with `position: fixed` inside each page**

Onepage use `transform: translate` for animation, which doesn't coordinate well with `position: fixed`. You could keep those elements as siblings of `<Slider />`.

**3. I have elements with `overflow: scroll` inside each page**

Nested scroller might not be common case, but feel free to add an issue if you need it. Related implementation is under consideration.

**4. Performance**

There is no need to render all pages every time. For forward & backward page navigation, only three pages are required. Empty other pages when they are not visible.

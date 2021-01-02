# React OnePage Slider

A fullpage slider for mobile based on rxjs.

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
  render() {
    return (
      <Slider pageCount={10}>
        {pageIndex => <Content>{pageIndex}</Content>}
      </Slider>
    )
  }
}
```

## Questions

**1. I have elements with `position: fixed` inside each page**

Onepage use `transform: translate` for animation, which doesn't coordinate well with `position: fixed`. You could keep those elements as siblings of `<Slider />`.

**2. I have elements with `overflow: scroll` inside each page**

Nested scroller might not be common case, but feel free to add an issue if you need it. Related implementation is under consideration.

**3. Performance**

There is no need to render all pages every time. For forward & backward page navigation, only three pages are required. Empty other pages when they are not visible based on pageIndex in the children function.

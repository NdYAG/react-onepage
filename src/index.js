import React from 'react'
import { fromEvent, interval, Scheduler } from 'rxjs'
import { concatMap, takeUntil, takeWhile, first, map, withLatestFrom, scan, buffer} from 'rxjs/operators'
import styled from 'styled-components'

import lerp from './lerp'
import stepper from './stepper'

const Page = styled.div`
  width: 100%;
  height: 100%;
`

const wrapperStyle = {
  WebkitTransform: 'translate3d(0, 0, 0)',
  transform: 'translate3d(0, 0, 0)',
  height: '100%',
}

const spring = {
  stiffness: 160,
  damping: 30,
  precision: 1,
}

class Slider extends React.Component {
  state = {
    delta: 0,
  }
  offset = 0
  componentDidMount() {
    const doc = document.documentElement
    const getTouch = (e) => {
      const { clientX: x, clientY: y } = e.changedTouches[0]
      return { x, y }
    }
    const starts = fromEvent(doc, 'touchstart').pipe(map(getTouch))
    const moves = fromEvent(doc, 'touchmove').pipe(map(getTouch))
    const ends = fromEvent(doc, 'touchend').pipe(map(getTouch))

    const drags = starts.pipe(concatMap(dragStartEvent => {
      const animationFrame = interval(0, Scheduler.animationFrame)
      const smoothMoves = animationFrame
            .pipe(withLatestFrom(moves, (_, move) => move))
            .pipe(scan(lerp))
      return smoothMoves.pipe(takeUntil(ends)).pipe(map(dragEvent => ({
        x: dragEvent.x - dragStartEvent.x,
        y: dragEvent.y - dragStartEvent.y,
      })))
    }))
    const drops = starts.pipe(concatMap(dragStartEvent =>
      ends.pipe(first()).pipe(map(dropEvent => ({
        x: dropEvent.x - dragStartEvent.x,
        y: dropEvent.y - dragStartEvent.y,
      })))
    ))

    // drag scroll
    drags.subscribe(pos => {
      this.setState({ delta: pos.y })
    })

    // take last position interpolated from lerp as offset
    drags.pipe(buffer(drops)).subscribe((positions) => {
      this.offset += positions[positions.length - 1]?.y || 0
    })

    // rebounds after drop
    const { pageHeight, pageCount } = this.props
    let dest = 0
    const maxDest = - (pageCount - 1) * pageHeight
    const rebounds = drops.pipe(concatMap(dropEvent => {
      if (Math.abs(dropEvent.y) > pageHeight * 0.2) {
        dest = dropEvent.y < 0 ? dest - pageHeight : dest + pageHeight
        dest = Math.max(maxDest, Math.min(0, dest))
      }
      const animationFrame = interval(0, Scheduler.animationFrame)
      return animationFrame
        .pipe(scan((accu) => {
          const [lastX, lastV] = accu
          return stepper(
            1000/60/1000,
            lastX,
            lastV,
            dest,
            spring.stiffness,
            spring.damping,
            spring.precision,
          )
        }, [this.offset, 0]))
        .pipe(takeWhile((step) => {
          return !(step[0] === dest && step[1] === 0)
        }))
        .pipe(takeUntil(starts))
        .pipe(map(step => step[0]))
    }))
    rebounds.subscribe((nextOffset) => {
      this.setState({ delta: nextOffset - this.offset })
      this.offset = nextOffset
    })
  }
  updateStyle(val) {
    const newOffset = this.offset + val
    return {
      WebkitTransform: `translate3d(0, ${newOffset}px, 0)`,
      transform: `translate3d(0, ${newOffset}px, 0)`
    }
  }
  render() {
    const { pageCount, pageHeight, children } = this.props
    const pages = Array.from({ length: pageCount }, (_, i) => {
      const pageIndex = Math.floor(Math.abs(this.offset) / pageHeight)
      return (
        <Page key={i}>
          {(pageIndex >= i - 1 && pageIndex <= i + 1)? children(i) : null}
        </Page>
      )
    })
    return (
      <div style={{ height: '100%' }}>
        <div style={{ ...wrapperStyle, ...this.updateStyle(this.state.delta) }}>
          {pages}
        </div>
      </div>
    )
  }
}

Slider.defaultProps = {
  pageHeight: window.innerHeight,
}

export default Slider

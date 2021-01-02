const lerp = (start, end) => {
  const dx = end.x - start.x
  const dy = end.y - start.y

  return {
    x: start.x + dx * 0.1,
    y: start.y + dy * 0.1,
  }
}
export default lerp

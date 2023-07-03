class Mouse {
  static clientPosition = {
    x: 0,
    y: 0,
    set(x, y) {
      this.x = x
      this.y = y
    }
  }
  static buttons = {
    0: false,
    1: false,
    2: false,
  }
  static update(event) {
    this.clientPosition.set(event.clientX, event.clientY)
  }
}
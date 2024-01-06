class Mouse {
  static clientPosition = new Vector()
  static buttons = {
    0: false,
    1: false,
    2: false,
  }
  static update(event) {
    this.clientPosition.set(event.clientX, event.clientY)
  }
}
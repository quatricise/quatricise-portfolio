class Mouse {
  static clientPosition = new Vector2()
  static buttons = {
    0: false,
    1: false,
    2: false,
  }
  static update(/** @type MouseEvent */ event) {
    this.clientPosition.set(event.clientX, event.clientY)
  }
}
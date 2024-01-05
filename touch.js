class Touch {
  
  /** Where the current finger is touching. */
  static current = new Vector()
  
  /** Where the current finger began the touch. */
  static start = new Vector()
  
  /** @type Integer */
  static fingerCount = 0

  static triggerElementID = null

  static swipe = {
    length: 0,
    angle: null,
    direction: null,
  }

  /** This function ignores multi-finger touches. */
  static start(event, triggerElementID) {
    this.fingerCount = event.touches.length;
    
		// check that only one finger was used
		if ( this.fingerCount == 1 ) {
			this.start.x = event.touches[0].pageX;
			this.start.y = event.touches[0].pageY;
			this.triggerElementID = triggerElementID;
		} 
    else {
			this.cancel(event);
		}
  }

  static onmove(event) {
		if ( event.touches.length == 1 ) {
			curX = event.touches[0].pageX;
			curY = event.touches[0].pageY;
		} else {
			this.cancel(event);
		}
	}

  static end(event) {
		// check to see if more than one finger was used and that there is an ending coordinate
		if ( fingerCount == 1 && curX != 0 ) {
			// use the Distance Formula to determine the length of the swipe
			swipeLength = Math.round(Math.sqrt(Math.pow(curX - startX,2) + Math.pow(curY - startY,2)));
			// if the user swiped more than the minimum length, perform the appropriate action
			if ( swipeLength >= minLength ) {
				calculateAngle();
				this.determineSwipeDirection();
				processingRoutine();
				touchCancel(event); // reset the variables
			} else {
				touchCancel(event);
			}	
		} else {
			touchCancel(event);
		}
	}

  static calculateAngle() {
		var X = this.start.x - this.current.x;
		var Y = this.current.y - this.start.y;
		var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
		var r = Math.atan2(Y, X); //angle in radians (Cartesian system)
		this.swipeAngle = Math.round(r * 180 / PI); //angle in degrees
		if(this.swipeAngle < 0)
      this.swipeAngle = 360 - Math.abs(this.swipeAngle)
	}

  /** Reset the state back to default values. */
  static cancel() {
    this.fingerCount = 0;
    this.start.set(0)
    this.current.set(0)
    this.swipe.length = 0;
    this.swipe.angle = null;
    this.swipe.direction = null;
    this.triggerElementID = null;
  }

  static determineSwipeDirection() {
		if ( (this.swipe.angle <= 45) && (this.swipe.angle >= 0) ) {
			this.swipe.direction = 'left';
		} else if ( (this.swipe.angle <= 360) && (this.swipe.angle >= 315) ) {
			this.swipe.direction = 'left';
		} else if ( (this.swipe.angle >= 135) && (this.swipe.angle <= 225) ) {
			this.swipe.direction = 'right';
		} else if ( (this.swipe.angle > 45) && (this.swipe.angle < 135) ) {
			this.swipe.direction = 'down';
		} else {
			this.swipe.direction = 'up';
		}
	}
}
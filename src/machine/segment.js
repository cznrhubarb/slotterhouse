const colorMap = {
  attack: 0x883333,
  defense: 0x333388,
  heal: 0x338833,
  negative: 0x444444,
  wild: 0xAA88AA
}

class Segment {
  constructor(game, yOffset, segmentData, wheelOwner) {
    this.game = game;
    this.container = game.add.group();
    this.leftBumper = game.add.image(0, 0, 'leftBumper');
    this.leftBumper.anchor.setTo(0);
    this.centerBumper = game.add.image(this.leftBumper.width - 1, 0, 'center');
    this.centerBumper.anchor.setTo(0);
    this.centerBumper.scale.setTo(segmentData.size + 2, 1);
    this.rightBumper = game.add.image(this.leftBumper.width + segmentData.size - 2, 0, 'rightBumper');
    this.rightBumper.anchor.setTo(0);

    this.icon = game.add.image(this.leftBumper.width + segmentData.size/2, this.leftBumper.height/2, segmentData.name);
    this.icon.blendMode = Phaser.blendModes.SCREEN;
    this.icon.anchor.setTo(0.5);

    this.leftBumper.tint = colorMap[segmentData.type];
    this.centerBumper.tint = colorMap[segmentData.type];
    this.rightBumper.tint = colorMap[segmentData.type];

    this.container.x = 0;
    this.container.y = yOffset;
    this.container.add(this.leftBumper);
    this.container.add(this.centerBumper);
    this.container.add(this.rightBumper);
    this.container.add(this.icon);

    this.totalWidth = segmentData.size + this.leftBumper.width + this.rightBumper.width;
    this.half = { x: this.totalWidth/2, y: this.leftBumper.height/2 };

    this.type = segmentData.type;
    this.name = segmentData.name;
    this.effect = segmentData.effect;
    this.originalData = segmentData;
    this.wheel = wheelOwner;
  }

  move(x, y) {
    this.container.x += x;
    this.container.y += y;
  }

  getWidth() {
    return this.totalWidth;
  }

  boundTo(xBounds) {
    if (this.container.x > this.game.camera.width) {
      this.container.x -= xBounds;
    }
  }

  destroy() {
    this.leftBumper.destroy();
    this.centerBumper.destroy();
    this.rightBumper.destroy();
    this.icon.destroy();
    this.container.destroy();
  }

  getIntersectionDuration(startPoint, deltaVec) {
    const center = { x: this.container.x + this.half.x, y: this.container.y + this.half.y };

    const scaleX = 1/deltaVec.x;
    const scaleY = 1/deltaVec.y;
    const signX = scaleX / Math.abs(scaleX);
    const signY = scaleY / Math.abs(scaleY);
    const nearTimeX = (center.x - signX * this.half.x - startPoint.x) * scaleX;
    const nearTimeY = (center.y - signY * this.half.y - startPoint.y) * scaleY;
    const farTimeX = (center.x + signX * this.half.x - startPoint.x) * scaleX;
    const farTimeY = (center.y + signY * this.half.y - startPoint.y) * scaleY;

    if (nearTimeX > farTimeY || nearTimeY > farTimeX) {
      return 0;
    }

    const nearTime = Math.max(nearTimeX, nearTimeY);
    const farTime = Math.min(farTimeX, farTimeY);

    if (nearTime >= 1 || farTime <= 0) {
      return 0;
    }
	
    return farTime - nearTime;
  }

  convertTo(data, permanent) {
    this.icon.destroy();
    this.icon = game.add.image(this.totalWidth/2, this.leftBumper.height/2, data.name);
    this.icon.blendMode = Phaser.blendModes.SCREEN;
    this.icon.anchor.setTo(0.5);
    this.container.add(this.icon);
    this.leftBumper.tint = colorMap[data.type];
    this.centerBumper.tint = colorMap[data.type];
    this.rightBumper.tint = colorMap[data.type];
    this.type = data.type;
    this.effect = data.effect;

    if (permanent) {
      this.originalData = data;
    }
  }

  convertBack() {
    this.convertTo(this.originalData);
  }

  flash() {
    this.leftBumper.tint = 0xffffff;
    this.centerBumper.tint = 0xffffff;
    this.rightBumper.tint = 0xffffff;

    let flashOn = true;
    let flashInterval = setInterval(() => {
      flashOn = !flashOn;
      this.leftBumper.tint = flashOn ? 0xffffff : colorMap[this.type];
      this.centerBumper.tint = flashOn ? 0xffffff : colorMap[this.type];
      this.rightBumper.tint = flashOn ? 0xffffff : colorMap[this.type];
    }, 200);

    setTimeout(() => {
      clearInterval(flashInterval);
    }, 1100);
  }

  resize(newSize) {
    let prevWidth = this.totalWidth;

    let minSize = this.leftBumper.width + this.rightBumper.width + 1;
    newSize = Math.max(newSize, minSize);
    let centerSize = newSize - this.leftBumper.width - this.rightBumper.width;
    
    this.centerBumper.scale.setTo(centerSize + 2, 1);
    this.rightBumper.x = this.leftBumper.width + centerSize - 2;
    this.icon.x = this.leftBumper.width + centerSize/2;

    this.totalWidth = this.leftBumper.width + this.rightBumper.width + centerSize;

    let widthDelta = this.totalWidth - prevWidth;
    //Move segments in wheel as necessary
    this.wheel.segments.forEach(seg => {
      if (seg.container.x > this.container.x) {
        seg.container.x += widthDelta;
      }
    });
    this.wheel.totalWheelWidth += widthDelta;
  }
}

export default Segment;
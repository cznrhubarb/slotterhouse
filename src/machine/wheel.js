import Segment from './segment.js';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class Wheel {
  constructor(game, yOffset, wheelData) {
    shuffle(wheelData);

    this.segments = [];
    let totalOffset = 0;
    for (let i = 0; i < wheelData.length; i++) {
      let seg = new Segment(game, yOffset, wheelData[i], this);
      seg.move(totalOffset, 0);
      totalOffset += seg.getWidth();
      this.segments.push(seg);
    }

    this.totalWheelWidth = totalOffset;

    this.spinSpeed = 750 + Math.random() * 250;

    this.rampUpMultiplier = 1;
    this.game = game;
    this.yOffset = yOffset;
  }

  stop() {
    this.rampUpMultiplier = 0;
  }

  isStopped() {
    return this.rampUpMultiplier == 0;
  }

  restart() {
    this.rampUpMultiplier = Math.max(this.rampUpMultiplier, 0.01);
  }

  update(elapsed) {
    if (this.rampUpMultiplier < 1 && this.rampUpMultiplier > 0) {
      this.rampUpMultiplier = Math.min(1, this.rampUpMultiplier + elapsed * 2);
    }

    this.segments.forEach(segment => {
      segment.move(this.spinSpeed * elapsed * this.rampUpMultiplier, 0);
      segment.boundTo(this.totalWheelWidth);
    });
  }

  destroy() {
    this.segments.forEach(segment => segment.destroy());
  }

  // TODO: Sometimes this function returns a null segment. That shouldn't
  //  be possible, but that's programming I guess. When it does return
  //  null, the game crashes...
  getBestIntersectingSegment(startPoint, deltaVec) {
    const reduceFunc = (acc, seg) => {
      const calcDist = seg.getIntersectionDuration(startPoint, deltaVec);
      if (calcDist > acc.dist) {
        return { dist: calcDist, segment: seg };
      } else {
        return acc;
      }
    };

    let result = this.segments.reduce(reduceFunc, { dist: 0, segment: null });
    return result.segment;
  }

  insertSegment(segData) {
    let seg = new Segment(this.game, this.yOffset, segData, this);
    this.totalWheelWidth += seg.totalWidth;
    let mostX = 0;
    this.segments.forEach(s => { mostX = Math.max(mostX, s.container.x + s.totalWidth); });
    seg.move(mostX, 0);
    this.segments.push(seg);
    return seg;
  }

  removeSegment(seg) {
    this.segments = this.segments.filter(s => s != seg);
    this.segments.forEach(s => {
      if (s.container.x > seg.container.x) {
        s.move(-seg.totalWidth);
      }
    });
    this.totalWheelWidth -= seg.totalWidth;
    seg.destroy();
  }
}

export default Wheel;
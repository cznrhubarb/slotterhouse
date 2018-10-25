import Wheel from './wheel.js';
import DefaultSegments from '../../data/defaultsegments.js';
import globals from '../globals';

const spaceBetweenWheels = 55;
const wheelTop = 300;
const upBounds = wheelTop + spaceBetweenWheels * 3;
const downBounds = wheelTop;

class Machine {
  constructor(game) {
    this.segmentData = DefaultSegments();

    // Initialize all the settings that are modified by the passive skills
    this.damageMultiplier = 1;
    this.speedMultiplier = 1;
    this.rageBonus = 1;
    this.rageBonusOn = false;
    this.attackComboBonus = 1;
    this.resistChance = 0;
    this.receiveDamageMultiplier = 1;
    this.canBluff = false;
    this.doubleOnRoyal = false;
    this.blocksAlsoHeal = false;
    this.overhealCapMultiplier = 1;
    this.hasSecondChance = false;
    this.wonkySpeed = false;

    this.wonk = 1;
    this.wonkTarget = Math.random() * 1 + 0.75;

    // Insert any active skills (new segments)
    globals.skillsOwned.forEach(skill => {
      if (skill.type == "active") {
        skill.segments.forEach(seg => {
          // TODO: This randomizes segments that should be together =/
          this.segmentData[seg.wheel-1].push(Object.assign({}, seg));
        });
      }
    });

    // Apply any passive skills to the machine state
    globals.skillsOwned.forEach(skill => {
      if (skill.type == "passive") {
        skill.apply(this);
      }
    });

    this.wheels = [
      new Wheel(game, wheelTop, this.segmentData[0]),
      new Wheel(game, wheelTop + spaceBetweenWheels, this.segmentData[1]),
      new Wheel(game, wheelTop + spaceBetweenWheels * 2, this.segmentData[2])
    ];
    
    this.game = game;
    this.slashStartPoint = null;
    this.slashCallback = null;
    this.segmentData = null;
    this.stopped = false;
  }

  update(elapsed) {
    if (this.wonkySpeed) {
      if (this.wonk > this.wonkTarget) {
        this.wonk -= elapsed;
        if (this.wonk <= this.wonkTarget) {
          this.wonkTarget = Math.random() * 0.5 + 0.9;
        }
      } else {
        this.wonk += elapsed;
        if (this.wonk >= this.wonkTarget) {
          this.wonkTarget = Math.random() * 0.5 + 0.9;
        }
      }
    } else {
      this.wonk = 1;
    }
    this.wheels.forEach(wheel => wheel.update(elapsed * this.speedMultiplier * this.wonk));

    const pointer = game.input;
    const pointerIsDown = pointer.pointer1.isDown || pointer.mousePointer.isDown;
    if (this.slashStartPoint) {
      if (!pointerIsDown) {
        this.slashStartPoint = null;
      } else {
        if ((pointer.y >= upBounds && this.slashStartPoint.y <= downBounds) || (pointer.y <= downBounds && this.slashStartPoint.y >= upBounds)) {
          let hitSegments = this.determineSegments(this.slashStartPoint, pointer);
          // TODO / BUG: Sometimes hitSegments has a null in it. This shouldn't happen, but it does.
          //  Best I'm going to do for now is at least make sure it doesn't crash the game...
          if (hitSegments.every(seg => seg != null)) {
            this.drawSlash(this.slashStartPoint, { x: pointer.x, y: pointer.y });          
            this.wheels.forEach(wheel => wheel.stop());
            this.stopped = true;
            hitSegments.forEach(seg => {
              seg.flash();
            });
            if (this.slashCallback) {
              this.slashCallback(hitSegments);
            }
          }
          this.slashStartPoint = null;
        }
      }
    } else if (pointerIsDown && !this.stopped) {
      if (pointer.y >= upBounds || pointer.y <= downBounds) {
        this.slashStartPoint = { x: pointer.x, y: pointer.y };
      }
    }
  }

  restart() {
    this.wheels.forEach(wheel => wheel.restart());
    setTimeout(() => {
      this.stopped = false;
    }, 750);
  }

  destroy() {
    this.wheels.forEach(wheel => wheel.destroy());
  }

  drawSlash(start, end) {
    const vecBetween = { x: end.x - start.x, y: end.y - start.y };
    const vecLen = Math.sqrt(vecBetween.x * vecBetween.x + vecBetween.y * vecBetween.y);

    let splatGroup = this.game.add.group();
    const splatDist = 40;
    let vecNormal = { x: vecBetween.x / vecLen, y: vecBetween.y / vecLen };
    let numSplats = Math.floor(vecLen / splatDist);
    for (let spIdx = 0; spIdx < numSplats; spIdx++) {
      setTimeout(() => {
        let splat = this.game.add.image(
          vecNormal.x * splatDist * (spIdx+0.5) + start.x, 
          vecNormal.y * splatDist * (spIdx+0.5) + start.y, 
          `blood${Math.ceil(Math.random() * 6)}`);
        splat.anchor.setTo(0.5);
        splatGroup.add(splat);
        setTimeout(() => {
          this.game.add.tween(splat).to({alpha: 0}, 250, Phaser.Easing.Default, true);
          setTimeout(() => { splat.destroy(); }, 300);
        }, 750);
      }, 100);
    }

    let slashPiece = this.game.add.image(0, 0, 'slash');
    slashPiece.anchor.setTo(0.5, 0);
    slashPiece.scale.setTo(1, vecLen / slashPiece.height);
    if (end.x > start.x) {
      slashPiece.rotation -= Math.acos(vecBetween.y / vecLen);
    } else {
      slashPiece.rotation += Math.acos(vecBetween.y / vecLen);
    }
    slashPiece.position.setTo(start.x, start.y);

    let mask = this.game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, 1000, 1000);
    let maskStartY = start.y > end.y ? start.y : start.y - 1000;
    let maskEndY = start.y > end.y ? end.y : end.y - 1000;
    mask.position.setTo(0, maskStartY);
    slashPiece.mask = mask;

    this.game.add.tween(mask).to({y: maskEndY}, 75, Phaser.Easing.Default, true);

    setTimeout(() => {
      slashPiece.mask = null;
      mask.destroy();
      this.game.add.tween(slashPiece).to({alpha: 0}, 250, Phaser.Easing.Default, true);
      setTimeout(() => { slashPiece.destroy(); }, 300);
    }, 750);

    setTimeout(() => {
      splatGroup.destroy();
    }, 2000);
  }

  determineSegments(startPoint, endPoint) {
    const deltaVec = { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y };

    return [
      this.wheels[0].getBestIntersectingSegment(startPoint, deltaVec),
      this.wheels[1].getBestIntersectingSegment(startPoint, deltaVec),
      this.wheels[2].getBestIntersectingSegment(startPoint, deltaVec)
    ];
  }
}

export default Machine;
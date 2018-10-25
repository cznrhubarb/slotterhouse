/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    this.myHPText = this.add.text(this.world.centerX - 100, 80, `Options`, {
      font: '24px Trebuchet MS',
      fill: '#77BFA3',
      smoothed: false
    });
  }
}
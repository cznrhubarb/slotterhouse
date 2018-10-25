/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    let bg = this.add.image(this.world.centerX, this.world.centerY, 'mainMenu');
    bg.anchor.setTo(0.5);
  }

  update() {
    if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {
      this.state.start('Narrative');
      //this.state.start('Combat');
      //this.state.start('SkillTree');
    }
  }
}
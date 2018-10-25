/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config';
import globals from '../globals';
import chapters from '../../data/tableofcontents';

export default class extends Phaser.State {
  create() {
    let iframe = document.createElement('iframe');
    iframe.style = `width: ${config.gameWidth}px; height: ${config.gameHeight}px; position: absolute; top: 0px; left: 0px;`;
    iframe.src = chapters[globals.combatIndex];
    document.body.appendChild(iframe);
    iframe.contentWindow.console = console;
    iframe.contentWindow.globals = globals;
    iframe.contentWindow.quit = () => {
      document.body.removeChild(iframe);
      setTimeout(() => {
        window.focus();
        if (globals.combatIndex == 0) {
          this.state.start('Combat');
        } else {
          this.state.start('SkillTree');
        }
      }, 100);
    };
  }

  update() {
    if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {
      if (globals.combatIndex == 0) {
        this.state.start('Combat');
      } else {
        this.state.start('SkillTree');
      }
    }
  }
}
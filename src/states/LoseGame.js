/* globals __DEV__ */
import Phaser from 'phaser';
import globals from '../globals';

export default class extends Phaser.State {
  create() {
    this.titleText = this.add.text(this.world.centerX, this.world.centerY, `Tap again to continue`, {
      font: '24px Trebuchet MS',
      fill: '#880000',
      smoothed: false
    });
    this.titleText.x -= this.titleText.width/2;

    let iframe = document.createElement('iframe');
    iframe.style = `width: ${config.gameWidth}px; height: ${config.gameHeight}px; position: absolute; top: 0px; left: 0px;`;
    iframe.src = 'Lose.html';
    document.body.appendChild(iframe);
    iframe.contentWindow.console = console;
    iframe.contentWindow.globals = globals;
    iframe.contentWindow.quit = () => {
      document.body.removeChild(iframe);
      setTimeout(() => {
        window.focus();
      
        globals.reset();
        this.state.start('MainMenu');
      }, 100);
    };
  }
}
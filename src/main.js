import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import SplashState from './states/Splash';
import MainMenu from './states/MainMenu';
import Narrative from './states/Narrative';
import Combat from './states/Combat';
import SkillTree from './states/SkillTree';
import Options from './states/Options';
import LoseGame from './states/LoseGame';
import EndGame from './states/EndGame';

import config from './config';

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.CANVAS, 'content', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('MainMenu', MainMenu, false);
    this.state.add('Narrative', Narrative, false);
    this.state.add('Combat', Combat, false);
    this.state.add('SkillTree', SkillTree, false);
    this.state.add('Options', Options, false);
    this.state.add('LoseGame', LoseGame, false);
    this.state.add('EndGame', EndGame, false);

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot');
    }
  }
}

window.game = new Game()

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    }
  };

  app.initialize();
}

window.onload = () => {
  // Scroll 1 to hide the ios nav bar
  setTimeout(function () { window.scrollTo(0, 1); }, 1000);
}
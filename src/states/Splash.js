import Phaser from'phaser';
import { centerGameObjects } from'../utils';

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY,'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY,'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    this.load.image('leftBumper','assets/large_left_bumper.png');
    this.load.image('center','assets/large_center.png');
    this.load.image('rightBumper','assets/large_right_bumper.png');
    this.load.image('blank','assets/blank.png');
    this.load.image('slash','assets/slash.png');
    this.load.image('bomb','assets/bomb.png');
    this.load.image('confusion','assets/confusion.png');

    this.load.image('leftArrow','assets/leftarrow.png');
    this.load.image('rightArrow','assets/rightarrow.png');
    this.load.image('detailPane','assets/detailPane.png');
    this.load.image('buyBtn','assets/buybtn.png');

    this.load.image('combatBG','assets/combat_bg1.png');
    this.load.image('combatEnemy','assets/combat_bg2.png');
    this.load.image('mainMenu','assets/title.png');

    this.load.image('blood1','assets/blood1.png');
    this.load.image('blood2','assets/blood2.png');
    this.load.image('blood3','assets/blood3.png');
    this.load.image('blood4','assets/blood4.png');
    this.load.image('blood5','assets/blood5.png');
    this.load.image('blood6','assets/blood6.png');

    this.load.image('Box Cars', 'assets/skills/Box Cars.png');
    this.load.image('Bigger Dice I', 'assets/skills/Bigger Dice I.png');
    this.load.image('Cold Streak', 'assets/skills/Cold Streak.png');
    
    this.load.image('Bet The Horn I', 'assets/skills/Bet The Horn I.png');
    this.load.image('Dice Controller', 'assets/skills/Dice Controller.png');
    
    this.load.image('Let It Ride', 'assets/skills/Let It Ride.png');
    this.load.image('Snake Eyes', 'assets/skills/Snake Eyes.png');
    this.load.image('Bet The Horn II', 'assets/skills/Bet The Horn II.png');
    
    this.load.image('Wild Dice', 'assets/skills/Wild Dice.png');
    this.load.image('Wrong Side Shooter', 'assets/skills/Wrong Side Shooter.png');
    
    this.load.image('Bigger Dice II', 'assets/skills/Bigger Dice II.png');
    this.load.image('Hot Shooter I', 'assets/skills/Hot Shooter I.png');
    this.load.image('Bet The Horn III', 'assets/skills/Bet The Horn III.png');
    
    this.load.image('Bigger Dice III', 'assets/skills/Bigger Dice III.png');
    this.load.image('Hot Shooter II', 'assets/skills/Hot Shooter II.png');
    
    
    this.load.image('Hit', 'assets/skills/Hit.png');
    this.load.image('Bigger Slots I', 'assets/skills/Bigger Slots I.png');
    this.load.image('Max Lines I', "assets/skills/Max Lines I.png");
    
    this.load.image('Drink Service I', 'assets/skills/Drink Service I.png');
    this.load.image('Jackpot', 'assets/skills/Jackpot.png');
    
    this.load.image('Hit after Hit', 'assets/skills/Hit after Hit.png');
    this.load.image('Max Lines II', 'assets/skills/Max Lines II.png');
    this.load.image('Wild Slots', 'assets/skills/Wild Slots.png');
    
    this.load.image('Drink Service II', 'assets/skills/Drink Service II.png');
    this.load.image('Tilt', 'assets/skills/Tilt.png');
    
    this.load.image('One Armed Bandit', 'assets/skills/One Armed Bandit.png');
    this.load.image('Big Hit', 'assets/skills/Big Hit.png');
    this.load.image('Loose Machine', 'assets/skills/Loose Machine.png');
    
    this.load.image('Bonus Round', 'assets/skills/Bonus Round.png');
    this.load.image('Bigger Slots II', 'assets/skills/Bigger Slots II.png');
    
    
    this.load.image('Big Slick', 'assets/skills/Big Slick.png');
    this.load.image('Bigger Cards', 'assets/skills/Bigger Cards.png');
    this.load.image('Bluff', 'assets/skills/Bluff.png');
    
    this.load.image('Cold Deck', 'assets/skills/Cold Deck.png');
    this.load.image('Check it Down', 'assets/skills/Check it Down.png');
    this.load.image('Slow Roll I', 'assets/skills/Slow Roll I.png');
    
    this.load.image('Big Blind Special', 'assets/skills/Big Blind Special.png');
    this.load.image('Cut the Deck I', 'assets/skills/Cut the Deck I.png');
    this.load.image('Wild Card', 'assets/skills/Wild Card.png');
    
    this.load.image('Suck Out I', 'assets/skills/Suck Out I.png');
    this.load.image('Pocket Rockets', 'assets/skills/Pocket Rockets.png');
    this.load.image('Slow Roll II', 'assets/skills/Slow Roll II.png');
    
    this.load.image('Cut the Deck II', 'assets/skills/Cut the Deck II.png');
    this.load.image('Tight as a Rock', 'assets/skills/Tight as a Rock.png');
    this.load.image('Fold', 'assets/skills/Fold.png');
    
    this.load.image('Royal Flush', 'assets/skills/Royal Flush.png');
    this.load.image('Split', 'assets/skills/Split.png');
    this.load.image('Suck Out II', 'assets/skills/Suck Out II.png');
  }

  create () {
    this.state.start('MainMenu');
  }
}

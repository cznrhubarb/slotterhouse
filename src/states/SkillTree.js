/* globals __DEV__ */
import Phaser from 'phaser';
import { ListView } from 'phaser-list-view';
import Segment from '../machine/segment';
import globals from '../globals';
import cardsTree from '../../data/cardstree';
import diceTree from '../../data/dicetree';
import slotsTree from '../../data/slotstree';

const quips = [
  `Let's sweeten the pact, shall we?`,
  //`Time to put your soul where your mouth is.`,
  //`The damned are stacked against you.`,
  //`Will you be the one who bet the farm or bought the farm?`
];

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    const quip = quips[Math.floor(Math.random() * quips.length)];
    let headerText = this.add.text(this.world.centerX, 20, quip, {
      font: '16px Trebuchet MS',
      fill: '#77BFA3',
      smoothed: false
    });
    headerText.x -= headerText.width/2;

    globals.maxHealth += 5;
    globals.currentHealth = globals.maxHealth;

    this.healthText = this.game.add.text(this.world.centerX, 70, `Blood Money: ${globals.currentHealth}/${globals.maxHealth}`, {
      font: '26px Trebuchet MS',
      fill: '#77BFA3',
      smoothed: false
    });
    this.healthText.x -= this.healthText.width/2;

    this.tweening = false;

    this.pages = [
      this.createPage("Dice", diceTree),
      this.createPage("Cards", cardsTree),
      this.createPage("Slots", slotsTree)
    ];

    this.pages[0].x = globals.lastSkillTreePage * -this.world.width;
    this.pages[1].x = globals.lastSkillTreePage * -this.world.width + this.world.width;
    this.pages[2].x = globals.lastSkillTreePage * -this.world.width + this.world.width * 2;

    this.createDetailsPane();

    this.createNavigation();
  }

  createPage(name, data) {
    let page = this.game.add.group();
    // let pageText = this.game.add.text(this.world.centerX, 70, name, {
    //   font: '28px Trebuchet MS',
    //   fill: '#77BFA3',
    //   smoothed: false
    // });
    // pageText.x -= pageText.width/2;
    // page.add(pageText);

    const bounds = new Phaser.Rectangle(0, 120, this.world.width, this.world.height - (80 + 185 + 15));
    const options = { direction: 'y', searchForClicks: true };
    const listView = new ListView(this.game, page, bounds, options);

    let y = 30;
    data.forEach((strata, depth) => {
      let x = this.world.width/4;
      strata.forEach(skill => {
        let icon = this.game.add.image(x, y, skill.name);
        icon.anchor.setTo(0.5);
        x += this.world.width/4;
        listView.add(icon);

        icon.inputEnabled = true;
        icon.events.onInputDown.add(() => this.selectDetailItem(skill, name, depth), this);
      });

      y += 80;
    });

    return page;
  }

  createDetailsPane() {
    this.game.add.image(0, 350, 'detailPane');
    
    let skillTitleText = this.game.add.text(this.world.centerX, 355, '', {
      font: '24px Trebuchet MS',
      fill: '#000000',
      fontWeight: 'bold',
      smoothed: false
    });
    skillTitleText.x -= skillTitleText.width/2;
    
    let skillDescriptionText = this.game.add.text(this.world.centerX, 390, '', {
      font: '14px Trebuchet MS',
      fill: '#000000',
      wordWrap: true,
      wordWrapWidth: this.world.width * 0.9,
      align: 'center',
      smoothed: false
    });
    skillDescriptionText.x -= skillDescriptionText.width/2;

    let skillCostText = this.game.add.text(8, 500, '', {
      font: '20px Trebuchet MS',
      fill: '#CC0000',
      fontWeight: 'bold',
      smoothed: false
    });

    let btn = this.game.add.image(this.world.width, this.world.height, 'buyBtn');
    btn.anchor.setTo(1, 1);
    btn.inputEnabled = true;
    btn.events.onInputDown.add(() => {this.buySelectedSkill()}, this);
    btn.visible = false;
    
    this.selectedSkillCost = skillCostText;
    this.selectedSkillTitle = skillTitleText;
    this.selectedSkillDescription = skillDescriptionText;
    this.selectedSkillSegments = [];
    this.buyButton = btn;
  }

  createNavigation() {
    // left arrow
    let icon = this.game.add.image(0, this.world.height/2, 'leftArrow');
    icon.anchor.setTo(0, 0.5);

    icon.inputEnabled = true;
    icon.events.onInputDown.add(() => {
      if (this.tweening == false) {
        this.tweening = true;
        setTimeout(() => {this.tweening = false}, 375);
        this.pages.forEach(page => {
          if (page.x < 0) {
            page.x += this.pages.length * this.world.width;
          }
          this.game.add.tween(page).to({x: page.x-this.world.width}, 350, Phaser.Easing.Quadratic.Out, true);
        });
        globals.lastSkillTreePage = (globals.lastSkillTreePage + 1) % 3;
      }
    }, this);
    // right arrow
    icon = this.game.add.image(this.world.width, this.world.height/2, 'rightArrow');
    icon.anchor.setTo(1, 0.5);

    icon.inputEnabled = true;
    icon.events.onInputDown.add(() => {
      if (this.tweening == false) {
        this.tweening = true;
        setTimeout(() => {this.tweening = false}, 375);
        this.pages.forEach(page => {
          if (page.x > this.world.width) {
            page.x -= this.pages.length * this.world.width;
          }
          this.game.add.tween(page).to({x: page.x+this.world.width}, 350, Phaser.Easing.Quadratic.Out, true);
        });
        globals.lastSkillTreePage = (globals.lastSkillTreePage - 1) % 3;
      }
    }, this);
    // go to combat
    icon = this.game.add.image(this.world.width, this.world.height/4, 'attack');
    icon.anchor.setTo(1, 0.5);

    icon.inputEnabled = true;
    icon.events.onInputDown.add(() => {this.state.start('Combat')}, this);
  }

  selectDetailItem(skill, pageName, depth) {
    let ownedAlready = globals.skillsOwned.find(s => s == skill) != undefined;

    this.selectedSkill = skill;
    this.selectedSkillTree = pageName;
    this.selectedSkillDepth = depth;
    this.selectedSkillTitle.text = skill.name;
    if (ownedAlready) {
      this.selectedSkillTitle.text += ' ✓';
    }
    this.selectedSkillTitle.x = this.world.centerX - this.selectedSkillTitle.width/2;
    this.selectedSkillDescription.text = skill.desc;
    this.selectedSkillDescription.x = this.world.centerX - this.selectedSkillDescription.width/2;

    this.selectedSkillSegments.forEach(seg => seg.destroy());
    this.selectedSkillSegments = [];

    if (skill.segments) {
      let horzOffset = 0;
      skill.segments.forEach(segData => {
        let exampleSeg = new Segment(this.game, 480, segData)
        this.selectedSkillSegments.push(exampleSeg);
        horzOffset += exampleSeg.totalWidth;
      });

      horzOffset /= 2;
      this.selectedSkillSegments.forEach(seg => {
        seg.container.x = this.world.centerX - horzOffset;
        horzOffset -= seg.totalWidth;
      });
    }

    let canAfford = true;
    if (skill.prevSkill) {
      canAfford = globals.skillsOwned.find(s => s.name == skill.prevSkill) != undefined;
    }

    let currentDepth = 0;
    switch (pageName) {
      case 'Cards':
      currentDepth = globals.cardDepth;
      break;
      case 'Dice':
      currentDepth = globals.diceDepth;
      break;
      case 'Slots':
      currentDepth = globals.slotDepth;
      break;
    }
    canAfford = canAfford && currentDepth >= depth;

    canAfford = canAfford && skill.cost < globals.currentHealth;

    canAfford = canAfford && !ownedAlready;

    this.selectedSkillCost.text = '';
    if (canAfford) { this.selectedSkillCost.text = `${skill.cost} hp`; }
    this.buyButton.visible = canAfford;
  }

  buySelectedSkill() {
    globals.currentHealth -= this.selectedSkill.cost;
    globals.skillsOwned.push(this.selectedSkill);

    if (this.selectedSkill.name == "Loose Machine") {
      globals.maxHealth += 20;
    }

    this.healthText.text = `Health: ${globals.currentHealth}/${globals.maxHealth}`;
    this.healthText.x = this.world.centerX - this.healthText.width/2;

    //increase the depth
    switch (this.selectedSkillTree) {
      case 'Cards':
      globals.cardDepth = Math.max(globals.cardDepth, this.selectedSkillDepth+1);
      break;
      case 'Dice':
      globals.diceDepth = Math.max(globals.diceDepth, this.selectedSkillDepth+1);
      break;
      case 'Slots':
      globals.slotDepth = Math.max(globals.slotDepth, this.selectedSkillDepth+1);
      break;
    }

    this.selectDetailItem(this.selectedSkill, this.selectedSkillTree, this.selectedSkillDepth);
  }
}
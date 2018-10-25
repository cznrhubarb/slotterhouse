/* globals __DEV__ */
import Phaser from 'phaser'
import Machine from '../machine/machine.js'
import globals from '../globals';
import combatScripts, { GenerateRandomEnemy } from '../../data/combatscripts';
import { Behaviors } from '../../data/enemyBehaviors';
import chapters from '../../data/tableofcontents';

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    this.bgImage = this.add.image(0, 0, 'combatBG');
    this.bgEnemy = this.add.image(0, 0, 'combatEnemy');
    this.bgEnemy.anchor.setTo(0.5, 0.25);
    this.bgEnemy.x = this.bgEnemy.width/2;
    this.bgEnemy.y = this.bgEnemy.height/4;
    this.enemyTween = this.add.tween(this.bgEnemy.scale);
    this.enemyTween.to({x: 1.75, y: 1.75}, 100, Phaser.Easing.BackInOut);
    this.enemyTweenOut = this.add.tween(this.bgEnemy.scale);
    this.enemyTweenOut.to({x: 1, y: 1}, 400, Phaser.Easing.Linear.None);

    this.enemyAiIndex = 0;
    if (globals.combatIndex < combatScripts.length) {
      this.enemy = combatScripts[globals.combatIndex];
    } else {
      this.enemy = GenerateRandomEnemy(globals.combatIndex);
    }

    this.playerHealth = globals.currentHealth;
    this.enemyHealth = this.enemy.health;
    this.myHPText = this.add.text(this.world.centerX - 100, this.world.height - 30, `Blood: ${this.playerHealth}`, {
      font: '24px Trebuchet MS',
      fill: '#77BFA3',
      smoothed: false
    });
    this.myHPText.x -= this.myHPText.width/2;
    this.myDefenseText = this.add.text(this.world.centerX - 100, this.world.height - 60, ``, {
      font: '20px Trebuchet MS',
      fill: '#7777ff',
      smoothed: false
    });
    this.myDefenseText.x = this.myHPText.x;

    this.yourHPText = this.add.text(this.world.centerX + 80, this.world.height - 30, `Enemy: ${this.enemyHealth}`, {
      font: '24px Trebuchet MS',
      fill: '#77BFA3',
      smoothed: false
    });
    this.yourHPText.x -= this.yourHPText.width/2;
    this.yourDefenseText = this.add.text(this.world.centerX + 100, this.world.height - 60, ``, {
      font: '20px Trebuchet MS',
      fill: '#7777ff',
      smoothed: false
    });
    this.yourDefenseText.x = this.yourHPText.x;

    this.machine = new Machine(this.game);
    this.machine.slashCallback = this.onSlash.bind(this);

    this.enemyStats = { damage: 0, heal: 0, defend: 0, selfDamage: 0, tempDefend: 0, delay: 0 };
    this.playerStats = { damage: 0, heal: 0, defend: 0, selfDamage: 0, tempDefend: 0, bonusMoney: 0 };
    this.recurringEffects = [];
    this.delayedEffects = [];
  }

  update(game) {
    this.machine.update(game.time.physicsElapsed);
  }

  enemyAttack() {
    if (this.enemyStats.delay > 0) {
      this.enemyStats.delay--;
    } else {
      this.enemyTween.onComplete.add(() => {
        this.enemyTweenOut.start();
      }, this);
      this.enemyTween.start();

      let attackName = this.enemy.ai[this.enemyAiIndex++];
      Behaviors[attackName](this);
      if (this.enemyAiIndex >= this.enemy.ai.length) {
        this.enemyAiIndex = 0;
      }

      this.generateTextEffect(this.world.centerX, this.world.centerY - 20, attackName, '#000000', 36, 6);

      // Apply enemy turn effects
      let damage = Math.max(0, this.enemyStats.damage * this.machine.receiveDamageMultiplier - (this.playerStats.defend + this.playerStats.tempDefend));
      let defended = Math.min(this.playerStats.defend + this.playerStats.tempDefend, this.enemyStats.damage * this.machine.receiveDamageMultiplier);
      let heal = this.enemyStats.heal;
      let selfDamage = Math.min(this.enemyStats.selfDamage, this.enemyHealth + heal);

      damage = Math.ceil(damage);
      defended = Math.ceil(defended);
      heal = Math.ceil(heal);
      selfDamage = Math.ceil(selfDamage);

      this.enemyHealth = Math.max(this.enemyHealth + heal - selfDamage, this.enemyHealth);

      if (damage >= this.playerHealth && this.machine.hasSecondChance) {
        this.machine.hasSecondChance = false;
        damage = 0;
        // TODO: Visual effect for second chance redemption
      }
      this.playerHealth = Math.max(this.playerHealth - damage, 0);

      // TODO: Slight bug if player has tempDefend, which we should deduct from first
      this.playerStats.defend -= defended;
      this.enemyStats = Object.assign(this.enemyStats, { damage: 0, heal: 0, selfDamage: 0, tempDefend: 0 });
      this.enemyStats.defend = Math.floor(this.enemyStats.defend);
      this.enemyStats.lastDamageTaken = damage;

      this.updateLabels();

      if (damage > 0) { this.generateTextEffect(this.world.centerX - 100 + Math.random() * 120 - 60, this.world.height - 40, damage, '#ff0000'); }
      if (defended > 0) { this.generateTextEffect(this.world.centerX - 100 + Math.random() * 120 - 60, this.world.height - 40, defended, '#0000ff'); }
      if (heal > 0) { this.generateTextEffect(this.world.centerX + 100 + Math.random() * 120 - 60, this.world.height - 40, heal, '#00ff00'); }
      if (selfDamage > 0) { this.generateTextEffect(this.world.centerX + 100 + Math.random() * 120 - 60, this.world.height - 40, selfDamage, '#ff0000'); }
    }
  }

  onSlash(segments) {
    let comboCount = segments.reduce((acc, cur) => {
      if (cur.type == "wild") {
        // + 1 to all
        acc.attack += 1;
        acc.defense += 1;
        acc.heal += 1;
        acc.negative += 1;
      } else {
        acc[cur.type] += 1;
      }
      return acc;
    }, { attack: -1, defense: -1, heal: -1, negative: -1 });

    if (this.machine.canBluff) {
      for (let prop in comboCount) {
        if (comboCount[prop] == 2) {
          comboCount[prop] = 3;
        }
      }
    }
    if (this.machine.doubleOnRoyal) {
      for (let prop in comboCount) {
        if (comboCount[prop] == 3) {
          comboCount[prop] = 6;
        }
      }
    }
    if (this.machine.rageBonusOn) {
      if (comboCount.attack >= 0) {
        this.machine.rageBonus += 0.1;
      } else {
        this.machine.rageBonus = 0.9;
      }
    }
    comboCount.attack *= this.machine.attackComboBonus;

    // Apply player turn effects
    segments.forEach(seg => {
      // Wild cards just take the highest comboCount
      let combo = comboCount[seg.type];
      if (!combo) {
        combo = Math.max(comboCount.attack, comboCount.defense, comboCount.heal);
      }
      seg.effect(this, combo);
    });

    this.applyStatBundleToEnemy();

    if (!this.checkEndCombatConditions()) {
      let timeToEnemyAttack = 2500;
      let timeToMachineRestart = 1500;
      if (this.recurringEffects.length > 0 || this.delayedEffects.length > 0) {
        setTimeout(() => {
          this.recurringEffects.forEach(reffect => {
            reffect.turns--;
            reffect.effect();
          });
          
          this.delayedEffects.forEach(deffect => {
            deffect.turns--;
            if (deffect.turns == 0) {
              deffect.effect();
            }
          });

          this.recurringEffects = this.recurringEffects.filter(reffect => reffect.turns > 0);
          this.delayedEffects = this.delayedEffects.filter(deffect => deffect.turns > 0);

          timeToEnemyAttack += 2000;
          timeToMachineRestart += 2000;

          this.applyStatBundleToEnemy();
        }, 1500);
      }

      // Check again in case a recurring or delayed effect triggered an end game condition
      if (!this.checkEndCombatConditions()) {
        setTimeout(() => {
          this.enemyAttack();
          if (!this.checkEndCombatConditions()) {
            setTimeout(() => {
              this.machine.restart();
            }, timeToMachineRestart);
          }
        }, timeToEnemyAttack);
      }
    }
  }

  applyStatBundleToEnemy() {
    let damage = Math.max(0, this.playerStats.damage * this.machine.damageMultiplier * this.machine.rageBonus - (this.enemyStats.defend + this.enemyStats.tempDefend));
    let defended = Math.min(this.enemyStats.defend + this.enemyStats.tempDefend, this.playerStats.damage * this.machine.damageMultiplier);
    let heal = this.playerStats.heal;
    let selfDamage = Math.min(this.playerStats.selfDamage, this.playerHealth + heal);
    
    damage = Math.ceil(damage);
    defended = Math.ceil(defended);
    heal = Math.ceil(heal);
    selfDamage = Math.ceil(selfDamage);

    // TODO: Slight bug if enemy has tempDefend, which we should deduct from first
    this.enemyStats.defend -= defended;
    this.playerHealth = Math.min(this.playerHealth + heal - selfDamage, globals.maxHealth * this.machine.overhealCapMultiplier);
    this.playerHealth = Math.max(0, this.playerHealth);
    this.enemyHealth = Math.max(this.enemyHealth - damage, 0);

    // Reset the stats that aren't persistent (money and defend)
    this.playerStats = Object.assign(this.playerStats, { damage: 0, heal: 0, selfDamage: 0, tempDefend: 0 });
    this.playerStats.defend = Math.floor(this.playerStats.defend);
    this.updateLabels();
    
    // Display player turn effects on screen
    if (damage > 0) { this.generateTextEffect(this.world.centerX + 100 + Math.random() * 120 - 60, this.world.height - 40, damage, '#ff0000'); }
    if (defended > 0) { this.generateTextEffect(this.world.centerX + 100 + Math.random() * 120 - 60, this.world.height - 40, defended, '#0000ff'); }
    if (heal > 0) { this.generateTextEffect(this.world.centerX - 100 + Math.random() * 120 - 60, this.world.height - 40, heal, '#00ff00'); }
    if (selfDamage > 0) { this.generateTextEffect(this.world.centerX - 100 + Math.random() * 120 - 60, this.world.height - 40, selfDamage, '#ff0000'); }
  }

  generateTextEffect(x, y, text, color, size, thickness) {
    let label = this.add.text(x, y, text, {
      font: `${size || 26}px Trebuchet MS`,
      fill: color,
      smoothed: false,
      stroke: '#ffffff',
      strokeThickness: thickness
    });
    label.x -= label.width/2;

    this.add.tween(label).to({alpha: 0.5}, 1500, Phaser.Easing.Linear.None, true);
    this.add.tween(label).to({y: y - 100}, 1500, Phaser.Easing.Quadratic.Out, true)
      .onComplete.add(() => setTimeout(() => label.destroy(), 10));
  }

  checkEndCombatConditions() {
    if (this.enemyHealth <= 0) {
      // TODO: Show something visual to show the end of the round
      setTimeout(() => {
        globals.combatIndex++;
        if (globals.combatIndex < chapters.length) {
          this.state.start('Narrative');
        } else {
          this.state.start('SkillTree');
        }
      }, 2000);

      return true;
    }

    if (this.playerHealth <= 0) {
      setTimeout(() => {
        this.state.start('LoseGame');
      }, 2000);

      return true;
    }

    return false;
  }

  updateLabels() {
    this.myHPText.text = `Blood: ${this.playerHealth}`;
    this.yourHPText.text = `Enemy: ${this.enemyHealth}`;
    
    if (this.playerStats.defend + this.playerStats.tempDefend > 0) {
      this.myDefenseText.text = `Defense: ${this.playerStats.defend + this.playerStats.tempDefend}`;
    } else {
      this.myDefenseText.text = '';
    }
    
    if (this.enemyStats.defend + this.enemyStats.tempDefend > 0) {
      this.yourDefenseText.text = `Defense: ${this.enemyStats.defend + this.enemyStats.tempDefend}`;
    } else {
      this.yourDefenseText.text = '';
    }
  }
}
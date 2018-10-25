export default {
  combatIndex: 0,
  lastSkillTreePage: 0,
  diceDepth: 0,
  cardDepth: 0,
  slotDepth: 0,
  skillsOwned: [],
  maxHealth: 100,
  currentHealth: 100,

  reset: function() {
    this.combatIndex = 0;
    this.lastSkillTreePage = 0;
    this.diceDepth = 0;
    this.cardDepth = 0;
    this.slotDepth = 0;
    this.skillsOwned = [];
    this.maxHealth = 100;
    this.currentHealth = 100;
  }
};
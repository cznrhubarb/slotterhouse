import globals from '../src/globals';

export function hitFunc(gameState, combo) {
  gameState.playerStats.heal += 2 + combo * 0.5;
}

function drinkServiceFunc(gameState, combo) {
  gameState.recurringEffects.push({ turns: 3, effect: () => {
      gameState.playerStats.heal += 2 + combo;
    }
  });
}

function drinkServiceTwoFunc(gameState, combo) {
  gameState.recurringEffects.push({ turns: 3, effect: () => {
      gameState.playerStats.heal += 3 + combo * 1.5;
    }
  });
}

function oneArmedBanditFunc(gameState, combo) {
  let possibleSegs = [];
  let convertToData = { name: "heal", type: "heal", effect: hitFunc };
  gameState.machine.wheels.forEach(wheel => {
    wheel.segments.forEach(seg => {
      if (seg.name == "blank") {
        possibleSegs.push(seg);
      }
    });
  });

  if (possibleSegs.length > 0) {
    let randSeg = possibleSegs[Math.floor(Math.random() * possibleSegs.length)];
    randSeg.convertTo(convertToData);
  }
}

function tiltFunc(gameState, combo) {
  // TODO: Turn off all temporary status effects
  gameState.playerStats.heal += 2 + combo * 0.5;
}

function bigHitFunc(gameState, combo) {
  gameState.playerStats.heal += 3 + combo;
}

function jackpotFunc(gameState, combo) {
  gameState.playerStats.bonusMoney += 10;
}

function biggerSlotsFunc(machine) {
  machine.segmentData.forEach(wheel => {
    wheel.forEach(seg => {
      if (seg.type == "heal") {
        seg.size += 10;
      }
    });
  });
}

function biggerSlotsTwoFunc(machine) {
  machine.segmentData.forEach(wheel => {
    wheel.forEach(seg => {
      if (seg.type == "heal") {
        seg.size += 40;
      }
    });
  });
}

function looseMachineFunc(machine) {
  // Don't want to increase max health EVERY TIME combat is started
  //  So this is actually added on PURCHASE in SkillTree.js
  //  It's hacky, whatever.
  //globals.maxHealth += 20;
}

function maxLinesFunc(machine) {
  machine.overhealCapMultiplier = 1.15;
}

function maxLinesTwoFunc(machine) {
  machine.overhealCapMultiplier = 1.4;
}

function bonusRoundFunc(machine) {
  machine.hasSecondChance = true;
}

export default [
  // Each array is a strata. You must have at least one skill from a strata in order to purchase from the next.
  [
    // Name and description are displayed to player
    // PrevSkill is the Name of the previous skill needed unlocked in order to purchase this one
    //    Can be omitted if no previous skill is needed
    // Type is 'active' or 'passive'
    // If the skill is ACTIVE, Segments is the list of new segment data to be added
    // If the skill is PASSIVE, Apply is a function that should be applied to the machine state
    { name: "Hit", desc: "Additional basic heal segment. (Wheel 2)", cost: 5, type:"active", segments: [{ name: "Hit", type: "heal", size: 80, wheel: 2, effect: hitFunc }] },
    { name: "Bigger Slots I", desc: "Increases the size of all heal segments slightly.", cost: 5, type: "passive", apply: biggerSlotsFunc },
    { name: "Max Lines I", desc: "You can overheal to 115% of your max health.", cost: 5, type: "passive", apply: maxLinesFunc },
  ],
  [
    { name: "Drink Service I", desc: "Restore a small amount of health at the start of your next 3 turns. (Wheel 2)", cost: 8, type:"active", segments: [{ name: "Drink Service I", type: "heal", size: 60, wheel: 2, effect: drinkServiceFunc }] },
    { name: "Jackpot", desc: "Grants bonus blood money to buy skills after combat. (Wheel 3)", cost: 8, type:"active", segments: [{ name: "Jackpot", type: "heal", size: 70, wheel: 3, effect: jackpotFunc }] },
    { name: "Bigger Slots I", desc: "Increases the size of all heal segments slightly.", cost: 8, type: "passive", apply: biggerSlotsFunc },
  ],
  [
    { name: "Hit after Hit", desc: "Three additional small basic heal segments. (Wheel 1/2/3)", cost: 11, type:"active", 
      segments: [{ name: "Hit", type: "heal", size: 40, wheel: 1, effect: hitFunc }, { name: "Hit", type: "heal", size: 40, wheel: 2, effect: hitFunc }, { name: "Hit", type: "heal", size: 40, wheel: 3, effect: hitFunc }] },
    { name: "Max Lines II", prevSkill: "Max Lines I", desc: "You can overheal to 140% of your max health.", cost: 11, type: "passive", apply: maxLinesTwoFunc },
    { name: "Wild Slots", desc: "Adds an heal segment that will count towards any type of combo. (Wheel 3)", cost: 11, type:"active", segments: [{ name: "Wild Slots", type: "heal", size: 80, wheel: 3, effect: hitFunc }] },
  ],
  [
    { name: "Drink Service II", prevSkill: "Drink Service I", desc: "Restore a moderate amount of health at the start of your next 3 turns. (Wheel 3)", cost: 15, type:"active", segments: [{ name: "Drink Service II", type: "heal", size: 80, wheel: 3, effect: drinkServiceTwoFunc }] },
    { name: "Jackpot", desc: "Grants bonus blood money to buy skills after combat. (Wheel 1)", cost: 15, type:"active", segments: [{ name: "Jackpot", type: "heal", size: 70, wheel: 1, effect: jackpotFunc }] },
    { name: "Tilt", desc: "Recover from all negative status effects and heal a small amount. (Wheel 3)", cost: 15, type:"active", segments: [{ name: "Tilt", type: "heal", size: 100, wheel: 3, effect: tiltFunc }] },
  ],
  [
    { name: "One Armed Bandit", desc: "Turn a random blank segment into a heal segment. (Wheel 3)", cost: 20, type:"active", segments: [{ name: "One Armed Bandit", type: "heal", size: 90, wheel: 3, effect: oneArmedBanditFunc }] },
    { name: "Big Hit", prevSkill: "Hit", desc: "Adds a large, stronger than normal heal segment. (Wheel 2)", cost: 20, type:"active", segments: [{ name: "Big Hit", type: "heal", size: 120, wheel: 1, effect: bigHitFunc }] },
    { name: "Loose Machine", desc: "Increase your max health.", cost: 20, type: "passive", apply: looseMachineFunc },
  ],
  [
    { name: "Bonus Round", desc: "Once per combat, prevent an attack from an enemy that would kill you.", cost: 25, type: "passive", apply: bonusRoundFunc },
    { name: "Bigger Slots II", prevSkill: "Bigger Slots I", desc: "Increases the size of all heal segments by a large amount.", cost: 25, type: "passive", apply: biggerSlotsTwoFunc },
    { name: "Loose Machine", desc: "Increase your max health.", cost: 25, type: "passive", apply: looseMachineFunc },
  ],
];
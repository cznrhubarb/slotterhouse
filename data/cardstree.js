export function bigSlickFunc(gameState, combo) {
  gameState.playerStats.defend += 1 + combo * 0.5;
  if (gameState.machine.blocksAlsoHeal) {
    gameState.playerStats.heal += 2 + combo * 0.5;
  }
}

function foldFunc(gameState, combo) {
  gameState.playerStats.tempDefend = 9999;
}

function pocketRocketsFunc(gameState, combo) {
  gameState.playerStats.defend += 2 + combo;
  if (gameState.machine.blocksAlsoHeal) {
    gameState.playerStats.heal += 3 + combo;
  }
}

function checkDownFunc(gameState, combo) {
  gameState.enemyStats.delay += 1;
}

function bigBlindSpecialFunc(gameState, combo) {
  gameState.playerStats.damage += gameState.playerStats.defend * (combo * 0.5 + 1);
}

function coldDeckFunc(gameState, combo) {
  gameState.recurringEffects.push({ turns: 3, effect: () => {
      gameState.playerStats.defense += 1 + combo;
      if (gameState.machine.blocksAlsoHeal) {
        gameState.playerStats.heal += 1 + combo;
      }
    }
  });
}

function biggerCardsFunc(machine) {
  machine.segmentData.forEach(wheel => {
    wheel.forEach(seg => {
      if (seg.type == "defense") {
        seg.size += 10;
      }
    });
  });
}

function slowRollFunc(machine) {
  machine.speedMultiplier -= 0.2;
}

function suckOutFunc(machine) {
  machine.resistChance += 0.2;
}

function suckOutTwoFunc(machine) {  
  machine.resistChance += 0.4;
}

function tightRockFunc(machine) {
  machine.receiveDamageMultiplier -= 0.1;
}

function cutDeckFunc(machine) {
  let idx = machine.segmentData[0].findIndex(seg => seg.name == "blank");
  machine.segmentData[0].splice(idx, 1);
  idx = machine.segmentData[1].findIndex(seg => seg.name == "blank");
  machine.segmentData[1].splice(idx, 1);
}

function cutDeckTwoFunc(machine) {
  let idx = machine.segmentData[0].findIndex(seg => seg.name == "blank");
  machine.segmentData[0].splice(idx, 1);
  idx = machine.segmentData[1].findIndex(seg => seg.name == "blank");
  machine.segmentData[1].splice(idx, 1);
  idx = machine.segmentData[2].findIndex(seg => seg.name == "blank");
  machine.segmentData[2].splice(idx, 1);
}

function splitFunc(machine) {
  machine.blocksAlsoHeal = true;
}

function royalFlushFunc(machine) {
  machine.doubleOnRoyal = true;
}

function bluffFunc(machine) {
  machine.canBluff = true;
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
    { name: "Big Slick", desc: "Additional basic defense segment. (Wheel 1)", cost: 5, type:"active", segments: [{ name: "Big Slick", type: "defense", size: 80, wheel: 1, effect: bigSlickFunc }] },
    { name: "Bigger Cards", desc: "Increases the size of all defense segments slightly.", cost: 5, type: "passive", apply: biggerCardsFunc },
    { name: "Bluff", desc: "A spin with 2 of a type and one negative block counts as a 3 combo.", cost: 5, type: "passive", apply: bluffFunc },
  ],
  [
    { name: "Cold Deck", desc: "Generate some defense automatically for 3 turns. (Wheel 2)", cost: 8, type:"active", segments: [{ name: "Cold Deck", type: "defense", size: 80, wheel: 2, effect: coldDeckFunc }] },
    { name: "Check it Down", desc: "Delay the enemy from taking their turn. (Wheel 2)", cost: 8, type: "active", segments: [{ name: "Check it Down", type: "defense", size: 60, wheel: 2, effect: checkDownFunc }] },
    { name: "Slow Roll I", desc: "Slightly reduce the speed of your wheels.", cost: 8, type: "passive", apply: slowRollFunc },
  ],
  [
    { name: "Big Blind Special", desc: "Deal damage based on the amount of defense you have. (Wheel 2)", cost: 11, type:"active", segments: [{ name: "Big Blind Special", type: "defense", size: 80, wheel: 2, effect: bigBlindSpecialFunc }] },
    { name: "Cut the Deck I", desc: "Remove two blank segments. (Wheel 1/2)", cost: 11, type: "passive", apply: cutDeckFunc },
    { name: "Wild Card", desc: "Adds an defense segment that will count towards any type of combo. (Wheel 2)", cost: 11, type:"active", segments: [{ name: "Wild Card", type: "wild", size: 80, wheel: 2, effect: bigSlickFunc }] },
  ],
  [
    { name: "Suck Out I", desc: "Gives you a chance to ignore negative status effects being applied.", cost: 15, type: "passive", apply: suckOutFunc },
    { name: "Pocket Rockets", prevSkill: "Big Slick", desc: "Adds a large, stronger than normal defense segment. (Wheel 3)", cost: 15, type:"active", segments: [{ name: "Pocket Rockets", type: "defense", size: 120, wheel: 3, effect: pocketRocketsFunc }] },
    { name: "Slow Roll II", prevSkill: "Slow Roll I", desc: "Moderately reduce the speed of your wheels.", cost: 15, type: "passive", apply: slowRollFunc },
  ],
  [
    { name: "Cut the Deck II", desc: "Remove three blank segments. (Wheel 1/2/3)", cost: 20, type: "passive", apply: cutDeckTwoFunc },
    { name: "Tight as a Rock", desc: "Passively reduce all damage taken.", cost: 20, type: "passive", apply: tightRockFunc },
    { name: "Fold", desc: "Block all damage from the next enemy attack. (Wheel 2)", cost: 20, type:"active", segments: [{ name: "Fold", type: "defense", size: 70, wheel: 2, effect: foldFunc }] },
  ],
  [
    { name: "Royal Flush", desc: "3 segment combos of any type have their effect doubled.", cost: 25, type: "passive", apply: royalFlushFunc },
    { name: "Split", desc: "All heal segments grant a small amount of block as well.", cost: 25, type: "passive", apply: splitFunc },
    { name: "Suck Out II", prevSkill: "Suck Out I", desc: "Gives you a large chance to ignore negative status effects being applied.", cost: 25, type: "passive", apply: suckOutTwoFunc },
  ],
];
export function boxCarsFunc(gameState, combo) {
  gameState.playerStats.damage += 3 + combo * 0.5;
}

function snakeEyesFunc(gameState, combo) {
  gameState.playerStats.damage += 4 + combo;
}

function coldStreakFunc(gameState, combo) {
  gameState.recurringEffects.push({ turns: 3, effect: () => {
      gameState.playerStats.damage += 2 + combo;
    }
  });
}

function hotShooterFunc(gameState, combo) {
  let converted = [];
  let convertToData = { name: "attack", type: "attack", effect: boxCarsFunc };
  gameState.machine.wheels.forEach(wheel => {
    wheel.segments.forEach(seg => {
      if (seg.type == "defense") {
        seg.convertTo(convertToData);
        converted.push(seg);
      }
    });
  });

  let delayedEffect = { turns: 3, effect: () => {
      converted.forEach(seg => {
        seg.convertBack();
      });
    }
  };

  gameState.delayedEffects.push(delayedEffect);
}

function confusionFunc(gameState, combo) {
  gameState.playerStats.selfDamage += 2 + combo;
}

function wrongSideShooterFunc(gameState, combo) {
  gameState.playerStats.damage += 4 + combo;
  gameState.playerStats.heal += 2 + combo;
}

function biggerDiceFunc(machine) {
  machine.segmentData.forEach(wheel => {
    wheel.forEach(seg => {
      if (seg.type == "attack") {
        seg.size += 10;
      }
    });
  });
}

function biggerDiceTwoFunc(machine) {
  machine.segmentData.forEach(wheel => {
    wheel.forEach(seg => {
      if (seg.type == "attack") {
        seg.size += 20;
      }
    });
  });
}

function biggerDiceThreeFunc(machine) {
  machine.segmentData.forEach(wheel => {
    wheel.forEach(seg => {
      if (seg.type == "attack") {
        seg.size += 40;
      }
    });
  });
}

function diceControllerFunc(machine) {
  // This bonus will be 
  //  (numCombos - 1) * bonus = new combo value
  machine.attackComboBonus = 1.75;
}

function letItRideFunc(machine) {
  machine.rageBonusOn = true;
}

function betTheHornFunc(machine) {
  machine.damageMultiplier += 0.25;
  machine.speedMultiplier += 0.5;
}

function hotShooterTwoFunc(machine) {
  let idx = machine.segmentData[0].findIndex(seg => seg.name == "confusion");
  machine.segmentData[1].splice(idx, 1);
  idx = machine.segmentData[1].findIndex(seg => seg.name == "confusion");
  machine.segmentData[1].splice(idx, 1);
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
    { name: "Box Cars", desc: "Additional basic attack segment. (Wheel 3)", cost: 5, type: "active", segments: [{ name: "Box Cars", type: "attack", size: 80, wheel: 3, effect: boxCarsFunc }] },
    { name: "Bigger Dice I", desc: "Increases the size of all attack segments slightly.", cost: 5, type: "passive", apply: biggerDiceFunc },
    { name: "Cold Streak", desc: "Deals damage over time to the enemy for 3 turns. (Wheel 1)", cost: 5, type: "active", segments: [{ name: "Cold Streak", type: "attack", size: 100, wheel: 1, effect: coldStreakFunc }] },
  ],
  [
    { name: "Box Cars", desc: "Additional basic attack segment. (Wheel 2)", cost: 8, type:"active", segments: [{ name: "Box Cars", type: "attack", size: 80, wheel: 2, effect: boxCarsFunc }] },
    { name: "Bet The Horn I", desc: "Your wheels speed up slightly, but so does your damage.", cost: 8, type: "passive", apply: betTheHornFunc },
    { name: "Dice Controller", desc: "Increase the bonus given from attack combos.", cost: 8, type: "passive", apply: diceControllerFunc },
  ],
  [
    { name: "Let It Ride", desc: "Deal progressively more damage each turn that you hit at least one attack segment.", cost: 11, type: "passive", apply: letItRideFunc },
    { name: "Snake Eyes", prevSkill: "Box Cars", desc: "Adds a large, stronger than normal attack segment. (Wheel 3)", cost: 11, type: "active", segments: [{ name: "Snake Eyes", type: "attack", size: 120, wheel: 3, effect: snakeEyesFunc }] },
    { name: "Bet The Horn II", prevSkill: "Bet The Horn I", desc: "Your wheels speed up moderately, but so does your damage.", cost: 11, type: "passive", apply: betTheHornFunc },
  ],
  [
    { name: "Wild Dice", desc: "Adds an attack segment that will count towards any type of combo. (Wheel 1)", cost: 15, type: "active", segments: [{ name: "Wild Dice", type: "wild", size: 80, wheel: 1, effect: boxCarsFunc }] },
    { name: "Cold Streak", desc: "Deals damage over time to the enemy for 3 turns. (Wheel 3)", cost: 15, type: "active", segments: [{ name: "Cold Streak", type: "attack", size: 100, wheel: 3, effect: coldStreakFunc }] },
    { name: "Wrong Side Shooter", desc: "Adds a segment that deals damage and recovers health. (Wheel 1)", cost: 15, type: "active", segments: [{ name: "Wrong Side Shooter", type: "attack", size: 80, wheel: 1, effect: wrongSideShooterFunc }] },
  ],
  [
    { name: "Bigger Dice II", desc: "Increases the size of all attack segments a medium amount.", cost: 20, type: "passive", apply: biggerDiceTwoFunc },
    { name: "Hot Shooter I", desc: "Turns all defense segments on all wheels into attack segments for the next two turns. Surrounded by two negative segments that deal damage to you when struck. (Wheel 2)", cost: 20, type: "active",
      segments: [{ name: "confusion", type: "negative", size: 40, wheel: 2, effect: confusionFunc }, { name: "Hot Shooter I", type: "attack", size: 100, wheel: 2, effect: hotShooterFunc }, { name: "confusion", type: "negative", size: 40, wheel: 2, effect: confusionFunc }] },
    { name: "Bet The Horn III", prevSkill: "Bet The Horn II", desc: "Your wheels speed up significantly, but so does your damage.", cost: 20, type: "passive", apply: betTheHornFunc },
  ],
  [
    { name: "Bigger Dice III", desc: "Increases the size of all attack segments a large amount.", cost: 25, type: "passive", apply: biggerDiceThreeFunc },
    { name: "Wrong Side Shooter", desc: "Adds a segment that deals damage and recovers health. (Wheel 3)", cost: 25, type: "active", segments: [{ name: "Wrong Side Shooter", type: "attack", size: 80, wheel: 3, effect: wrongSideShooterFunc }] },
    { name: "Hot Shooter II", prevSkill: "Hot Shooter I", desc: "Removes the negative segments from Hot Shooter I", cost: 20, type: "passive", apply: hotShooterTwoFunc },
  ],
];
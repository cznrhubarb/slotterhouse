const Behaviors = {
  "Attack": (gameState) => {
    gameState.enemyStats.damage += gameState.enemy.strength;
  },

  "Defend": (gameState) => {
    gameState.enemyStats.defend += gameState.enemy.defensePower;
  },

  "Heal": (gameState) => {
    gameState.enemyStats.heal += gameState.enemy.healPower;
  },

  "Siphon": (gameState) => {
    gameState.enemyStats.damage += gameState.enemy.strength;
    gameState.enemyStats.heal += gameState.enemy.healPower;
  },

  "Curl Up": (gameState) => {
    gameState.enemyStats.tempDefend = 9999;
  },

  "Reflecting...": (gameState) => {
    // Do nothing, but maybe display some text
  },
  "Counter Attack": (gameState) => {
    gameState.enemyStats.damage += gameState.enemyStats.lastDamageTaken * 3;
  },

  "Charging up to attack": (gameState) => {
    // Do nothing, but maybe display some text
  },
  "Charged Attack": (gameState) => {
    gameState.enemyStats.damage += gameState.enemy.strength * 5;
  },

//   DOT
  "Poison Thoughts": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    gameState.recurringEffects.push({ turns: 3, effect: () => {
        gameState.enemyStats.damage += Math.ceil(gameState.enemy.strength/2);
      }
    });
  },

//   Add blanks
  "Mind Blank": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    let converted = [];
    let convertToData = { name: "blank", type: "negative", effect: () => {} };
    gameState.machine.wheels.forEach(wheel => {
      // One random from each wheel
      let rndIndx = Math.floor(Math.random() * wheel.segments.length);
      wheel.segments[rndIndx].convertTo(convertToData);
      converted.push(wheel.segments[rndIndx]);
    });

    let delayedEffect = { turns: 3, effect: () => {
        converted.forEach(seg => {
          seg.convertBack();
        });
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },

//   Add confusion
  "Confusing Thoughts": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    let converted = [];
    let convertToData = { name: "confusion", type: "negative", effect: (gameState, combo) => { gameState.playerStats.selfDamage += gameState.enemy.strength * (1+combo) * 0.5; } };
    gameState.machine.wheels.forEach(wheel => {
      // One random from each wheel
      let rndIndx = Math.floor(Math.random() * wheel.segments.length);
      wheel.segments[rndIndx].convertTo(convertToData);
      converted.push(wheel.segments[rndIndx]);
    });

    let delayedEffect = { turns: 3, effect: () => {
        converted.forEach(seg => {
          seg.convertBack();
        });
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },

//   Add bomb segments (must be slashed in 3 turns or they explode? Or they last 3 turns and if they are hit they explode?)
  "Drop the Bomb": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    let wheelIndex = Math.floor(Math.random() * gameState.machine.wheels.length);
    let wheel = gamestate.machine.wheels[wheelIndex];
    let bombSeg = null;

    let deffect = { turns: 5, effect: () => {
        gameState.playerStats.selfDamage = gameState.enemy.strength * 5;
        // Remove self
        wheel.removeSegment(bombSeg);
        //TODO: Visual?
      }
    };

    gameState.delayedEffects.push(reffect);
    
    bombSeg = wheel.insertSegment({ name: "bomb", type: "negative", size: 100, effect: () => {
        // Remove self
        wheel.removeSegment(bombSeg);
        // Remove recurring effect
        gameState.delayedEffects.splice(gameState.delayedEffects.indexOf(deffect), 1);
      } 
    });
  },

//   Speed up Wheel/Machine
  "Racing Thoughts": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    const multiplier = 1.5;
    gameState.machine.speedMultiplier *= multiplier;

    let delayedEffect = { turns: 3, effect: () => {
        gameState.machine.speedMultiplier /= multiplier;
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },

//   Wonky speed the machine
  "Wonkify": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    gameState.machine.wonkySpeed = true;

    let delayedEffect = { turns: 3, effect: () => {
        gameState.machine.wonkySpeed = false;
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },

//   Weaken attacks
  "Weaken Will": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    const multiplier = 0.75;
    gameState.machine.damageMultiplier *= multiplier;

    let delayedEffect = { turns: 3, effect: () => {
        gameState.machine.damageMultiplier /= multiplier;
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },

//   Shrink non negatives
  "Narrow Mind": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    let converted = [];
    let multiplier = 0.75;
    gameState.machine.wheels.forEach(wheel => {
      wheel.segments.forEach(seg => {
        if (seg.type != "negative") {
          seg.resize(seg.totalWidth * multiplier);
          converted.push(seg);
        }
      });
    });

    let delayedEffect = { turns: 3, effect: () => {
        converted.forEach(seg => {
          seg.resize(seg.totalWidth / multiplier);
        });
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },

//   Disable heal/block
  "Provoke": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    let converted = [];
    let convertToData = { name: "blank", type: "negative", effect: () => {} };
    gameState.machine.wheels.forEach(wheel => {
      wheel.segments.forEach(seg => {
        if (seg.type == "defense" || seg.type == "heal") {
          seg.convertTo(convertToData);
          converted.push(seg);
        }
      });
    });

    let delayedEffect = { turns: 2, effect: () => {
        converted.forEach(seg => {
          seg.convertBack();
        });
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },

//   Add segment that shrinks all other segments in wheel each turn until it is slashed
  "Seed of Doubt": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    let wheelIndex = Math.floor(Math.random() * gameState.machine.wheels.length);
    let wheel = gamestate.machine.wheels[wheelIndex];

    let reffect = { turns: 999, effect: () => {
        wheel.segments.forEach(seg => {
          seg.resize(seg.totalWidth - 5);
        });
      }
    };

    gameState.recurringEffects.push(reffect);
    
    let doubtSeg = wheel.insertSegment({ name: "seedOfDoubt", type: "negative", size: 80, effect: () => {
        // Remove self
        wheel.removeSegment(doubtSeg);
        // Remove recurring effect
        gameState.recurringEffects.splice(gameState.recurringEffects.indexOf(reffect), 1);
        // Resize all segments that got shrunk
        wheel.segments.forEach(seg => {
          seg.resize(seg.origSize);
        })
      } 
    });
    
    wheel.segments.forEach(seg => {
      seg.origSize = seg.totalWidth;
    });
  },

//   Poison existing segments so that they deal self damage in addition to normal effects
  "Double Edged Sword": (gameState) => {
    if (gameState.machine.resistChance >= Math.random()) { return; }
    let converted = [];
    gameState.machine.wheels.forEach(wheel => {
      // One random from each wheel
      let rndIndx = Math.random() * wheel.segments.length;
      let seg = wheel.segments[rndIndx];
      let originalEffect = seg.effect;
      let convertToData = { name: seg.name, type: "negative", 
        effect: (gameState, combo) => { 
          gameState.playerStats.selfDamage += 2 + combo;
          originalEffect(gameState, combo);
        }
      };
      seg.convertTo(convertToData);
      converted.push(seg);
    });

    let delayedEffect = { turns: 3, effect: () => {
        converted.forEach(seg => {
          seg.convertBack();
        });
      }
    };

    gameState.delayedEffects.push(delayedEffect);
  },
};

const Probabilities = [
  [ "Attack" ], // 20x Attack
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Attack" ],
  [ "Defend" ], // 5x Defend
  [ "Defend" ],
  [ "Defend" ],
  [ "Defend" ],
  [ "Defend" ],
  [ "Heal" ], // 4x Heal
  [ "Heal" ],
  [ "Heal" ],
  [ "Heal" ],
  [ "Siphon" ], // 2x Siphon
  [ "Siphon" ],
  [ "Curl Up" ], // 2x Curl Up
  [ "Curl Up" ],
  [ "Reflecting...", "Counter Attack", ], // 2x Counter Attack
  [ "Reflecting...", "Counter Attack", ],
  [ "Charging up to attack", "Charging up to attack", "Charged Attack", ], // 2x Charged Attack
  [ "Charging up to attack", "Charging up to attack", "Charged Attack", ],
  [ "Poison Thoughts" ],
  [ "Poison Thoughts" ],
  [ "Mind Blank" ],
  [ "Mind Blank" ],
  [ "Mind Blank" ],
  [ "Confusing Thoughts" ],
  [ "Confusing Thoughts" ],
  [ "Drop the Bomb" ],
  [ "Drop the Bomb" ],
  [ "Racing Thoughts" ],
  [ "Racing Thoughts" ],
  [ "Wonkify" ],
  [ "Wonkify" ],
  [ "Wonkify" ],
  [ "Weaken Will" ],
  [ "Weaken Will" ],
  [ "Narrow Mind" ],
  [ "Narrow Mind" ],
  [ "Provoke" ],
  [ "Seed of Doubt" ],
  [ "Double Edged Sword" ],
  [ "Double Edged Sword" ],
];

export { Behaviors, Probabilities };
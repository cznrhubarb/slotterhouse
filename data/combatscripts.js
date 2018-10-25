import { Probabilities, Behaviors } from './enemyBehaviors';

export default [
  // Combat 1
  {
    health: 20,
    image: null,
    strength: 3,
    defensePower: 3,
    healPower: 1,
    ai: [
      "Attack",
      "Attack",
      "Defend",
    ]
  },
  // Combat 2
  {
    health: 35,
    image: null,
    strength: 4,
    defensePower: 4,
    healPower: 3,
    ai: [
      "Attack",
      "Defend",
      "Charging up to attack", 
      "Charging up to attack", 
      "Charged Attack",
      "Heal",
    ]
  },
  // Combat 3
  {
    health: 50,
    image: null,
    strength: 5,
    defensePower: 5,
    healPower: 5,
    ai: [
      "Wonkify",
      "Attack",
      "Attack",
      "Reflecting...", 
      "Counter Attack", 
      "Siphon",
    ]
  },
  // Combat 4
  {
    health: 70,
    image: null,
    strength: 6,
    defensePower: 5,
    healPower: 5,
    ai: [
      "Confusing Thoughts",
      "Weaken Will",
      "Attack",
      "Attack", 
      "Attack", 
      "Attack", 
      "Provoke",
    ]
  },
  // Combat 5
  {
    health: 100,
    image: null,
    strength: 7,
    defensePower: 4,
    healPower: 3,
    ai: [
      "Mind Blank",
      "Drop the Bomb",
      "Drop the Bomb",
      "Attack",
      "Confusing Thoughts", 
      "Defend", 
      "Siphon",
      "Seed of Doubt",
    ]
  },
];

export function GenerateRandomEnemy(scale) {
  let randomAIScript = [];
  for (let ctr = 0; ctr < 10; ctr++) {
    randomAIScript.push(...Probabilities[Math.floor(Math.random() * Probabilities.length)]);
  }

  let healthRange = Math.floor(Math.random() * 4) - 1;
  let strengthRange = Math.floor(Math.random() * 4) - 1;
  let defenseRange = Math.floor(Math.random() * 4) - 1;
  let healRange = Math.floor(Math.random() * 4) - 1;

  return {
    health: 50 + (scale + healthRange) * 10,
    image: null,
    strength: 3 + scale + strengthRange,
    defensePower: 4 + scale + defenseRange,
    healPower: 2 + scale + healRange,
    ai: randomAIScript
  };
}
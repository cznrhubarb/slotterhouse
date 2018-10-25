import { boxCarsFunc } from './dicetree';
import { bigSlickFunc } from './cardstree';
import { hitFunc } from './slotstree';

function blankFunc(gameState, combo) { }

let defaultSegments = [
  // Three lists for the three wheels. The wheels are in order, the segments will be shuffled before each combat.
  [
    // Name is also the icon file name that will be used.
    // Type is what is combo-able
    // Size is width of the center part of the bumper
    // Effect is the function called when it hits. It is an object with key/value pairs of information that can be used as necessary
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Big Slick", type: "defense", size: 80, effect: bigSlickFunc },
    { name: "Big Slick", type: "defense", size: 80, effect: bigSlickFunc },
    { name: "Hit", type: "heal", size: 80, effect: hitFunc },
    { name: "blank", type: "negative", size: 80, effect: blankFunc },
    { name: "blank", type: "negative", size: 80, effect: blankFunc },
    { name: "blank", type: "negative", size: 80, effect: blankFunc },
  ],
  [
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Big Slick", type: "defense", size: 80, effect: bigSlickFunc },
    { name: "Big Slick", type: "defense", size: 80, effect: bigSlickFunc },
    { name: "Big Slick", type: "defense", size: 80, effect: bigSlickFunc },
    { name: "Hit", type: "heal", size: 80, effect: hitFunc },
    { name: "Hit", type: "heal", size: 80, effect: hitFunc },
    { name: "blank", type: "negative", size: 80, effect:blankFunc },
    { name: "blank", type: "negative", size: 80, effect: blankFunc },
    { name: "blank", type: "negative", size: 80, effect: blankFunc },
  ],
  [
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Box Cars", type: "attack", size: 80, effect: boxCarsFunc },
    { name: "Big Slick", type: "defense", size: 80, effect: bigSlickFunc },
    { name: "Big Slick", type: "defense", size: 80, effect: bigSlickFunc },
    { name: "Hit", type: "heal", size: 80, effect: hitFunc },
    { name: "Hit", type: "heal", size: 80, effect: hitFunc },
    { name: "Hit", type: "heal", size: 80, effect: hitFunc },
    { name: "Hit", type: "heal", size: 80, effect: hitFunc },
    { name: "blank", type: "negative", size: 80, effect: blankFunc },
    { name: "blank", type: "negative", size: 80, effect: blankFunc },
  ],
];

export default function() {
  return defaultSegments.map(wheel => {
    return wheel.map(segData => {
      return Object.assign({}, segData);
    });
  });
};
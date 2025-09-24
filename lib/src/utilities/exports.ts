import * as Calculators from "./math/calculators";
import * as Randomizer from "./math/randomizer";

import { Vector2 } from "./math/classes/vectors/Vector2";
import { Vector3 }  from "./math/classes/vectors/Vector3";
import { Vector4 } from "./math/classes/vectors/Vector4";

import * as Constants from "./constants";

export const exports = {
  Math: {
    ...Calculators,
    ...Randomizer,
    Vector2,
    Vector3,
    Vector4,
  },
  Constants: {
    ...Constants
  }
} as const;
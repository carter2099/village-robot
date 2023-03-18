import { VillageState } from "../village/Village";

/**
 * Represents the state of the Robot; its direction and route it plans to take
 */
export type RobotState = {
  direction: string;
  memory?: string[];
};

/**
 * Represents a Robot. A Robot is a defined as a function; in this project we'll have three
 * functions, or algorithms, that will deliver the parcels.
 */
export type Robot = (state: VillageState, memory?: string[]) => RobotState;

/**
 * Run a Robot
 * @param state - The initial village state
 * @param robot - The Robot to run
 * @param memory - Stores the route for the Robot
 */
export const runRobot = (
  state: VillageState,
  robot: Robot,
  memory: string[]
): void => {
  let turn = 0;
  while (state.parcels.length != 0) {
    // The Robot will decide the next direction
    const action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
    turn++;
  }
  console.log(`Done in ${turn} turns`);
};

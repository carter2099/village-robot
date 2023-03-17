// Roads; aka edges; aka dash seperated vertices
const roads: string[] = [
  "Alice's House-Bob's House",
  "Alice's House-Post Office",
  "Daris's House-Ernie's House",
  "Ernie's House-Grete's House",
  "Grete's House-Shop",
  "Markteplace-Post Office",
  "Alice's House-Cabin",
  "Bob's House-Town Hall",
  "Daria's House-Town Hall",
  "Grete's House-Farm",
  "Marketplace-Farm",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

/**
 * Build our graph from our Array of roads (edges)
 * @param edges - Array of dash-separated places (vertices) indicating a(n) road (edge) in the village (graph)
 * @returns The graph representation of the village
 */
const buildGraph = (edges: string[]): Map<string, string> => {
  let graph: Map<string, string> = new Map();
  // Create the vertex and add the edge else add the edge to the existing vertex
  const addEdge = (from: string, to: string) => {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  };
  // Parce the list of dash seperated vertices into a graph
  edges
    .map((r) => r.split("-"))
    .forEach(([from, to]) => {
      addEdge(from, to);
      addEdge(to, from);
    });

  return graph;
};

const roadGraph: Map<string, string> = buildGraph(roads);

// Get a random item from any Array
const randomPick = (array: any[]): any => {
  const choice = Math.floor(Math.random() * array.length);
  return array[choice];
};

// Write bot logic
//--

type Parcel = {
  position: string;
  deliveryAddress: string;
};

type RobotState = {
  direction: string;
  memory?: string[];
};

// A Robot is a function
type Robot = (state: VillageState, memory?: string[]) => RobotState;

// Robot that chooses a random direction to go to every time
const randomRobot: Robot = (state): RobotState => {
  return { direction: randomPick(roadGraph[state.currentPosition]) };
};

// Mail Route
const mailRoute: string[] = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];
// Robot that follows the mail route
const routeRobot: Robot = (state, memory): RobotState => {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
};

/**
 * Represents a state of the village: the current position of the bot and the undelivered parcels.
 */
class VillageState {
  // Current bot position
  currentPosition: string;
  // Undelivered parcels
  parcels: Parcel[];

  /**
   * Creates a new VillageState object
   * @param botPosition - The position of the bot in the village
   * @param parcels - The undelivered parcels in the village
   */
  constructor(botPosition: string, parcels: Parcel[]) {
    this.currentPosition = botPosition;
    this.parcels = parcels;
  }

  /**
   * Generate a random village state
   * @param parcelCount - The number of parcels to generate
   * @returns The randomized VillageState; the VillageState will always start at the Post Office
   */
  static randomState(parcelCount: number = 5): VillageState {
    let parcels: Parcel[] = [];
    for (let i = 0; i < parcelCount; i++) {
      const deliveryAddress: string = randomPick(Object.keys(roadGraph));
      let position: string;
      // Make sure the position of the parcel does not match the address, or else it would already be delivered
      position = randomPick(
        Object.keys(roadGraph).filter((place) => place != deliveryAddress)
      );
      parcels.push({ position, deliveryAddress });
    }
    // Always start at the Post Office
    return new VillageState("Post Office", parcels);
  }

  /**
   * Move within the village
   * @param destination - The place to go
   * @returns The new VillageState
   */
  move(destination: string): VillageState {
    // We can't move to the destination if there is no road from the current position
    if (!roadGraph[this.currentPosition].includes(destination)) {
      return this;
    }
    const parcels = this.parcels
      .map((parcel) => {
        // Do nothing with parcels that are not held by the robot (parcels at the current position)
        if (parcel.position != this.currentPosition) {
          return parcel;
        }
        // Otherwise move the parcels along (the robot is holding the parcel)
        return {
          position: destination,
          deliveryAddress: parcel.deliveryAddress,
        };
      })
      // Remove the packages that will be delivered by the move
      .filter((p) => p.position != p.deliveryAddress);
    return new VillageState(destination, parcels);
  }
}

// Find the sequence of roads that take you from 'from' to 'to'
const findRoute = (
  graph: Map<string, string>,
  from: string,
  to: string
): string[] => {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) {
        return route.concat(place);
      }
      if (!work.some((w) => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
};

/**
 * Run a Robot
 * @param state - The initial village state
 * @param robot - The Robot to run
 * @param memory - Holds where the Robot has been
 */
const runRobot = (
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

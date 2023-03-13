// Setup graph
const roads = [
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

const buildGraph = (edges: string[]) => {
  let graph = {};
  const addEdge = (from: string, to: string) => {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  };
  edges
    .map((r) => r.split("-"))
    .forEach(([from, to]) => {
      addEdge(from, to);
      addEdge(to, from);
    });

  return graph;
};

const roadGraph = buildGraph(roads);

const randomPick = (array: any[]) => {
  const choice = Math.floor(Math.random() * array.length);
  return array[choice];
};

const randomRobot = (state: VillageState) => {
  return { direction: randomPick(roadGraph[state.currentPosition]) };
};

// Write bot logic
type Parcel = {
  position: string;
  address: string;
};

class VillageState {
  currentPosition: string;
  parcels: Parcel[];

  constructor(botPosition: string, parcels: Parcel[]) {
    this.currentPosition = botPosition;
    this.parcels = parcels;
  }

  static randomState(parcelCount: number = 5) {
    let parcels: Parcel[] = [];
    for (let i = 0; i < parcelCount; i++) {
      const address: string = randomPick(Object.keys(roadGraph));
      let position: string;
      do {
        position = randomPick(Object.keys(roadGraph));
      } while (position == address);
      parcels.push({ position, address });
    }
    return new VillageState("Post Office", parcels);
  }

  move(destination: string) {
    if (!roadGraph[this.currentPosition].includes(destination)) {
      return this;
    }
    const parcels = this.parcels
      .map((p) => {
        if (p.position != this.currentPosition) {
          return p;
        }
        return { position: destination, address: p.address };
      })
      .filter((p) => p.position != p.address);
    return new VillageState(destination, parcels);
  }
}

const runRobot = (state: VillageState, robot: any, memory: any) => {
  let turn = 0;
  while (state.parcels.length != 0) {
    const action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
    turn++;
  }
  console.log(`Done in ${turn} turns`);
};

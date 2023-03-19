import { buildGraph, randomPick } from "../utils/Utils.js";

/**
 * Represents a Parcel; a current position and a destination
 */
export type Parcel = {
  position: string;
  deliveryAddress: string;
};

export class VillageMap {
  // Roads; aka edges; aka dash seperated vertices
  static ROADS: string[] = [
    "Alice's House-Bob's House",
    "Alice's House-Post Office",
    "Daria's House-Ernie's House",
    "Ernie's House-Grete's House",
    "Grete's House-Shop",
    "Marketplace-Post Office",
    "Alice's House-Cabin",
    "Bob's House-Town Hall",
    "Daria's House-Town Hall",
    "Grete's House-Farm",
    "Marketplace-Farm",
    "Marketplace-Shop",
    "Marketplace-Town Hall",
    "Shop-Town Hall",
  ];

  // Mail Route; an ordered list of places/vertices
  static MAIL_ROUTE: string[] = [
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

  // Build the graph representation of the village
  static GRAPH: Map<string, string> = buildGraph(VillageMap.ROADS);
}

/**
 * Represents a state of the village: the current position of the bot and the undelivered parcels.
 */
export class VillageState {
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
      const deliveryAddress: string = randomPick(Object.keys(VillageMap.GRAPH));
      let position: string;
      // Make sure the position of the parcel does not match the address, or else it would already be delivered
      position = randomPick(
        Object.keys(VillageMap.GRAPH).filter(
          (place) => place != deliveryAddress
        )
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
    if (!VillageMap.GRAPH[this.currentPosition].includes(destination)) {
      return this;
    }
    const parcels = this.parcels
      .map((parcel) => {
        // Do nothing with parcels that are not held by the robot (parcels not at the current position)
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

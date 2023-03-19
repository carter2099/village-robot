import { findRoute, randomPick } from "../utils/Utils.js";
import { VillageMap } from "../village/Village.js";
import { Robot, RobotState } from "./Robot.js";

export class RobotAlgorithm {
  // Robot that chooses a random direction to go to every time
  static RANDOM: Robot = (state): RobotState => {
    return { direction: randomPick(VillageMap.GRAPH[state.currentPosition]) };
  };

  // Robot that follows the mail route
  static MAIL_ROUTE: Robot = (state, memory): RobotState => {
    if (memory.length == 0) {
      memory = Array.from(VillageMap.MAIL_ROUTE);
    }
    return { direction: memory[0], memory: memory.slice(1) };
  };

  // Robot that finds a route for the next parcel in the Array of parcels and delivers it
  static IMPATIENT: Robot = (state, route): RobotState => {
    const { currentPosition, parcels } = state;
    if (route.length == 0) {
      let parcel = parcels[0];
      const destination =
        parcel.position == currentPosition
          ? parcel.deliveryAddress
          : parcel.position;
      route = findRoute(VillageMap.GRAPH, currentPosition, destination);
    }
    return { direction: route[0], memory: route.slice(1) };
  };

  // Robot that always takes the shortest route that completes a task first
  static PRIORITY: Robot = (state, route): RobotState => {
    const { currentPosition, parcels } = state;
    let shortestRoute = [];
    if (route.length == 0) {
      parcels.forEach((parcel, idx) => {
        const destination =
          parcel.position == currentPosition
            ? parcel.deliveryAddress
            : parcel.position;
        route = findRoute(VillageMap.GRAPH, currentPosition, destination);
        if (idx == 0) {
          shortestRoute = Array.from(route);
        }
        if (route.length < shortestRoute.length) {
          shortestRoute = Array.from(route);
        }
      });
    }
    return { direction: shortestRoute[0], memory: shortestRoute.slice(1) };
  };
}

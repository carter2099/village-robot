import { RobotAlgorithm } from "./robot/Algorithms";
import { Robot, runRobot } from "./robot/Robot";
import { VillageState } from "./village/Village";

const args = process.argv.slice(2);

const options: any = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^-+/, "");
  const value = args[i + 1];
  options[key] = value;
}

// Decide what Robot we'll be running
let robot: Robot = null;
switch (options.algorithm) {
  case "random":
    console.log("Random algorithm chosen");
    robot = RobotAlgorithm.RANDOM;
    break;
  case "mailRoute":
    console.log("MailRoute algorithm chosen");
    robot = RobotAlgorithm.MAIL_ROUTE;
    break;
  case "impatient":
    console.log("Impatient algorithm chosen");
    robot = RobotAlgorithm.IMPATIENT;
    break;
  case "priority":
    console.log("Priority algorithm chosen");
    robot = RobotAlgorithm.PRIORITY;
    break;
  default:
    // Default to random
    console.log("No algorithm chosen. Defaulting to random");
    robot = RobotAlgorithm.RANDOM;
}

runRobot(VillageState.randomState(), robot, []);

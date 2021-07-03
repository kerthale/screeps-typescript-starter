import { Constructor } from "roles/constructor";
import { ErrorMapper } from "utils/ErrorMapper";
import { GamePlanner } from "roles/game_planner";
import { Harvester } from "roles/harvester";
import { RoomPlanner } from "roles/room_planner";
import { spawn } from "roles/spawn";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  new GamePlanner(Game).run();

  for (const spawnName in Game.spawns) {
    new spawn(spawnName, Game).run();
  }

  for (const roomName in Game.rooms) {
    new RoomPlanner(roomName, Game).run();
  }

  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    if (creepName.startsWith("Harvester")) {
      new Harvester(creep, Game).run();
    } else if (creepName.startsWith("Construtor")) {
      new Constructor(creep, Game).run();
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});

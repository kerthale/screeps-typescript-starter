declare global {
  interface CreepMemory {
    [key: string]: any;
  }
}

enum HarvestingState {
  HARVESTING = "harvesting",
  RETURNING = "returning"
}

export class Harvester {
  private state: HarvestingState = HarvestingState.HARVESTING;
  private creep: Creep;
  private game: Game;
  private spawnLoc: StructureSpawn;

  public constructor(creep: Creep, game: Game) {
    this.creep = creep;
    this.game = game;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.spawnLoc = game.spawns[creep.memory.spawnId];
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.state = creep.memory.state;
    } catch (e) {
      this.state = HarvestingState.HARVESTING;
    }
  }

  public run(): void {
    const target: Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    if (0 === this.creep.store.getFreeCapacity() && this.state === HarvestingState.HARVESTING) {
      this.state = HarvestingState.RETURNING;
    } else if (0 === this.creep.store.getUsedCapacity() && this.state === HarvestingState.RETURNING) {
      this.state = HarvestingState.HARVESTING;
    }

    if (this.state === HarvestingState.RETURNING) {
      const targetController: StructureController | undefined = this.creep.room.controller;
      if (targetController instanceof StructureController) {
        const returnCode: ScreepsReturnCode = this.creep.transfer(targetController, RESOURCE_ENERGY);
        if (returnCode === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targetController);
        }
      }
    } else if (this.state === HarvestingState.HARVESTING) {
      if (target != null) {
        const returnCode: ScreepsReturnCode = this.creep.harvest(target);
        if (returnCode === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
        } else {
          console.log("Cannot harvest due to: " + returnCode.toString());
        }
      }
    } else {
      this.state = HarvestingState.HARVESTING;
    }
    this.creep.memory.state = this.state;
  }

  public static spawn(spawn: StructureSpawn, game: Game): void {
    const name: string = "Harvester" + Game.time.toString();
    const result: ScreepsReturnCode = spawn.spawnCreep([WORK, CARRY, MOVE], name);
    if (result === OK) {
      game.creeps[name].memory.spawnId = spawn.id;
    }
  }
}

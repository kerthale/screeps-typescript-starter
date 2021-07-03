declare global {
  interface CreepMemory {
    [key: string]: any;
  }
}

enum ConstructorState {
  HARVESTING = "harvesting",
  BUILDING = "building"
}

export class Constructor {
  private state: ConstructorState = ConstructorState.HARVESTING;
  private creep: Creep;
  private game: Game;

  public constructor(creep: Creep, game: Game) {
    this.creep = creep;
    this.game = game;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.state = creep.memory.state;
    } catch (e) {
      this.state = ConstructorState.HARVESTING;
    }
  }

  public run(): void {
    const target: Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    if (0 === this.creep.store.getFreeCapacity() && this.state === ConstructorState.HARVESTING) {
      this.state = ConstructorState.BUILDING;
    } else if (0 === this.creep.store.getUsedCapacity() && this.state === ConstructorState.BUILDING) {
      this.state = ConstructorState.HARVESTING;
    }

    if (this.state === ConstructorState.BUILDING) {
      const site: ConstructionSite | null = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (site instanceof ConstructionSite) {
        const returnCode: ScreepsReturnCode = this.creep.build(site);
        if (returnCode === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(site);
        }
      }
    } else if (this.state === ConstructorState.HARVESTING) {
      if (target != null) {
        const returnCode: ScreepsReturnCode = this.creep.harvest(target);
        if (returnCode === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
        } else {
          console.log("Cannot harvest due to: " + returnCode.toString());
        }
      }
    } else {
      this.state = ConstructorState.HARVESTING;
    }
    this.creep.memory.state = this.state;
  }

  public static spawn(spawn: StructureSpawn, game: Game): void {
    const name: string = "Construtor" + Game.time.toString();
    const result: ScreepsReturnCode = spawn.spawnCreep([WORK, CARRY, MOVE], name);
    if (result === OK) {
      game.creeps[name].memory.spawnId = spawn.id;
    }
  }
}

import { Harvester } from "roles/harvester";
import { Constructor } from "./constructor";

export class spawn {
  private spawn: StructureSpawn;
  private game: Game;

  public constructor(spawnName: string, game: Game) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.spawn = game.spawns[spawnName];
    this.game = game;
  }

  public run(): void {
    // Test if can spawn
    if (this.spawn.store[RESOURCE_ENERGY] >= 50) {
      const sites: ConstructionSite[] = this.spawn.room.find(FIND_CONSTRUCTION_SITES);
      if (sites.length > 0) {
        let constructors = 0;
        for (const creepName in this.game.creeps) {
          if (creepName.startsWith("Construtor") && (this.game.creeps[creepName].room = this.spawn.room)) {
            constructors++;
          }
        }
        if (constructors < sites.length / 3) {
          Constructor.spawn(this.spawn, this.game);
        } else {
          Harvester.spawn(this.spawn, this.game);
        }
      }
    }
  }
}

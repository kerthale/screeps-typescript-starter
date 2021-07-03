import path from "path";

interface ConquerResult {
  path: PathFinderPath | undefined;
  room: Room | undefined;
}

export class GamePlanner {
  private game: Game;

  public constructor(game: Game) {
    this.game = game;
  }

  public shouldConquer(room: Room): boolean {
    if (room && room.controller && !room.controller?.owner) {
      return true;
    }
    return false;
  }

  public run(): void {
    const ownedRooms: Room[] = [];

    for (const roomName in this.game.rooms) {
      const room: Room = this.game.rooms[roomName];
      if (room.controller && room.controller.owner?.username === "PALH" && room.controller.level > 2) {
        ownedRooms.push(room);
      }
      // TODO: Determine center mass and conquer around that
    }
    const someRoom = ownedRooms.pop();
    const controller = someRoom?.controller;
    // TODO: First send scout
    if (someRoom && controller) {
      // Find adjacent rooms and determine nearest to conquer.
      const exits = this.game.map.describeExits(someRoom.name);
      let conquer: ConquerResult = { path: undefined, room: undefined };
      if (exits[1]) {
        conquer = this.decideConquer(someRoom, conquer, this.game.rooms[exits[1]]);
      }
      if (exits[3]) {
        conquer = this.decideConquer(someRoom, conquer, this.game.rooms[exits[3]]);
      }
      if (exits[5]) {
        conquer = this.decideConquer(someRoom, conquer, this.game.rooms[exits[5]]);
      }
      if (exits[7]) {
        conquer = this.decideConquer(someRoom, conquer, this.game.rooms[exits[7]]);
      }
      if (conquer.room && conquer.path) {
        console.log("Conquer: " + conquer.room.name);
      }
    }
  }

  private decideConquer(someRoom: Room, previousResult: ConquerResult, targetRoom: Room): ConquerResult {
    let conquerPath: PathFinderPath | undefined = previousResult.path;
    let conquerRoom: Room | undefined = previousResult.room;
    if (this.shouldConquer(targetRoom)) {
      if (targetRoom.controller && someRoom.controller) {
        const targetController = targetRoom.controller;
        const targetPath: PathFinderPath = PathFinder.search(someRoom.controller?.pos, targetController.pos);
        if (conquerPath) {
          if (conquerPath.cost > targetPath.cost) {
            conquerPath = targetPath;
            conquerRoom = targetRoom;
          }
        } else {
          conquerPath = targetPath;
          conquerRoom = targetRoom;
        }
      }
    }
    return { path: conquerPath, room: conquerRoom };
  }
}

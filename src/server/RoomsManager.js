const Room = require("./Room");

class RoomManager {

  constructor() {
    this.rooms = [];
  }

  getRoom(roomName) {
    if (typeof roomName !== "string")
      return undefined;
    return this.rooms.find(e => e.name === roomName);
  }

  hasRoom(roomName) {
    if (typeof roomName !== "string")
      return false;
    return this.getRoom(roomName) !== undefined;
  }

  addRoom(roomName) {
    if (typeof roomName !== "string" || this.getRoom(roomName) !== undefined)
      return false;
    this.rooms.push(new Room(roomName));
  }

  destroyRoom(roomName) {
    if (typeof roomName !== "string" || this.getRoom(roomName) === undefined)
      return false;
    const room = this.getRoom(roomName);
    if (room.getUsers().length === 0)
      return false;
    room.getUsers().forEach(e => {
      room.removeUser(e);
    });
    return true;
  }
}

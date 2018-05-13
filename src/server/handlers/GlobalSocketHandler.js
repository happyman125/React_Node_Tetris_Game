const SocketHandler = require("./SocketHandler");
const PacketSender = require("../packet/PacketSender");
const socketDefs = require("../../common/socket-definitions");
const {PARTS} = require("../../common/parts");

class GlobalSocketHandler extends SocketHandler {

  /**
   * Constructor of RoomSocketHandler class
   * @param socket
   */
  constructor(socket) {
    super(socket);
  }

  /**
   * This is used when a client join the socket
   * @param {string} response
   */
  connection(response = "connectionResponse") {
    socket.emit(response);
  }

  /**
   * This will generate 10 pieces to all clients
   * @param {string} data
   * @param {string} data.roomName
   * @param response
   */
  genFlow(data, response = socketDefs.CONNECTION_RESPONSE) {
    if (super.roomIsValid(data, response))
    {
      const tetrisPieces = [];
      for(let i = 0; i < 10; i++)
        tetrisPieces.push(PARTS[Math.floor(Math.random() * PARTS.length)]);
      socket.emit(response, {success: true});
      PacketSender.sendGenFlow(data.roomName, tetrisPieces);
    }
  }
}

module.exports = GlobalSocketHandler;

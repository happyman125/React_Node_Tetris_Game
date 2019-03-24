import {EnumAction, ReduxAction} from '@src/client/actions/action-creators';
import {
  ENUM_SOCKET_EVENT_SERVER,
  IEventServerMovePiece,
  IEventServerSetGameOption,
  IEventServerSubRoomState,
  IEventServerStartGame,
} from '@src/common/socketEventServer';
import {isPlaying} from '@src/client/reducers/isPlaying';

/*
const sendSubRoomsPlayersName = (socket: SocketIOClient.Socket, arg: IEventServerSubRoomsPlayersName) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.SUB_ROOMS_PLAYERS_NAME, arg);
};

    const sendSubRoomState = (socket: SocketIOClient.Socket, arg: IEventServerSubRoomState) => {
      socket.emit(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, arg);
    };

    if (state.roomName !== undefined && state.playerName !== undefined) {
      sendSubRoomState(state.socket, {
        playerName: state.playerName,
        roomName: state.roomName,
      });
    }
*/

const sendStartGame = (socket: SocketIOClient.Socket, arg: IEventServerStartGame): void => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.START_GAME, arg);
};

const sendUpdateOptionGame = (socket: SocketIOClient.Socket, arg: IEventServerSetGameOption): void => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.SET_GAME_OPTION, arg);
};

const sendMovePiece = (socket: SocketIOClient.Socket, arg: IEventServerMovePiece) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.MOVE_PIECE, arg);
};

const sendRoomPlayerName = (socket: SocketIOClient.Socket, arg: IEventServerSubRoomState) => {
  socket.emit(ENUM_SOCKET_EVENT_SERVER.JOIN_ROOM, arg);
};

const socketMiddleware = (store: any) => (next: any) => (action: ReduxAction) => {

  const state = store.getState();

  switch (action.type) {
    case EnumAction.SEND_ROOM_PLAYER_NAME:
      if (state.socket !== undefined && state.roomName !== undefined) {
        sendRoomPlayerName(state.socket, {
          roomName: state.roomName,
          playerName: state.playerNames,
        });
      }
      break;
    case EnumAction.SEND_START_GAME:
      if (state.socket !== undefined && state.roomName !== undefined) {
        sendStartGame(state.socket, {
          roomName: state.roomName,
        });
      }
      break;
    case EnumAction.SEND_UPDATE_OPTION_GAME:
      if (state.socket !== undefined && state.roomName !== undefined) {
        sendUpdateOptionGame(state.socket, {
          roomName: state.roomName,
          optionGame: action.optionGame,
        });
      }
      break;
    case EnumAction.SEND_MOVE_PIECE:
      if (state.socket !== undefined && state.roomName !== undefined && isPlaying(state)) {
        sendMovePiece(state.socket, {
          roomName: state.roomName,
          move: action.move,
        });
      }
      break;
    case EnumAction.SEND_JOIN_ROOM:
      break;
    case EnumAction.SEND_QUIT_ROOM:
      break;
    case EnumAction.SEND_SUB_ROOMS_PLAYERS_NAME:
      break;
    case EnumAction.SEND_UN_SUB_ROOMS_PLAYERS_NAME:
      break;
    default:
      break;
  }

  return next(action);
};

export {socketMiddleware};

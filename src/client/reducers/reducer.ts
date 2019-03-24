import {EnumAction, ReduxAction} from '../actions/action-creators';
import * as io from 'socket.io-client';
import {IRoomPlayersName, IRoomStateClient} from '@src/common/socketEventClient';

// mv socket handler ?
const SOCKET_URL = 'http://localhost:4433';

interface IState {
  readonly socket: SocketIOClient.Socket,
  readonly playerName: string | undefined,
  readonly roomName: string | undefined,

  readonly roomState: IRoomStateClient | undefined,
  readonly roomsPlayersName: IRoomPlayersName[],
  readonly errorMsg: string | undefined,
}

const initApp = (): IState => {
  const socket: SocketIOClient.Socket = io(SOCKET_URL);

  return {
    socket: socket,
    playerName: undefined,
    roomName: undefined,
    roomState: undefined,
    roomsPlayersName: [],
    errorMsg: undefined,
  };
};

const reducer = (state = initApp(), action: ReduxAction): IState => {
  switch (action.type) {
    case EnumAction.ON_SET_ROOM_STATE:
      return {
        ...state,
        roomState: action.arg.room,
      };
    case EnumAction.ON_SET_ROOMS_PLAYERS_NAME:
      return {
        ...state,
        roomsPlayersName: action.arg.roomsPlayersName,
      };
    case EnumAction.ON_SET_ERROR:
      return {
        ...state,
        errorMsg: action.arg.msg,
      };
    case EnumAction.REFRESH:
      return {...state};
    case EnumAction.SEND_JOIN_ROOM:
      return {
        ...state,
        playerName: action.playerName,
        roomName: action.roomName,
      };
    default:
      return state;
  }
};

export {
  reducer,
  EnumAction,
  IState,
};

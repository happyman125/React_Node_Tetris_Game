import {Socket} from 'socket.io';
import {ENUM_PIECES_MOVE} from '@src/common/grid-piece-handler';
import {factPlayer, IOptionGame, IRoomState} from '@src/common/ITypeRoomManager';
import {BehaviorSubject} from 'rxjs';

// -- ACTION

enum EnumActionRoomStore {
  ADD_PLAYER,
  DEL_PLAYER,
  UPDATE_OPTION_GAME,
  START_GAME,
  MOVE_PIECE,
}

interface IActionRoom {
  type: EnumActionRoomStore;
}

// ADD_PLAYER

interface IActionRoomAddPlayer extends IActionRoom {
  type: EnumActionRoomStore.ADD_PLAYER;

  playerName: string;
  socket: Socket;
}

const ADD_PLAYER = (playerName: string, socket: Socket): IActionRoomAddPlayer => {
  return {
    type: EnumActionRoomStore.ADD_PLAYER,
    playerName,
    socket,
  };
};

const reducerAddPlayer = (state: IRoomState, action: IActionRoomAddPlayer): IRoomState => {

  const {playerName, socket} = action;

  const hasPlayerName = state.players.some((p) => p.playerName === playerName);
  if (hasPlayerName) {
    // TODO emit error
  }

  const hasSocket = state.players.some((p) => p.socket.id === socket.id);
  if (hasSocket) {
    // TODO
  }

  return {
    ...state,
    players: [...state.players,
      factPlayer(playerName, socket),
    ],
  };
};

// DEL_PLAYER

interface IActionRoomDelPlayer extends IActionRoom {
  type: EnumActionRoomStore.DEL_PLAYER;

  socketId: string;
}

const DEL_PLAYER = (socketId: string): IActionRoomDelPlayer => {
  return {
    type: EnumActionRoomStore.DEL_PLAYER,
    socketId,
  };
};

const reducerDelPlayer = (state: IRoomState, action: IActionRoomDelPlayer): IRoomState => {

  const {socketId} = action;

  if (state.players.some((p) => p.socket.id === socketId)) {
    return {
      ...state,
      players: state.players.filter((p) => p.socket.id === socketId),
    };
  }
  return state;
};

// UPDATE_OPTION_GAME

interface IActionUpdateOptionGame extends IActionRoom {
  type: EnumActionRoomStore.UPDATE_OPTION_GAME;

  optionGame: IOptionGame;
}

const UPDATE_OPTION_GAME = (optionGame: IOptionGame): IActionUpdateOptionGame => {
  return {
    type: EnumActionRoomStore.UPDATE_OPTION_GAME,
    optionGame,
  };
};

const reducerUpdateOptionGame = (state: IRoomState, action: IActionUpdateOptionGame): IRoomState => {

  const {optionGame} = action;

  return {
    ...state,
    optionGame: optionGame,
  };
};

// START_GAME

interface IActionStartGame extends IActionRoom {
  type: EnumActionRoomStore.START_GAME;
}

const START_GAME = (): IActionStartGame => {
  return {
    type: EnumActionRoomStore.START_GAME,
  };
};

const reducerStartGame = (state: IRoomState, action: IActionStartGame): IRoomState => {
  return {
    ...state,
    playing: true,
    players: state.players.map((p) => ({
      ...p,
      playing: true,
    })),
  };
};

// MOVE_PIECE

interface IActionMovePiece extends IActionRoom {
  type: EnumActionRoomStore.MOVE_PIECE;

  socketId: string,
  move: ENUM_PIECES_MOVE,
}

const MOVE_PIECE = (socketId: string, move: ENUM_PIECES_MOVE): IActionMovePiece => {
  return {
    type: EnumActionRoomStore.MOVE_PIECE,

    socketId,
    move,
  };
};

const reducerMovePiece = (state: IRoomState, action: IActionMovePiece): IRoomState => {
  // const {piece, pos} = arg;
  // TODO
  return state;
};

// -- ACTION ROOM

type ActionRoom = IActionRoomAddPlayer
  | IActionRoomDelPlayer
  | IActionUpdateOptionGame
  | IActionStartGame
  | IActionMovePiece;

// -- REDUCER

// use middelware for check end send socket... ?
const reducer = (state: IRoomState, action: ActionRoom): IRoomState => {
  switch (action.type) {
    case EnumActionRoomStore.ADD_PLAYER:
      return reducerAddPlayer(state, action);
    case EnumActionRoomStore.DEL_PLAYER:
      return reducerDelPlayer(state, action);
    case EnumActionRoomStore.UPDATE_OPTION_GAME:
      return reducerUpdateOptionGame(state, action);
    case EnumActionRoomStore.START_GAME:
      return reducerStartGame(state, action);
    case EnumActionRoomStore.MOVE_PIECE:
      return reducerMovePiece(state, action);
    default:
      return state;
  }
};

// -- ROOM MANAGER

class RoomManager {

  state: IRoomState;
  stateSub: BehaviorSubject<IRoomState>;

  constructor(roomName: string) {
    this.state = {
      roomName: roomName,
      players: [],
      playing: false,
      optionGame: {
        addWallLine: true,
        groundResizer: true,
      },
    };
    this.stateSub = new BehaviorSubject<IRoomState>(this.state);
  }

  public dispatch(action: ActionRoom): void {
    const newState = reducer(this.state, action);

    if (newState !== this.state) {
      this.state = newState;
      this.stateSub.next(this.state);
    }
  }

  public hasSocketId(socketId: string): boolean {
    return this.state.players.some((p) => p.socket.id === socketId);
  }

  public nbPlayer(): number {
    return this.state.players.length;
  }

}

export {
  RoomManager,
  ActionRoom,
  ADD_PLAYER,
  DEL_PLAYER,
  UPDATE_OPTION_GAME,
  START_GAME,
  MOVE_PIECE,
};

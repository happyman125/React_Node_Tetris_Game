import {urlGetPlayerName, urlGetRoomName} from "../url-handler";
import {getPieceMask} from "../../common/pieces";
import {emitGenFlow} from "../socket/socket-api";
import {randNumber} from "../util/utils";
import {store} from "./store";
import {movePart} from "./action-creators";
import {PARTS_MOVE} from "../../common/pieces";

const GRID_HEIGHT = 20;
const GRID_WIDTH = 10;

const initPlayerState = (playerName, isMaster=false) => {
  return {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 6, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
      [0, 0, 0, 0, 0, 5, 5, 0, 6, 6],
      [0, 0, 0, 0, 5, 5, 3, 4, 4, 6],
      [0, 0, 0, 0, 3, 3, 3, 4, 4, 0],
    ],
    playerName: playerName,
    isMaster: isMaster,
  }
};

const initialState = {
  playerStates: [initPlayerState(urlGetPlayerName())],
  playerName: urlGetPlayerName(),
  roomName: urlGetRoomName(),
  piecesFlow: [1, 2, 3],
  curPartPos: {x: 0 + getPieceMask(0, 1).x, y: -1 + getPieceMask(0,1 ).y},
  curPartRot: 1,
  curPartCoords: [],
  error: undefined,
};

const prepareNewPiece = (state) => {
  state.curPartCoords = [];
  if (state.piecesFlow.length < 3) {
    emitGenFlow();
  }
  state.curPartRot = randNumber(0, 3);
  const mask = getPieceMask(state.piecesFlow[0] - 1, state.curPartRot);
  state.curPartPos = {
    x: randNumber(0, GRID_WIDTH - 1) + mask.x,
    y: -1 + mask.y
  };
};

//prepareNewPiece(initialState);

export {initialState, initPlayerState, GRID_HEIGHT, GRID_WIDTH, prepareNewPiece};
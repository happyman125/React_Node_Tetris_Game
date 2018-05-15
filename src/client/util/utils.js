const isInUsers = (users, username) => {
  return users.some(e => e.username === username);
};

const isInPlayerStates = (playerStates, playerName) => {
  return playerStates.some(e => e.playerName === playerName);
};

const clonePlayerStates = playerStates => playerStates.map(playerState => Object.assign({}, {
    grid: playerState.grid.map(l => l.map(e => e)),
    playerName: playerState.playerName,
    isMaster: playerState.isMaster,
  }))
;

const cloneState = state => Object.assign({}, {
    playerStates: clonePlayerStates(state.playerStates),
    playerName: state.playerName,
    roomName: state.roomName,
    piecesFlow: state.piecesFlow.map(e => e),
    curPiecePos: Object.assign({}, state.curPiecePos),
    curPieceRot: state.curPieceRot,
    error: Object.assign({}, state.error)
  })
;

const randNumber = (min, max) => Math.floor(Math.random() * max) + min;

export {isInUsers, isInPlayerStates, cloneState, clonePlayerStates, randNumber};

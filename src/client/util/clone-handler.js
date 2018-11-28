const clonePlayerState = playerState =>
  Object.assign(
    {},
    playerState,
    {grid: playerState.grid.map(l => l.map(e => e))}
  )
;

const clonePlayerStates = playerStates => playerStates.map(playerState => clonePlayerState(playerState));

const clonePiece = piece => Object.assign({}, piece, {pos: Object.assign({}, piece.pos)});

/* Shalow copie games */
const cloneState = state =>
  Object.assign(
    {},
    state,
    {
      playerStates: clonePlayerStates(state.playerStates),
      piecesFlow: state.piecesFlow.map(p => clonePiece(p)),
      error: Object.assign({}, state.error),
      params: Object.assign({}, state.params)
    }
  )
;

export {cloneState, clonePlayerStates, clonePiece, clonePlayerState};

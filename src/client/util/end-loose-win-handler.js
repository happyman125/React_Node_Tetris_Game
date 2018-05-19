const ifWinSet = state => {
  const playersNotLoose = state.playerStates.filter(e => !e.hasLoose);
  if (state.playerStates.length > 1 && state.playerStates.filter(e => !e.hasLoose).length === 1) {
    playersNotLoose[0].hasWin = true;

    state.SetAnimateFalse = true;
  }
};

const ifLooseSet = state => {
  const player = state.playerStates.find(playerState => playerState.playerName === state.playerName);
  if (player.grid[3].some(e => e !== 0)) {
    player.hasLoose = true;

    state.SetAnimateFalse = true;
    state.EmitLoose = true;
    ifWinSet(state);
  }
};

export {ifLooseSet, ifWinSet}

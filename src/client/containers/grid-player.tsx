import * as React from 'react';
import {connect} from 'react-redux';
import {IState} from '../reducers/reducer';
import {IPlayer} from '@src/server/RoomManager';
import {
  chooseWallType,
  ENUM_PIECES,
  GRID_WIDTH,
  IPos,
  placePiece,
  placePiecePreview,
} from '@src/common/grid-piece-handler';

const mapStateToProps = (state: IState) => {
  const player = (state.roomState === undefined) ? undefined :
    state.roomState.players.find((p) => p.playerName === state.playerName);

  return {
    player: player,
    posPiece: state.posPiece,
  };
};

interface IProps {
  player: IPlayer | undefined,
  posPiece: IPos,
}

const initFlowRender = (wallType: ENUM_PIECES): ENUM_PIECES[][] => {
  const lineBuild = [...(Array(4).fill(ENUM_PIECES.empty)), wallType];

  const scarBuild = [
    lineBuild,
    lineBuild,
    lineBuild,
    Array(4 + 1).fill(wallType),
  ];

  return [
    Array(4 + 1).fill(wallType),
    ...scarBuild,
    ...scarBuild,
    ...scarBuild,
  ];
};

const GridPlayerComponent = (props: IProps) => {
  /* PLAYERGRID */
  const {player, posPiece} = props;

  if (player === undefined) {
    return (
      <div className={'column'}>
        Waiting server ...
      </div>
    );
  }

  const {flow, grid} = player;

  const wallType = chooseWallType(player);

  const gridWithPiece = (flow.length > 0 && !player.lost && !player.win && !player.isSpectator) ?
    placePiece(placePiecePreview(grid, flow[0], posPiece), flow[0], posPiece) :
    grid;

  const gridRender = gridWithPiece.map(l => [wallType, ...l, wallType]);
  gridRender[3] = Array(GRID_WIDTH + 2).fill(wallType);
  gridRender.push(Array(GRID_WIDTH + 2).fill(wallType));
  gridRender.shift();
  gridRender.shift();
  gridRender.shift();

  /* PIECEFLOW */
  let previewRender = initFlowRender(wallType);

  const piecesRender = flow.filter((e, i) => i > 0 && i < 4);

  if (flow.length > 0 && !player.lost && !player.win && !player.isSpectator) {
    for (let i = 0; i < piecesRender.length; i++) {
      const piece = piecesRender[i];
      previewRender = placePiece(previewRender, piece, {x: 0, y: 1 + i * 5});
    }
  }

  /* add to gridRender */
  previewRender.forEach((l, i) => gridRender[i].push(...l));

  return (
    <div className={'column'}>
      <div>
        <div className={'column'}>
          {gridRender.map((line, i) =>
            <div key={i} className={'row'}>
              {line.map((el, j) => <div key={j} className={'casePlayer + color' + el}/>)}
            </div>,
          )}
        </div>
      </div>
      <div className={'column center'}>
      <span className={'pad font_white font_retro row center'}>
        YOU!{player.master && '(Master)'}{player.lost && '(lost)'}{player.win && '(Win)'}
        {player.isSpectator && '(Viewer)'}
      </span>
        <div className={'row center'}>
        <span className={'pad font_white font_retro'}>
        score:{player.score}
        </span>
          <span className={'pad font_white font_retro'}>
        lines completed:{player.nbLineCompleted}
        </span>
        </div>
      </div>
    </div>
  );
};

const GridPlayer = connect(
  mapStateToProps,
  undefined,
)(GridPlayerComponent);

export {GridPlayer};

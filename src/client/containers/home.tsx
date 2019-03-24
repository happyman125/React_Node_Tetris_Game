import * as React from 'react';
import {connect} from 'react-redux';
import {IState} from '@src/client/reducers/reducer';
import {IRoomPlayersName} from '@src/common/socketEventClient';
import {Dispatch} from 'redux';
import {
  ReduxAction,
  SEND_SUB_ROOMS_PLAYERS_NAME,
  SEND_UN_SUB_ROOMS_PLAYERS_NAME,
} from '@src/client/actions/action-creators';
import {checkRoomPlayerName} from '@src/client/util/checkRoomPlayerName';

const mapStateToProps = (state: IState) => {
  return {
    roomsPlayersName: state.roomsPlayersName,
    playerName: state.playerName,
    roomName: state.roomName,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ReduxAction>) => {
  return {
    subRoomsPlayersName: () => dispatch(SEND_SUB_ROOMS_PLAYERS_NAME()),
    unSubRoomsPlayersName: () => dispatch(SEND_UN_SUB_ROOMS_PLAYERS_NAME()),
  };
};

interface IProps {
  roomsPlayersName: IRoomPlayersName[],
  playerName: string | undefined,
  roomName: string | undefined,
  subRoomsPlayersName: () => void,
  unSubRoomsPlayersName: () => void,
}

interface IStateComponent {
  roomNameInput: string,
  playerNameInput: string,
}

class HomeComponent extends React.Component<IProps, IStateComponent> {
  public readonly state: IStateComponent = {
    roomNameInput: this.props.roomName === undefined ? '' : this.props.roomName,
    playerNameInput: this.props.playerName === undefined ? '' : this.props.playerName,
  };

  public componentDidMount() {
    const {subRoomsPlayersName} = this.props;
    subRoomsPlayersName();
  }

  public componentWillUnmount() {
    const {unSubRoomsPlayersName} = this.props;
    unSubRoomsPlayersName();
  }

  public handleSubmit = (e: any) => {
    e.preventDefault();
    const {roomNameInput, playerNameInput} = this.state;
    const {roomsPlayersName} = this.props;

    if (checkRoomPlayerName(roomNameInput, playerNameInput) &&
      this.checkRoomPlayerNameExiste(roomNameInput, playerNameInput, roomsPlayersName)) {
      window.location.href = `#/game?roomName=${roomNameInput}&playerName=${playerNameInput}`;
    }
  };

  public handleChangeRoom = (e: any) => {
    e.preventDefault();
    this.setState({
      roomNameInput: e.target.value,
    });
  };

  public setRoomName = (roomName: string) => {
    this.setState({
      roomNameInput: roomName,
    });
  };

  public handleChangePlayer = (e: any) => {
    e.preventDefault();
    this.setState({
      playerNameInput: e.target.value,
    });
  };

  public checkRoomPlayerNameExiste = (
    roomName: string,
    playerName: string,
    roomsPlayersName: IRoomPlayersName[],
  ): boolean => {

    for (let i = 0; i < roomsPlayersName.length; i++) {
      if (roomsPlayersName[i].roomName !== roomName) {
        continue;
      }
      for (let j = 0; j < roomsPlayersName[i].playerNames.length; j++) {
        if (roomsPlayersName[i].playerNames[j] === playerName) {
          return false;
        }
      }
    }

    return true;
  };

  public render(): React.ReactNode {

    const {
      handleChangePlayer, handleChangeRoom,
      handleSubmit, setRoomName, checkRoomPlayerNameExiste,
    } = this;
    const {roomsPlayersName} = this.props;
    const {roomNameInput, playerNameInput} = this.state;

    const room = roomsPlayersName.find(e => e.roomName === roomNameInput);
    const playerInRoom = (room) ? room.playerNames : undefined;

    return (
      <div className={'row center font_white pad'}>
        <div className={'color8'}>
          <div className={'row center'}>
            <h1 className={'font_white font_retro'}>TETRIS</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e)} className={'pad'}>
            <label>
              #<input type="text"
                      value={roomNameInput}
                      onChange={(e) => handleChangeRoom(e)}
                      placeholder={'Choose or create room'}/>
            </label>
            <label>
              [<input type="text"
                      value={playerNameInput}
                      onChange={(e) => handleChangePlayer(e)}
                      placeholder={'Your Name'}/>]
            </label>
            <input type="submit" value="Join"/>
          </form>

          {!checkRoomPlayerName(roomNameInput, playerNameInput) &&
          <div className={'column pad font_red'}>
            Player and Room name must have minimum <br/>three characters, letter or number.
          </div>
          }

          {!checkRoomPlayerNameExiste(roomNameInput, playerNameInput, roomsPlayersName) &&
          <div className={'column pad font_red'}>
            A player has already this name in this room.
          </div>
          }

          <div className={'column pad'}>
            <div className={'pad'}>
              Current Room:
            </div>

            {roomsPlayersName.length === 0 &&
            <div>
              No room
            </div>
            }

            {roomsPlayersName.map((r, i) =>
              <button className={'font_retro buttonPlay font_white font_button_home'} key={i}
                      onClick={() => setRoomName(r.roomName)}>{r.roomName}
              </button>,
            )}
          </div>

          {playerInRoom && room &&
          <div className={'column pad'}>
            <div className={'pad'}>
              Current Player in {room.roomName}:
            </div>
            <div className={'pad'}>
              {playerInRoom.map((name, i) =>
                <div key={i} className={'font_retro font_white'}>
                  {name}
                </div>,
              )}
            </div>
          </div>
          }

        </div>
      </div>
    );
  }
}

const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeComponent);

export {Home};

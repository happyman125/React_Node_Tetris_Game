import React from "react";
import {FlowTest} from "./flow-test";
import {GridPlayer} from "./grid-player"
import {store} from "../store"

const App = () =>
  <div>
    <GridPlayer/>
    <p>part flow:</p>
    <FlowTest/>
    <p>Player name: {store.getState().player_name}</p>
    <p>Room name: {store.getState().room_name}</p>
  </div>
;

export default App;

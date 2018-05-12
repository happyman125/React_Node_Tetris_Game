import React from "react";

const Line = (props) => {
  let line_render = [];
  for (let i = 0; i < props.line.length; i++) {
    let part_name = "part_" + props.line[i];
    line_render.push(
      <div key={i} className={part_name}/>
    );
  }
  return (
    <div className="line">
      {line_render}
    </div>
  );
};

const Grid = (props) => {
  let grid_render = [];
  for (let i = 0; i < props.grid.length; i++) {
    grid_render.push(
      <Line key={i} line={props.grid[i]}/>
    );
  }

  return (
    <div className="grid">
      {grid_render}
    </div>
  );
};

export {Grid, Line};
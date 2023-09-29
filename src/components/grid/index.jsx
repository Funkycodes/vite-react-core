import React from 'react';
import clsx from "clsx";
import cn from "./grid.module.scss";

const Grid = ({
  fixed = true,
  margin = "4rem",
  gutter = "1.6rem",
  columns = 12,
  color = "#ff00001f",
  className
}) => {
  return (
    <div style={{
      "--gutter": gutter,
      "--columns": columns,
      "--color": color,
      "--margin": margin,
      "--position": fixed ? "fixed" : "absolute"
    }} className={clsx(cn.grid, className)}>
      {
        Array(columns).fill(1).map((_, idx) => <div key={idx} className={cn.column}></div>)
      }
    </div>
  );
};

export default Grid;

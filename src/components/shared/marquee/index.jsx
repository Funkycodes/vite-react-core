import React, { useRef } from 'react';
import cn from "./marquee.module.scss";

const Marquee = ({
  repeat = 4,
  className = "",
  duration = 5,
  offset = 25,
  inverted = false,
  children,
  ...props }) => {
  const marqueeRef = useRef();
  return (
    <div
      className={`${cn.marquee} ${inverted && cn[ "marquee--inverted" ]}  ${className}`}
      style={{
        "--duration": duration + "s",
        "--offset": offset + "%",
      }}
      {...props}>
      {Array(repeat).fill(children).map((_, i) => (
        <div key={i} className={cn.marquee__inner}
          aria-hidden={i !== 0} data-nosnippet={i !== 0}>
          {children}
        </div>
      ))}
    </div>
  );
};

export default Marquee;

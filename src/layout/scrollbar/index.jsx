import { clamp, mapRange } from "@/animations/utils/math";
import { useLenis } from "@studio-freight/react-lenis";
import { useEventListener, useRect, useWindowSize } from "@studio-lumio/hooks";
import React, { useEffect, useRef, useState } from 'react';

import cn from "./scrollbar.module.scss";

const Scrollbar = ({
  offset = 4,
  minHeight = 24,
  positionRight = 8,
  backgroundColor = "orange",
}) => {
  const [ pointerDown, setPointerDown ] = useState(false);
  const trackRef = useRef();
  const thumbRef = useRef();

  const { height: windowHeight } = useWindowSize();
  const { height: trackHeight } = useRect(trackRef);
  const { height: thumbHeight } = useRect(thumbRef);

  const lenis = useLenis();

  useEventListener("scroll", () => {
    thumbRef.current.style.transform = `translate3d(0, ${lenis.progress * (trackHeight - thumbHeight)}px, 0)`;
  });
  useEffect(() => {
    thumbRef.current.style.height = `${windowHeight / document.body.offsetHeight * trackHeight}px`;
  }, [ trackHeight ]);

  useEventListener("pointermove", (e) => {
    e.preventDefault();
    if (!pointerDown) return;
    const offset = (windowHeight - trackHeight) / 2;
    const y = mapRange(0, windowHeight, e.clientY, offset, trackHeight - offset);
    const progress = clamp(0, y / trackHeight, 1);
    const newPos = lenis.limit * progress;
    lenis.scrollTo(newPos);
  });
  useEventListener("pointerup", () => { setPointerDown(false); });

  return (
    <div className={cn.scrollbar}
      style={{
        "--offset": offset + "px",
        "--bg-color": backgroundColor,
        "--min-height": minHeight + "px",
        "--position-right": positionRight + "px"
      }}>
      <div className={cn.track} ref={trackRef}>
        <div className={cn.thumb} ref={thumbRef} onPointerDown={() => { setPointerDown(true); }}>
        </div>
      </div>
    </div>
  );
};

export default Scrollbar;

import React, { useEffect, useRef } from 'react';
import gsap from "gsap";

import cn from "./transition.module.scss";

function Transition({ transitionStage, setTransitionStage }) {
  const transitionRef = useRef();

  useEffect(() => {
    const animation = gsap
      .timeline({ defaults: { ease: "expo.inOut", duration: 1.5 }, paused: true, onComplete: () => setTransitionStage("ended") })
      .set(transitionRef.current, {
        clipPath: "inset(100% 100% 0% 0%)",
      })
      .to(transitionRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
      })
      .to(transitionRef.current, {
        clipPath: "inset(100% 0% 0% 100%)",
        delay: .75
      })
      .call(() => setTransitionStage("running"), [], 1.5);
    // .set(transitionRef.current, {
    //   top: "unset",
    //   transformOrigin: "center bottom",
    //   bottom: 0
    // }).to(transitionRef.current, {
    //   scaleY: 1
    // }).set(transitionRef.current, {
    //   transformOrigin: "center top",
    //   top: 0,
    //   bottom: "unset"
    // }).to(transitionRef.current, {
    //   scaleY: 0,
    //   delay: 0.25
    // })

    if (transitionStage === "begin") animation.restart();
  }, [ transitionStage ]);

  return (
    <div className={cn.transition} ref={transitionRef}>
      <h1 className={cn.transition__text}>
        Infinitus
      </h1>
      <p className={cn.transition__credits}>
        @studioinfinitus
      </p>
    </div>
  );
}

export default Transition;
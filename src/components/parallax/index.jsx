import { gsap } from "@/utils/gsap";
import { useWindowSize } from "@studio-lumio/hooks";
import { useEffect, useRef } from 'react';

export default function Parallax({
  className,
  children,
  speed = 1,
  id = 'parallax',
  position,
  direction = "vertical"
}) {
  const trigger = useRef();
  const target = useRef();
  const timeline = useRef();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    const y = direction === "vertical"
      ? windowWidth * speed * 0.1
      : 0;
    const x = direction !== "vertical"
      ? windowHeight * speed * 0.1
      : 0;
    const mm = gsap.matchMedia();

    timeline.current = gsap
      .timeline({
        scrollTrigger: {
          id,
          trigger: () => direction === "vertical"
            ? (position === 'top' ? document.body : trigger.current)
            : (position === "left" ? document.body : trigger.current),
          scrub: Math.abs(speed),
          start: () => direction === "vertical"
            ? (position === 'top' ? 'top top' : 'top bottom')
            : (position === "left" ? "left left" : "left right"),
          end: () => direction === "vertical"
            ? (position === 'top' ? '+=100%' : 'bottom top')
            : (position === "left" ? "+=100" : "right left"),
        },
      })
      .fromTo(target.current, {
        y: position === 'top' ? 0 : -y,
        x: position === "left" ? 0 : -x
      },
        {
          y: y,
          x: x,
          ease: 'none'
        });

    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduceMotion } = context.conditions;

        if (reduceMotion) {
          timeline?.current?.from(target.current, { y: 0 });
          timeline?.current?.kill();
        }
      }
    );

    return () => {
      timeline?.current?.kill();
    };
  }, [ id, speed, position, windowWidth ]);

  return (
    <div ref={trigger}>
      <div ref={target} className={className}>
        {children}
      </div>
    </div>
  );
}

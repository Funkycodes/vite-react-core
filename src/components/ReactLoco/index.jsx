import LocomotiveScroll from "locomotive-scroll";
import { useLayoutEffect, useRef } from "react";

export default function ReactLocomotive({
  children,
  lenisOptions,
  autoStart,
  autoResize,
  ...props
}) {

  const [ loco, setLoco ] = useState();

  useLayoutEffect(() => {
    const loco = new LocomotiveScroll({
      lenisOptions,
      autoResize,
      autoStart,
    });
  });
}
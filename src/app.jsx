import React, { useEffect, useState } from 'react';
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { Route, Routes, useLocation } from "react-router-dom";

import Transition from "./components/transition/transition";
import Home from "./pages/Home";
import _404 from "./pages/_404";
import { ScrollTrigger } from "./utils/gsap";

const App = () => {
  const location = useLocation();
  const [ transitionStage, setTransitionStage ] = useState("idle");
  const [ userLocation, setuserLocation ] = useState(location);

  useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (location !== userLocation) {
      setTransitionStage("begin");
    };
  }, [ location, userLocation ]);
  useEffect(() => {
    console.log(transitionStage);
    if (transitionStage === "running")
      setuserLocation(location);
  }, [ transitionStage ]);



  return (
    <ReactLenis root options={{
      lerp: 0.1
    }}>
      <Transition transitionStage={transitionStage} setTransitionStage={setTransitionStage} />
      <Routes location={userLocation}>
        <Route path="/">
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<_404 />} />
      </Routes >
    </ReactLenis>
  );
};

export default App;
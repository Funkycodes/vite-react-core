import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";

import Root from "./pages/root";
import _404 from "./pages/_404";
import Home from "./pages/Home";
import Transition from "./components/shared/transition/transition";
import Preloader from "./components/shared/preloader";
import { ReactLenis } from "@studio-freight/react-lenis";
import Scrollbar from "./components/shared/scrollbar";

const App = () => {
  const location = useLocation();
  const [ transitionStage, setTransitionStage ] = useState("idle");
  const [ userLocation, setuserLocation ] = useState(location);

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
      <Scrollbar />
      <Preloader />
      <Transition transitionStage={transitionStage} setTransitionStage={setTransitionStage} />
      <Routes location={userLocation}>
        <Route path="/" element={<Root />} >
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<_404 />} />
      </Routes >
    </ReactLenis>
  );
};

export default App;
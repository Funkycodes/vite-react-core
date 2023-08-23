import React, { useEffect, useState } from 'react';
import LocomotiveScroll from "locomotive-scroll";
import { Route, Routes, useLocation } from "react-router-dom";

import Root from "./pages/root";
import _404 from "./pages/_404";
import Home from "./pages/Home/home";
import About from "./pages/About/about";
import Transition from "./components/shared/transition/transition";
import Preloader from "./components/shared/preloader";

const App = () => {
  const location = useLocation();
  const [ transitionStage, setTransitionStage ] = useState("idle");
  const [ userLocation, setuserLocation ] = useState(location);

  useEffect(() => {
    const loco = new LocomotiveScroll({});
  }, []);
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
    <>
      <Preloader />
      <Transition transitionStage={transitionStage} setTransitionStage={setTransitionStage} />
      <Routes location={userLocation}>
        <Route path="/" element={<Root />} >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="*" element={<_404 />} />
      </Routes >
    </>
  );
};

export default App;
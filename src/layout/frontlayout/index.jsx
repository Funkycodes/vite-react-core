import { useIsomorphicLayoutEffect } from "@studio-lumio/hooks";
import React, { useCallback, useRef } from 'react';
import Preloader from "../preloader";
import Scrollbar from "../scrollbar";
import cn from "./layout.module.scss";

const FrontLayout = ({ children, page }) => {
  const resetRef = useRef();
  const hasInit = useRef();
  const preloaded = useRef(false);

  const init = useCallback(async () => {
    const App = (await import("@/animations")).default;
    new App({ page });
  }, []);

  useIsomorphicLayoutEffect(() => {
    !hasInit.current && init();
    console.log(typeof resetRef.current);
    return () => {
      hasInit.current = true;
    };
  }, [ init, resetRef.current ]);
  preloaded.current = sessionStorage.getItem("preloaded");

  return (
    <>
      <Scrollbar />
      {!preloaded.current && <Preloader />}
      <main data-main className={cn.layout}>
        <section data-animation={page} className={cn.child}>
          {children}
        </section>
      </main>
    </>
  );
};

export default FrontLayout;

import Grid from "@/components/grid";
import Parallax from "@/components/parallax";
import FrontLayout from "@/layout/frontlayout";
import clsx from "clsx";
import React from 'react';
import { Link } from "react-router-dom";
import cn from "./home.module.scss";

const Home = () => {
  return (
    <FrontLayout page="home">
      <div className={cn.content}>
        {import.meta.env.DEV && <Grid fixed={false} gutter="3.2rem" margin="6rem" className={cn.grid} />}
        <div className={cn.push}>
          <Link to={"/ridim"} >Hello </Link>
        </div>
        <div className={clsx(cn.flex)}>
          <Parallax>
            <div style={{
              padding: "1.8rem 4.8rem",
              fontSize: "1.8rem",
              background: "black",
              color: "white",
              borderRadius: "1.6rem"
            }}>
              Infinitus
            </div>
          </Parallax>
          <Parallax speed={-0.2}>
            <div style={{
              padding: "1.8rem 4.8rem",
              fontSize: "1.8rem",
              background: "black",
              color: "white",
              borderRadius: "1.6rem"
            }}>
              React
            </div>
          </Parallax>
          <Parallax position={"top"} speed={-0.2} direction="horizontal">
            <div style={{
              padding: "1.8rem 4.8rem",
              fontSize: "1.8rem",
              background: "black",
              color: "white",
              borderRadius: "1.6rem"
            }}>
              Template
            </div>
          </Parallax>
        </div>
      </div>
    </FrontLayout>
  );
};
export default Home;
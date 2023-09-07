import React from 'react';
import cn from "./home.module.scss";

const Home = () => {
  return (
    <section className={cn.home} data-page="home">
      <div className={cn.grid}>
        {
          Array(12).fill(0).map((_, idx) => <div key={idx} className={cn.column}></div>)
        }
      </div>
    </section>
  );
};

export default Home;

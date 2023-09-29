import React, { useEffect, useRef, useState } from 'react';
/***Third Party Imports */
import { gsap } from "@/utils/gsap";
import { useLenis } from "@studio-freight/react-lenis";
/*** File Imports ****/
import Marquee from "@/components/shared/marquee";
/***Utils */
import { random } from "@/animations/utils/math";
import cn from "./preloader.module.scss";

export default function Preloader() {
  const lenis = useLenis();
  const element = useRef();
  const [ delay, setDelay ] = useState(50);
  const [ progress, setProgress ] = useState(0);

  useEffect(() => lenis?.stop(), [ lenis ]);
  useEffect(() => {
    const id = setTimeout(() => {
      const rand = Math.round(random(1, 15));
      const current = (rand + progress) < 100 ? (rand + progress) : 100;
      setProgress(current);
      setDelay(random(100, 500));
    }, delay);
    return () => clearTimeout(id);
  }, [ delay ]);

  useEffect(() => {
    const tl = gsap
      .timeline({ paused: true })
      .to(element.current, {
        y: "-100%",
        duration: 1.5,
        ease: "expo.inOut",
      }).call(() => {
        lenis.start();
        sessionStorage.setItem("preloaded", "true");
      });

    if (progress === 100)
      setTimeout(() => tl.restart(), 1200);

    return () => {
      tl.kill();
    };
  }, [ progress ]);

  return (
    <div className={cn.preloader} ref={element}>
      <div className={cn.preloader__inner}>
        <div className={cn.preloader__header}>
          <svg width="113" height="59" viewBox="0 0 113 59" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_306_73)">
              <path d="M67.3163 9.12354L66.8294 12.5126L69.7637 12.9358L70.2506 9.54999L67.3163 9.12354Z" fill="#16FF9F" />
              <path d="M66.5457 15.2231C65.7589 20.7477 64.9722 26.2755 64.1854 31.8066C64.028 32.9055 63.9494 34.0144 63.95 35.1246V42.8784C62.5076 40.8775 60.4977 39.877 57.9203 39.877C55.343 39.877 53.3212 40.7267 51.8552 42.4261C50.3204 44.1255 49.554 46.4182 49.5562 49.3044C49.5562 52.1474 50.3225 54.4294 51.8552 56.1503C53.3879 57.8712 55.4096 58.7328 57.9203 58.7349C60.5945 58.7349 62.6506 57.6645 64.0887 55.5236V58.3149H66.7456V35.929C66.743 34.2849 66.8583 32.6427 67.0906 31.0151L69.3058 15.6302L66.5457 15.2231ZM62.4861 54.3766C61.4414 55.6022 60.0356 56.2149 58.2686 56.2149C56.5016 56.2149 55.0958 55.6205 54.051 54.4316C53.0063 53.2448 52.484 51.581 52.484 49.44C52.484 47.2991 53.0117 45.5814 54.0672 44.287C54.5737 43.6692 55.2151 43.1764 55.9419 42.8464C56.6687 42.5165 57.4614 42.3583 58.2589 42.3841C60.0259 42.3841 61.4317 43.0012 62.4765 44.2353C63.5212 45.4694 64.0435 47.157 64.0435 49.2979C64.05 51.4754 63.5308 53.1683 62.4861 54.3766Z" fill="#16FF9F" />
              <path d="M2.75366 56.8C0.941532 55.3332 0.0236458 53.1449 0 50.2351H3.03096C3.1019 54.308 5.53096 56.3455 10.3182 56.3477C12.341 56.3477 13.8919 55.9513 14.971 55.1587C16.0501 54.3661 16.5875 53.2138 16.5832 51.7018C16.6064 51.1641 16.496 50.6291 16.2619 50.1447C16.0278 49.6603 15.6773 49.2418 15.2419 48.9266C14.3498 48.2611 12.787 47.6849 10.5535 47.1982L8.35771 46.7071C5.84911 46.1256 3.96712 45.2823 2.71174 44.1774C1.45637 43.0725 0.830827 41.5185 0.835126 39.5154C0.806601 38.5985 1.00131 37.6884 1.40242 36.8638C1.80354 36.0392 2.399 35.3248 3.13737 34.7824C4.67004 33.6064 6.72615 33.0184 9.30569 33.0184C10.8466 32.9944 12.3818 33.2124 13.8554 33.6645C14.9917 33.9907 16.0283 34.5972 16.8702 35.4285C17.5575 36.135 18.0968 36.972 18.4566 37.8904C18.8029 38.83 18.985 39.8223 18.9951 40.8239H15.9964C15.8588 39.0534 15.2838 37.7547 14.2713 36.9276C13.2588 36.1005 11.6036 35.6881 9.30569 35.6902C7.5645 35.6902 6.21992 36.0133 5.28161 36.7014C4.82962 37.0142 4.46338 37.4359 4.21659 37.9276C3.9698 38.4193 3.85038 38.9654 3.86931 39.5154C3.84186 40.0488 3.93755 40.5813 4.14894 41.0716C4.36033 41.5619 4.68173 41.9968 5.08814 42.3423C5.8792 43.0165 7.41295 43.6099 9.6894 44.1225L11.8852 44.6136C14.626 45.2188 16.6015 46.0803 17.8117 47.1982C19.022 48.316 19.626 49.814 19.6239 51.6921C19.6239 53.9515 18.7984 55.7327 17.1475 57.0358C15.4966 58.3389 13.2201 58.9936 10.3182 59.0001C7.09374 59.0001 4.57224 58.2667 2.75366 56.8Z" fill="black" />
              <path d="M30.1097 42.8655H26.4145V54.5641C26.4145 55.5915 27.1013 56.1019 28.4717 56.1019H30.1097V58.441C29.3423 58.5121 28.6802 58.5476 28.1234 58.5476C25.129 58.5476 23.6307 57.3016 23.6286 54.8096V42.8558H20.6653V40.4134H23.6286V35.325H26.4145V40.4231H30.1097V42.8655Z" fill="black" />
              <path d="M44.0263 40.4231H46.8154V58.441H44.1746V55.753C42.801 57.825 40.919 58.861 38.5287 58.861C36.5295 58.861 34.9721 58.3139 33.8565 57.2198C32.7408 56.1256 32.183 54.5889 32.183 52.6095V40.4231H34.9721V52.3381C34.9721 55.0132 36.3425 56.3518 39.0833 56.3539C39.7276 56.3536 40.3653 56.2236 40.9585 55.9717C41.5517 55.7197 42.0884 55.3509 42.5366 54.8872C43.534 53.9072 44.0327 52.4867 44.0327 50.6258L44.0263 40.4231Z" fill="black" />
              <path d="M70.3118 58.441V40.4231H73.101V58.441H70.3118Z" fill="black" />
              <path d="M84.4316 58.8611C81.8972 58.8611 79.8056 57.9996 78.1568 56.2765C76.5081 54.5535 75.6945 52.2715 75.716 49.4306C75.716 46.5638 76.5296 44.2818 78.1568 42.5846C79.7841 40.8874 81.8757 40.0258 84.4316 40C86.9617 40 89.0522 40.8615 90.7031 42.5846C92.354 44.3077 93.1676 46.5897 93.144 49.4306C93.144 52.293 92.3303 54.5739 90.7031 56.2733C89.0758 57.9727 86.9853 58.8353 84.4316 58.8611ZM84.4316 56.3476C86.1943 56.3476 87.6001 55.7305 88.6491 54.4964C89.6981 53.2622 90.2205 51.5736 90.2162 49.4306C90.2162 47.2401 89.6938 45.5397 88.6491 44.3292C87.6044 43.1188 86.1986 42.5135 84.4316 42.5135C82.6646 42.5135 81.2587 43.1188 80.214 44.3292C79.1693 45.5397 78.6459 47.2401 78.6437 49.4306C78.6437 51.5952 79.1672 53.2827 80.214 54.4932C81.2609 55.7036 82.6667 56.3218 84.4316 56.3476Z" fill="black" />
              <path d="M95.0335 58.4412V54.9487H98.5546V58.4412H95.0335Z" fill="black" />
              <path d="M4.69153 24.6086L8.23517 0L11.1372 0.419998L7.59029 25.0286L4.69153 24.6086Z" fill="black" />
              <path d="M26.5854 10.8035C27.5334 12.0441 27.8666 13.6444 27.585 15.6044L25.8502 27.6681L23.0901 27.2674L24.7862 15.4817C25.1666 12.8324 23.9983 11.3118 21.2812 10.9198C20.6431 10.829 19.9933 10.8681 19.3706 11.0346C18.7478 11.2011 18.165 11.4917 17.657 11.8891C16.5327 12.7075 15.8384 14.0375 15.574 15.879L14.1198 25.9719L11.3596 25.5745L13.9392 7.73755L16.5639 8.11555L16.1802 10.7777C17.8311 8.92323 19.841 8.16939 22.2098 8.51616C24.181 8.80047 25.6396 9.56292 26.5854 10.8035Z" fill="black" />
              <path d="M33.2664 8.66155C33.7458 5.32095 35.6417 3.88973 38.9543 4.36788C39.3928 4.4325 39.9732 4.53911 40.7052 4.69096L40.3827 7.04294L38.7931 6.81356C37.2067 6.5831 36.2931 7.31002 36.0523 8.99432L35.7782 10.894L39.5734 11.4432L39.2252 13.8631L35.43 13.3138L33.2084 28.7278L30.4483 28.3304L32.6538 12.9229L29.7195 12.4997L30.0678 10.0799L33.002 10.5031L33.2664 8.66155ZM39.7475 29.6776L42.327 11.8406L45.0872 12.2412L42.5076 30.075L39.7475 29.6776ZM43.088 5.74418L46.019 6.16741L45.5321 9.55324L42.6011 9.13001L43.088 5.74418Z" fill="black" />
              <path d="M61.2641 15.8307C62.2142 17.0713 62.5474 18.6716 62.2637 20.6316L60.5289 32.6952L57.7688 32.2946L59.4649 20.5088C59.8453 17.8596 58.6792 16.339 55.9664 15.947C55.3282 15.8562 54.6784 15.8952 54.0557 16.0617C53.433 16.2283 52.8502 16.5189 52.3421 16.9162C51.1964 17.7217 50.4956 19.0464 50.2398 20.89L48.7856 30.9829L46.0255 30.5855L48.605 12.7485L51.2264 13.1265L50.8427 15.7887C52.4936 13.9342 54.5035 13.1804 56.8724 13.5271C58.8458 13.8071 60.3097 14.575 61.2641 15.8307Z" fill="black" />
              <path d="M80.1624 19.7819L76.5059 19.2521L74.8389 30.8311C74.6949 31.8456 75.3 32.4508 76.6543 32.6468L78.2665 32.8826L77.944 35.1958C77.1734 35.1571 76.5124 35.0957 75.961 35.0182C72.9945 34.5874 71.6887 33.14 72.0433 30.676L73.7458 18.8547L70.8148 18.4315L71.1631 16.0116L74.0941 16.4349L74.8067 11.3884L77.5668 11.7858L76.8542 16.8322L80.5107 17.3621L80.1624 19.7819Z" fill="black" />
              <path d="M94.2854 19.3522L97.0552 19.7528L94.4757 37.5865L91.8542 37.2085L92.2379 34.5464C90.587 36.4008 88.5771 37.1547 86.2082 36.8079C84.2284 36.5236 82.7656 35.7601 81.8198 34.5173C80.874 33.2745 80.5408 31.6764 80.8202 29.7229L82.5453 17.656L85.3054 18.0566L83.6093 29.8424C83.2289 32.4916 84.395 34.0133 87.1078 34.4075C87.7459 34.4973 88.3956 34.4579 89.0181 34.2914C89.6407 34.1249 90.2236 33.8347 90.7321 33.4382C91.8607 32.6155 92.5571 31.2812 92.8215 29.4353L94.2854 19.3522Z" fill="black" />
              <path d="M97.7001 32.2656L100.496 32.6695C100.463 34.0285 100.769 35.043 101.411 35.7128C102.054 36.3827 103.158 36.8307 104.723 37.0568C107.578 37.466 109.136 36.7499 109.398 34.9084C109.47 34.5565 109.451 34.1921 109.343 33.8496C109.235 33.5071 109.042 33.1977 108.782 32.9505C108.258 32.4487 107.245 31.9371 105.745 31.4159L104.133 30.8667C100.528 29.639 98.9286 27.6198 99.3349 24.809C99.4126 24.0972 99.6596 23.4144 100.055 22.8179C100.451 22.2215 100.983 21.7288 101.608 21.3812C102.898 20.6381 104.544 20.412 106.548 20.7027C111.262 21.3855 113.392 23.7041 112.939 27.6586L110.179 27.2612C110.299 25.9689 110.04 24.9996 109.402 24.3535C108.763 23.7073 107.697 23.283 106.203 23.0806C105.007 22.9061 104.055 23.003 103.343 23.3713C103.001 23.5409 102.707 23.7946 102.489 24.1087C102.272 24.4229 102.137 24.7872 102.098 25.1676C102.028 25.5046 102.044 25.8539 102.144 26.1832C102.244 26.5124 102.426 26.811 102.672 27.0512C103.169 27.5229 104.041 27.9902 105.29 28.4533L106.832 28.9929C108.953 29.7445 110.433 30.5932 111.272 31.5387C112.11 32.4853 112.423 33.6807 112.216 35.1345C111.971 36.8145 111.156 38.0314 109.769 38.7853C108.383 39.5391 106.586 39.7545 104.378 39.4314C99.6165 38.7508 97.3906 36.3622 97.7001 32.2656Z" fill="black" />
            </g>
            <defs>
              <clipPath id="clip0_306_73">
                <rect width="113" height="59" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className={cn.preloader__main}>
          <Marquee
            inverted={true}
            repeat={8}
            className={cn.marquee}>
            <div style={{
              display: "flex",
              gap: "8px",
              paddingInline: "1rem"
            }}>
              <p>Exciting Things Are Coming! 🎉</p>
            </div>
          </Marquee>
          <Marquee
            repeat={8}
            className={cn.marquee}>
            <div style={{
              display: "flex",
              gap: "8px",
              paddingInline: "1rem"
            }}>
              <p>We are rebranding to keep creating design that matters</p>
            </div>
          </Marquee>
        </div>
        <div className={cn.preloader__footer}>
          <p className={cn.preloader__progress} >
            {progress}&#37;
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Engine, type ISourceOptions } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

export default function BackgroundParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: true, zIndex: -1 },
      background: { color: "#000000" },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: {
          value: 200,
          density: { enable: false, area: 800 },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: { enable: false, speed: 3, sync: false },
        },
        size: { value: 3 },
        move: {
          angle: { value: 10, offset: 0 },
          enable: true,
          speed: 5,
          direction: "right",
          random: false,
          straight: true,
          outModes: "out",
        },
        zIndex: {
          value: 5,
          opacityRate: 0.5,
        },
        groups: {
          z5000: {
            number: { value: 70 },
            zIndex: { value: 5000 },
          },
          z7500: {
            number: { value: 30 },
            zIndex: { value: 75 },
          },
          z2500: {
            number: { value: 50 },
            zIndex: { value: 25 },
          },
          z1000: {
            number: { value: 40 },
            zIndex: { value: 10 },
          },
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: { enable: false, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
          resize: { enable: true, delay: 0 },
        },
        modes: {
          push: {
            quantity: 4,
            groups: ["z5000", "z7500", "z2500", "z1000"],
          },
          repulse: { distance: 200 },
        },
      },
      emitters: {
        position: { y: 55, x: -30 },
        rate: { delay: 7, quantity: 1 },
        size: { width: 0, height: 0 },
        particles: {
          shape: {
            type: "images",
            options: {
              images: [
                {
                  src: "https://particles.js.org/images/amongus_blue.png",
                  width: 205,
                  height: 267,
                },
                {
                  src: "https://particles.js.org/images/amongus_cyan.png",
                  width: 207,
                  height: 265,
                },
                {
                  src: "https://particles.js.org/images/amongus_green.png",
                  width: 204,
                  height: 266,
                },
                {
                  src: "https://particles.js.org/images/amongus_lime.png",
                  width: 206,
                  height: 267,
                },
                {
                  src: "https://particles.js.org/images/amongus_orange.png",
                  width: 205,
                  height: 265,
                },
                {
                  src: "https://particles.js.org/images/amongus_pink.png",
                  width: 205,
                  height: 265,
                },
                {
                  src: "https://particles.js.org/images/amongus_red.png",
                  width: 204,
                  height: 267,
                },
                {
                  src: "https://particles.js.org/images/amongus_white.png",
                  width: 205,
                  height: 267,
                },
              ],
            },
          },
          opacity: { value: 1 },
          size: { value: 40 },
          move: {
            speed: 10,
            straight: true,
            outModes: { default: "destroy", left: "none" },
          },
          zIndex: { value: 0 },
          rotate: {
            value: { min: 0, max: 360 },
            animation: {
              enable: true,
              speed: 10,
              sync: true,
            },
          },
        },
      },
    }),
    []
  );

  if (!init) return null;

  return <Particles id="tsparticles" options={options} />;
}

"use client"
import { type ReactNode } from "react"

export function GlowingShadow({ children }: { children: ReactNode }) {
  return (
    <>
      <style jsx>{`
        @property --hue { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --rotate { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --bg-y { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --bg-x { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --glow-translate-y { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --bg-size { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --glow-opacity { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --glow-blur { syntax: "<number>"; inherits: true; initial-value: 0; }
        @property --glow-scale { syntax: "<number>"; inherits: true; initial-value: 2; }
        @property --glow-radius { syntax: "<number>"; inherits: true; initial-value: 2; }
        
        .glow-container {
          --card-color: #FDF6E3;
          --card-radius: 1.5rem;
          --border-width: 3px;
          --bg-size: 1;
          --rotate: 0;
          --animation-speed: 4s;
          --interaction-speed: 0.55s;
          --glow-scale: 1.1;
          --scale-factor: 1;
          --glow-blur: 8;
          --glow-opacity: 0.8;
          --glow-radius: 100;
          --glow-rotate-unit: 1deg;

          width: 100%;
          height: 100%;
          display: flex;
          position: relative;
          z-index: 2;
          border-radius: var(--card-radius);
          cursor: pointer;
        }

        .glow-container:before, .glow-container:after {
          content: ""; display: block; position: absolute; width: 100%; height: 100%; border-radius: var(--card-radius);
        }

        .glow-content {
          position: relative; width: 100%; height: 100%; background: var(--card-color);
          border-radius: calc(var(--card-radius) * 0.9); display: flex; flex-direction: column; overflow: hidden;
        }

        .glow-content:before {
          content: ""; display: block; position: absolute;
          width: calc(100% + var(--border-width)); height: calc(100% + var(--border-width));
          border-radius: calc(var(--card-radius) * 0.9); box-shadow: 0 0 20px rgba(0,0,0,0.1);
          mix-blend-mode: color-burn; z-index: -1;
          background: #5C3317 radial-gradient(30% 30% at calc(var(--bg-x) * 1%) calc(var(--bg-y) * 1%), #ffc0cb calc(0% * var(--bg-size)), #00008B calc(40% * var(--bg-size)), transparent 100%);
          animation: rotate-bg var(--animation-speed) linear infinite; transition: --bg-size var(--interaction-speed) ease;
        }

        .glow {
          --glow-translate-y: 0; display: block; position: absolute; width: 100%; height: 100%;
          animation: rotate var(--animation-speed) linear infinite; transform: rotateZ(calc(var(--rotate) * var(--glow-rotate-unit)));
          transform-origin: center; border-radius: calc(var(--glow-radius) * 10vw);
        }

        .glow:after {
          content: ""; display: block; z-index: -2; filter: blur(calc(var(--glow-blur) * 10px));
          width: 130%; height: 130%; left: -15%; top: -15%; background: #ffc0cb; position: relative;
          border-radius: calc(var(--glow-radius) * 10vw);
          transform: scaleY(calc(var(--glow-scale) * var(--scale-factor) / 1.1)) scaleX(calc(var(--glow-scale) * var(--scale-factor) * 1.2)) translateY(calc(var(--glow-translate-y) * 1%));
          opacity: var(--glow-opacity);
        }

        .glow-container:hover .glow-content:before { --bg-size: 15; animation-play-state: paused; }
        .glow-container:hover .glow { --glow-blur: 2; --glow-opacity: 0.6; --glow-scale: 1.2; --glow-radius: 0; --rotate: 900; --glow-rotate-unit: 0; --scale-factor: 1.05; animation-play-state: paused; }
        .glow-container:hover .glow:after {
          --glow-translate-y: 0; animation-play-state: paused; background: #00008B;
          transition: background 0.5s ease, --glow-translate-y 0s ease, --glow-blur 0.05s ease, --glow-opacity 0.05s ease, --glow-scale 0.05s ease, --glow-radius 0.05s ease;
        }

        @keyframes rotate-bg { 0% { --bg-x: 0; --bg-y: 0; } 25% { --bg-x: 100; --bg-y: 0; } 50% { --bg-x: 100; --bg-y: 100; } 75% { --bg-x: 0; --bg-y: 100; } 100% { --bg-x: 0; --bg-y: 0; } }
        @keyframes rotate { from { --rotate: -70; --glow-translate-y: -65; } 25%, 50%, 60%, 75%, 85% { --glow-translate-y: -65; } to { --rotate: calc(360 - 70); --glow-translate-y: -65; } }
      `}</style>
      <div className="glow-container">
        <span className="glow"></span>
        <div className="glow-content">{children}</div>
      </div>
    </>
  )
}
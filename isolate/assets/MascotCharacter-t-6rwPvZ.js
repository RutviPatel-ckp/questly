import{j as e}from"./framer-motion-DpmbhtXL.js";import{r as l}from"./react-vendor-D_i4JqN8.js";function w({color:r,size:s=128,isTalking:t=!1,className:m=""}){const[x,n]=l.useState(!1),[a,p]=l.useState(!1),i=l.useRef(null);l.useRef(null),l.useEffect(()=>(t?i.current=setInterval(()=>{n(c=>!c)},170):(n(!1),i.current&&(clearInterval(i.current),i.current=null)),()=>{i.current&&clearInterval(i.current)}),[t]),l.useEffect(()=>{let c;const d=()=>{const u=2e3+Math.random()*3e3;c=setTimeout(()=>{p(!0),setTimeout(()=>{p(!1),d()},150)},u)};return d(),()=>clearTimeout(c)},[]);const f=y(r,20),o=y(r,-15),h=y(r,30);return e.jsxs("svg",{width:s,height:s,viewBox:"0 0 120 130",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:m,role:"img","aria-label":"Mascot character",children:[e.jsx("style",{children:`
        @keyframes mascot-breathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-2px); }
        }
        @keyframes mascot-talk-body {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.01) rotate(-1deg); }
          75% { transform: scale(1.01) rotate(1deg); }
        }
        @keyframes mascot-arm-wave-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-18deg); }
        }
        @keyframes mascot-arm-wave-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }
        .mascot-body-idle {
          animation: mascot-breathe 3.5s ease-in-out infinite;
          transform-origin: 60px 70px;
        }
        .mascot-body-talking {
          animation: mascot-talk-body 0.4s ease-in-out infinite;
          transform-origin: 60px 70px;
        }
        .mascot-arm-left-idle {
          transform-origin: 22px 75px;
          transition: transform 0.3s ease;
        }
        .mascot-arm-left-talking {
          animation: mascot-arm-wave-left 0.5s ease-in-out infinite;
          transform-origin: 22px 75px;
        }
        .mascot-arm-right-idle {
          transform-origin: 98px 75px;
          transition: transform 0.3s ease;
        }
        .mascot-arm-right-talking {
          animation: mascot-arm-wave-right 0.5s ease-in-out infinite 0.1s;
          transform-origin: 98px 75px;
        }
        .mascot-eye-open {
          transition: ry 0.08s ease, cy 0.08s ease;
        }
        .mascot-eye-blink {
          ry: 1.5;
          transition: ry 0.06s ease, cy 0.06s ease;
        }
      `}),e.jsx("ellipse",{cx:"60",cy:"124",rx:"28",ry:"5",fill:"black",opacity:"0.1"}),e.jsx("g",{className:t?"mascot-arm-left-talking":"mascot-arm-left-idle",children:e.jsx("ellipse",{cx:"18",cy:"78",rx:"10",ry:"16",fill:f,stroke:o,strokeWidth:"1.5",strokeLinecap:"round"})}),e.jsx("g",{className:t?"mascot-arm-right-talking":"mascot-arm-right-idle",children:e.jsx("ellipse",{cx:"102",cy:"78",rx:"10",ry:"16",fill:f,stroke:o,strokeWidth:"1.5",strokeLinecap:"round"})}),e.jsxs("g",{className:t?"mascot-body-talking":"mascot-body-idle",children:[e.jsx("ellipse",{cx:"60",cy:"68",rx:"36",ry:"40",fill:r,stroke:o,strokeWidth:"1.5"}),e.jsx("ellipse",{cx:"58",cy:"60",rx:"22",ry:"24",fill:f,opacity:"0.4"}),e.jsx("ellipse",{cx:"38",cy:"72",rx:"7",ry:"4",fill:h,opacity:"0.5"}),e.jsx("ellipse",{cx:"82",cy:"72",rx:"7",ry:"4",fill:h,opacity:"0.5"}),e.jsx("ellipse",{cx:"47",cy:"60",rx:"5",ry:a?1.5:5.5,fill:"white",className:"mascot-eye-open"}),!a&&e.jsx("ellipse",{cx:"48",cy:"59",rx:"2.5",ry:"2.8",fill:"#1a1a2e"}),!a&&e.jsx("ellipse",{cx:"49",cy:"57.5",rx:"1",ry:"1",fill:"white"}),e.jsx("ellipse",{cx:"73",cy:"60",rx:"5",ry:a?1.5:5.5,fill:"white",className:"mascot-eye-open"}),!a&&e.jsx("ellipse",{cx:"74",cy:"59",rx:"2.5",ry:"2.8",fill:"#1a1a2e"}),!a&&e.jsx("ellipse",{cx:"75",cy:"57.5",rx:"1",ry:"1",fill:"white"}),x?e.jsx("ellipse",{cx:"60",cy:"80",rx:"6",ry:"5",fill:"#1a1a2e",stroke:"#1a1a2e",strokeWidth:"0.5"}):e.jsx("path",{d:"M 53 79 Q 60 85 67 79",stroke:"#1a1a2e",strokeWidth:"2",strokeLinecap:"round",fill:"none"})]}),e.jsx("ellipse",{cx:"48",cy:"108",rx:"10",ry:"5",fill:o}),e.jsx("ellipse",{cx:"72",cy:"108",rx:"10",ry:"5",fill:o})]})}function y(r,s){if(!r.startsWith("#"))return r;const t=parseInt(r.replace("#",""),16),m=Math.min(255,Math.max(0,(t>>16&255)+s)),x=Math.min(255,Math.max(0,(t>>8&255)+s)),n=Math.min(255,Math.max(0,(t&255)+s));return`#${(m<<16|x<<8|n).toString(16).padStart(6,"0")}`}export{w as M};

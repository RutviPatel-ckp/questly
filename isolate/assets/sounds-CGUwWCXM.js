import{c as d}from"./index-BDWbM9ze.js";import{j as s}from"./framer-motion-6UB2cudr.js";import{r as u}from"./react-vendor-Ck15cxrg.js";const x=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],V=d("zap",x);function w({trigger:n,duration:t=2e3,color:a="#fbbf24",type:e="confetti"}){const[o,c]=u.useState([]);return u.useEffect(()=>{if(!n)return;const i=e==="confetti"?24:12,m=e==="confetti"?["●","■","▲","★","♦"]:["✦","✧","⋆","·","°"],f=Array.from({length:i},(h,y)=>({id:Date.now()+y,x:(Math.random()-.5)*300,y:-(Math.random()*250+80),rotation:Math.random()*720-360,scale:.5+Math.random()*1,delay:Math.random()*300,shape:m[Math.floor(Math.random()*m.length)]}));c(f);const p=setTimeout(()=>c([]),t);return()=>clearTimeout(p)},[n,t,e]),o.length===0?null:s.jsxs("div",{className:"pointer-events-none fixed inset-0 z-50 overflow-hidden",children:[o.map(i=>s.jsx("span",{className:"confetti-particle",style:{position:"fixed",left:"50%",top:"40%",fontSize:`${14*i.scale}px`,color:a,animationDuration:`${t}ms`,animationDelay:`${i.delay}ms`,"--tx":`${i.x}px`,"--ty":`${i.y}px`,"--rot":`${i.rotation}deg`},children:i.shape},i.id)),s.jsx("style",{children:`
        .confetti-particle {
          animation: confetti-burst ease-out forwards;
          opacity: 0;
        }
        @keyframes confetti-burst {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3);
          }
        }
      `})]})}let l=null;function r(){return l||(l=new AudioContext),l}function v(){try{const n=r(),t=n.currentTime;[523.25,659.25].forEach((a,e)=>{const o=n.createOscillator(),c=n.createGain();o.type="sine",o.frequency.value=a,c.gain.setValueAtTime(.15,t+e*.1),c.gain.exponentialRampToValueAtTime(.001,t+e*.1+.3),o.connect(c),c.connect(n.destination),o.start(t+e*.1),o.stop(t+e*.1+.3)})}catch{}}function M(){try{const n=r(),t=n.currentTime,a=n.createOscillator(),e=n.createGain();a.type="triangle",a.frequency.setValueAtTime(392,t),a.frequency.linearRampToValueAtTime(330,t+.25),e.gain.setValueAtTime(.12,t),e.gain.exponentialRampToValueAtTime(.001,t+.35),a.connect(e),e.connect(n.destination),a.start(t),a.stop(t+.35)}catch{}}function q(){try{const n=r(),t=n.currentTime;[523.25,659.25,783.99].forEach((a,e)=>{const o=n.createOscillator(),c=n.createGain();o.type="sine",o.frequency.value=a,c.gain.setValueAtTime(.15,t+e*.12),c.gain.exponentialRampToValueAtTime(.001,t+e*.12+.5),o.connect(c),c.connect(n.destination),o.start(t+e*.12),o.stop(t+e*.12+.5)})}catch{}}function R(){try{const n=r(),t=n.currentTime,a=n.createOscillator(),e=n.createGain();a.type="sine",a.frequency.setValueAtTime(800,t),a.frequency.exponentialRampToValueAtTime(400,t+.08),e.gain.setValueAtTime(.08,t),e.gain.exponentialRampToValueAtTime(.001,t+.1),a.connect(e),e.connect(n.destination),a.start(t),a.stop(t+.1)}catch{}}export{w as C,V as Z,v as a,M as b,q as c,R as p};

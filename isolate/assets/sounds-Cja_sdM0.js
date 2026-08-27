import{j as r}from"./framer-motion-6UB2cudr.js";import{r as m}from"./react-vendor-Ck15cxrg.js";function h({trigger:n,duration:t=2e3,color:a="#fbbf24",type:e="confetti"}){const[o,c]=m.useState([]);return m.useEffect(()=>{if(!n)return;const i=e==="confetti"?24:12,u=e==="confetti"?["●","■","▲","★","♦"]:["✦","✧","⋆","·","°"],f=Array.from({length:i},(x,y)=>({id:Date.now()+y,x:(Math.random()-.5)*300,y:-(Math.random()*250+80),rotation:Math.random()*720-360,scale:.5+Math.random()*1,delay:Math.random()*300,shape:u[Math.floor(Math.random()*u.length)]}));c(f);const p=setTimeout(()=>c([]),t);return()=>clearTimeout(p)},[n,t,e]),o.length===0?null:r.jsxs("div",{className:"pointer-events-none fixed inset-0 z-50 overflow-hidden",children:[o.map(i=>r.jsx("span",{className:"confetti-particle",style:{position:"fixed",left:"50%",top:"40%",fontSize:`${14*i.scale}px`,color:a,animationDuration:`${t}ms`,animationDelay:`${i.delay}ms`,"--tx":`${i.x}px`,"--ty":`${i.y}px`,"--rot":`${i.rotation}deg`},children:i.shape},i.id)),r.jsx("style",{children:`
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
      `})]})}let l=null;function s(){return l||(l=new AudioContext),l}function g(){try{const n=s(),t=n.currentTime;[523.25,659.25].forEach((a,e)=>{const o=n.createOscillator(),c=n.createGain();o.type="sine",o.frequency.value=a,c.gain.setValueAtTime(.15,t+e*.1),c.gain.exponentialRampToValueAtTime(.001,t+e*.1+.3),o.connect(c),c.connect(n.destination),o.start(t+e*.1),o.stop(t+e*.1+.3)})}catch{}}function A(){try{const n=s(),t=n.currentTime,a=n.createOscillator(),e=n.createGain();a.type="triangle",a.frequency.setValueAtTime(392,t),a.frequency.linearRampToValueAtTime(330,t+.25),e.gain.setValueAtTime(.12,t),e.gain.exponentialRampToValueAtTime(.001,t+.35),a.connect(e),e.connect(n.destination),a.start(t),a.stop(t+.35)}catch{}}function V(){try{const n=s(),t=n.currentTime;[523.25,659.25,783.99].forEach((a,e)=>{const o=n.createOscillator(),c=n.createGain();o.type="sine",o.frequency.value=a,c.gain.setValueAtTime(.15,t+e*.12),c.gain.exponentialRampToValueAtTime(.001,t+e*.12+.5),o.connect(c),c.connect(n.destination),o.start(t+e*.12),o.stop(t+e*.12+.5)})}catch{}}function w(){try{const n=s(),t=n.currentTime,a=n.createOscillator(),e=n.createGain();a.type="sine",a.frequency.setValueAtTime(800,t),a.frequency.exponentialRampToValueAtTime(400,t+.08),e.gain.setValueAtTime(.08,t),e.gain.exponentialRampToValueAtTime(.001,t+.1),a.connect(e),e.connect(n.destination),a.start(t),a.stop(t+.1)}catch{}}function v(){try{const n=s(),t=n.currentTime;[523.25,659.25,783.99].forEach((a,e)=>{const o=n.createOscillator(),c=n.createGain();o.type="sine",o.frequency.value=a,c.gain.setValueAtTime(.1,t+e*.08),c.gain.exponentialRampToValueAtTime(.001,t+e*.08+.2),o.connect(c),c.connect(n.destination),o.start(t+e*.08),o.stop(t+e*.08+.2)})}catch{}}export{h as C,w as a,V as b,g as c,A as d,v as p};

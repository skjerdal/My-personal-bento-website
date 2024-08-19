import{r as a}from"./index.DhYZZe0J.js";/* empty css                       */var E={exports:{}},x={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var P=a,I=Symbol.for("react.element"),D=Symbol.for("react.fragment"),Y=Object.prototype.hasOwnProperty,B=P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,F={key:!0,ref:!0,__self:!0,__source:!0};function L(r,t,o){var s,i={},c=null,l=null;o!==void 0&&(c=""+o),t.key!==void 0&&(c=""+t.key),t.ref!==void 0&&(l=t.ref);for(s in t)Y.call(t,s)&&!F.hasOwnProperty(s)&&(i[s]=t[s]);if(r&&r.defaultProps)for(s in t=r.defaultProps,t)i[s]===void 0&&(i[s]=t[s]);return{$$typeof:I,type:r,key:c,ref:l,props:i,_owner:B.current}}x.Fragment=D;x.jsx=L;x.jsxs=L;E.exports=x;var e=E.exports;/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),b=(...r)=>r.filter((t,o,s)=>!!t&&s.indexOf(t)===o).join(" ");/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var q={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=a.forwardRef(({color:r="currentColor",size:t=24,strokeWidth:o=2,absoluteStrokeWidth:s,className:i="",children:c,iconNode:l,...m},p)=>a.createElement("svg",{ref:p,...q,width:t,height:t,stroke:r,strokeWidth:s?Number(o)*24/Number(t):o,className:b("lucide",i),...m},[...l.map(([u,f])=>a.createElement(u,f)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=(r,t)=>{const o=a.forwardRef(({className:s,...i},c)=>a.createElement(z,{ref:c,iconNode:t,className:b(`lucide-${X(r)}`,s),...i}));return o.displayName=`${r}`,o};/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=j("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=j("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=j("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]),U={Camera:H,Code:T,Database:V},G=({title:r="",content:t="",className:o,style:s,componentName:i,position:c,...l})=>{const[m,p]=a.useState(!1),[u,f]=a.useState({x:50,y:50}),[g,N]=a.useState({x:0,y:0}),[R,$]=a.useState(0),v=a.useRef(null),w=n=>{if(!v.current)return;const d=v.current.getBoundingClientRect(),y=(n.clientX-d.left)/d.width,_=(n.clientY-d.top)/d.height;f({x:y*100,y:_*100});const S=(y-.5)*20,A=(_-.5)*-20;N({x:A,y:S});const O=Math.sqrt(Math.pow(y-.5,2)+Math.pow(_-.5,2));$(O)},k=()=>p(!0),C=()=>{p(!1),f({x:50,y:50}),N({x:0,y:0})};a.useEffect(()=>{const n=v.current;return n&&(n.addEventListener("mousemove",w),n.addEventListener("mouseenter",k),n.addEventListener("mouseleave",C)),()=>{n&&(n.removeEventListener("mousemove",w),n.removeEventListener("mouseenter",k),n.removeEventListener("mouseleave",C))}},[]);const h=n=>{const d=U[n];return d?e.jsx(d,{size:20}):null},M={...s,"--pointer-x":`${u.x}%`,"--pointer-y":`${u.y}%`,"--opacity":m?1:0,"--distance-from-center":R,transform:`
      perspective(1000px) 
      rotateX(${g.x}deg) 
      rotateY(${g.y}deg)
    `,transition:m?"none":"transform 0.5s ease-out"};return e.jsxs("div",{ref:v,className:`pokemon-card ${o||""} ${m?"hovered":""}`,style:M,...l,children:[e.jsxs("div",{className:"card__effects",children:[e.jsx("div",{className:"card__effects__glare"}),e.jsx("div",{className:"card__effects__shine"}),e.jsx("div",{className:"card__effects__holo",children:e.jsx("div",{className:"card__effects__holo--after"})})]}),e.jsxs("div",{className:"card-content",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("h2",{children:r||"Your Name"}),e.jsx("span",{className:"type",children:"Developer"})]}),e.jsx("div",{className:"card-image",children:e.jsx("img",{src:"/api/placeholder/150/150",alt:"Profile"})}),e.jsx("div",{className:"card-body",children:e.jsx("p",{children:t||"A passionate developer with a love for creating interactive and engaging web experiences."})}),e.jsxs("div",{className:"card-stats",children:[e.jsxs("div",{className:"stat",children:[h("Camera"),e.jsx("span",{children:"Front-end: 90"})]}),e.jsxs("div",{className:"stat",children:[h("Database"),e.jsx("span",{children:"Back-end: 85"})]}),e.jsxs("div",{className:"stat",children:[h("Code"),e.jsx("span",{children:"Algorithms: 80"})]})]})]})]})};export{G as default};

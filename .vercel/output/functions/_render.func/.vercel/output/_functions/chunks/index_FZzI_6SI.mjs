import { c as createAstro, a as createComponent, r as renderTemplate, d as renderHead, e as renderSlot, f as renderComponent, m as maybeRenderHead } from './astro/server_DWoMr6JH.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */
import { computed, defineAsyncComponent, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';
import { jsxs, jsx } from 'react/jsx-runtime';
import { forwardRef, createElement, useState, useRef, useEffect } from 'react';
import '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="no"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/Thomas/Documents/GitHub/Meg/src/layouts/Layout.astro", void 0);

const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main = {
  props: {
    title: String,
    content: String,
    componentName: String,
    position: Object,
    className: String,
    style: [String, Object]
  },
  setup(props) {
    const resolvedComponent = computed(() => {
      if (props.componentName && props.componentName !== 'PokemonCard') {
        return defineAsyncComponent(() => 
          __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"./card-components/AboutMe.vue": () => import('./AboutMe_BzIELZQ2.mjs'),"./card-components/ContactSocial.vue": () => import('./ContactSocial_BvdqQT4h.mjs'),"./card-components/CurrentStatus.vue": () => import('./CurrentStatus_DuuD9jN1.mjs'),"./card-components/DownloadResume.vue": () => import('./DownloadResume_BhIiIQPD.mjs'),"./card-components/Education.vue": () => import('./Education_De52zCXm.mjs'),"./card-components/ExtraCard.vue": () => import('./ExtraCard_me_EE3il.mjs'),"./card-components/OtherLarge.vue": () => import('./OtherLarge_BFOLkqSi.mjs'),"./card-components/WorkExperience.vue": () => import('./WorkExperience_GMnFwO8S.mjs')})), `./card-components/${props.componentName}.vue`, 3)
            .catch(error => {
              console.error('Failed to load component:', error);
              return { template: '<p>Error loading component</p>' };
            })
        );
      }
      return null;
    });

    const computedStyle = computed(() => {
      const baseStyle = typeof props.style === 'string' ? 
        props.style.split(';').reduce((acc, style) => {
          const [key, value] = style.split(':');
          if (key && value) {
            acc[key.trim()] = value.trim();
          }
          return acc;
        }, {}) : props.style || {};

      return {
        ...baseStyle,
        gridRow: props.position?.row,
        gridColumn: `${props.position?.col} / span ${props.position?.span || 1}`
      };
    });

    return {
      resolvedComponent,
      computedStyle
    };
  }
};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: ["card", $props.className],
    style: $setup.computedStyle
  }, _attrs))} data-v-13745f11>`);
  if ($props.componentName !== 'PokemonCard') {
    _push(`<h2 data-v-13745f11>${ssrInterpolate($props.title)}</h2>`);
  } else {
    _push(`<!---->`);
  }
  if ($setup.resolvedComponent && $props.componentName !== 'PokemonCard') {
    ssrRenderVNode(_push, createVNode(resolveDynamicComponent($setup.resolvedComponent), null, null), _parent);
  } else if ($props.componentName !== 'PokemonCard') {
    _push(`<p data-v-13745f11>${ssrInterpolate($props.content)}</p>`);
  } else {
    _push(`<!---->`);
  }
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Card.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const Card = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender],['__scopeId',"data-v-13745f11"]]);

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && array.indexOf(className) === index;
}).join(" ");

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Icon = forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Camera = createLucideIcon("Camera", [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
]);

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Code = createLucideIcon("Code", [
  ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
  ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }]
]);

/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Database = createLucideIcon("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
]);

const iconComponents = { Camera, Code, Database };
const PokemonCard = ({ title = "", content = "", className, style, componentName, position, ...otherProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [distanceFromCenter, setDistanceFromCenter] = useState(0);
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPointerPosition({ x: x * 100, y: y * 100 });
    const rotateY = (x - 0.5) * 20;
    const rotateX = (y - 0.5) * -20;
    setRotation({ x: rotateX, y: rotateY });
    const centerX = 0.5;
    const centerY = 0.5;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    setDistanceFromCenter(distance);
  };
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setPointerPosition({ x: 50, y: 50 });
    setRotation({ x: 0, y: 0 });
  };
  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);
  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? /* @__PURE__ */ jsx(IconComponent, { size: 20 }) : null;
  };
  const cardStyle = {
    ...style,
    "--pointer-x": `${pointerPosition.x}%`,
    "--pointer-y": `${pointerPosition.y}%`,
    "--opacity": isHovered ? 1 : 0,
    "--distance-from-center": distanceFromCenter,
    transform: `
      perspective(1000px) 
      rotateX(${rotation.x}deg) 
      rotateY(${rotation.y}deg)
    `,
    transition: isHovered ? "none" : "transform 0.5s ease-out"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: cardRef,
      className: `pokemon-card ${className || ""} ${isHovered ? "hovered" : ""}`,
      style: cardStyle,
      ...otherProps,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "card__effects", children: [
          /* @__PURE__ */ jsx("div", { className: "card__effects__glare" }),
          /* @__PURE__ */ jsx("div", { className: "card__effects__shine" }),
          /* @__PURE__ */ jsx("div", { className: "card__effects__holo", children: /* @__PURE__ */ jsx("div", { className: "card__effects__holo--after" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "card-content", children: [
          /* @__PURE__ */ jsxs("div", { className: "card-header", children: [
            /* @__PURE__ */ jsx("h2", { children: title || "Your Name" }),
            /* @__PURE__ */ jsx("span", { className: "type", children: "Developer" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "card-image", children: /* @__PURE__ */ jsx("img", { src: "/api/placeholder/150/150", alt: "Profile" }) }),
          /* @__PURE__ */ jsx("div", { className: "card-body", children: /* @__PURE__ */ jsx("p", { children: content || "A passionate developer with a love for creating interactive and engaging web experiences." }) }),
          /* @__PURE__ */ jsxs("div", { className: "card-stats", children: [
            /* @__PURE__ */ jsxs("div", { className: "stat", children: [
              renderIcon("Camera"),
              /* @__PURE__ */ jsx("span", { children: "Front-end: 90" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "stat", children: [
              renderIcon("Database"),
              /* @__PURE__ */ jsx("span", { children: "Back-end: 85" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "stat", children: [
              renderIcon("Code"),
              /* @__PURE__ */ jsx("span", { children: "Algorithms: 80" })
            ] })
          ] })
        ] })
      ]
    }
  );
};

const $$Astro = createAstro();
const $$CardWrapper = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CardWrapper;
  const { isUnique, className, style, componentName, position, title, content, ...props } = Astro2.props;
  return renderTemplate`${isUnique ? renderTemplate`${renderComponent($$result, "PokemonCard", PokemonCard, { "client:load": true, "className": className, "style": style, "componentName": componentName, "position": position, "title": title, "content": content, ...props, "client:component-hydration": "load", "client:component-path": "C:/Users/Thomas/Documents/GitHub/Meg/src/components/PokemonCard", "client:component-export": "default" })}` : renderTemplate`${renderComponent($$result, "Card", Card, { "client:load": true, "className": className, "style": style, "componentName": componentName, "position": position, "title": title, "content": content, ...props, "client:component-hydration": "load", "client:component-path": "C:/Users/Thomas/Documents/GitHub/Meg/src/components/Card.vue", "client:component-export": "default" })}`}`;
}, "C:/Users/Thomas/Documents/GitHub/Meg/src/components/CardWrapper.astro", void 0);

const cards = [
  {
    id: "about",
    title: "About Me",
    content: "A brief introduction about yourself...",
    component: "PokemonCard",
    position: { row: 1, col: 1, span: 1 },
    isUnique: true
  },
  {
    id: "work",
    title: "Work Experience",
    content: "Detail your work history here...",
    component: "WorkExperience",
    position: { row: 1, col: 2, span: 2 }
  },
  {
    id: "contact",
    title: "Contact & Social",
    content: "Your contact information and social media links...",
    component: "ContactSocial",
    position: { row: 1, col: 4, span: 1 }
  },
  {
    id: "education",
    title: "Education",
    content: "List your educational background...",
    component: "Education",
    position: { row: 2, col: 1, span: 2 }
  },
  {
    id: "status",
    title: "Current Status",
    content: "What you are currently working on or learning...",
    component: "CurrentStatus",
    position: { row: 2, col: 3, span: 1 }
  },
  {
    id: "other",
    title: "Other Large Card",
    content: "Content for the third large card...",
    component: "OtherLarge",
    position: { row: 2, col: 4, span: 1 }
  },
  {
    id: "resume",
    title: "Download Resume",
    content: "Link to download your resume...",
    component: "DownloadResume",
    position: { row: 3, col: 1, span: 1 }
  },
  {
    id: "extra",
    title: "Extra Card",
    content: "Content for the extra small card...",
    component: "ExtraCard",
    position: { row: 3, col: 2, span: 3 }
  }
];

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Thomas Skjerdal - Personal Website", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container" data-astro-cid-j7pv25f6> <div class="card-grid" data-astro-cid-j7pv25f6> ${cards.map((card) => renderTemplate`${renderComponent($$result2, "CardWrapper", $$CardWrapper, { "isUnique": card.isUnique, "title": card.title, "content": card.content, "componentName": card.component, "position": card.position, "className": "card", "style": `grid-row: ${card.position.row}; grid-column: ${card.position.col} / span ${card.position.span}`, "data-astro-cid-j7pv25f6": true })}`)} </div> </main> ` })}  `;
}, "C:/Users/Thomas/Documents/GitHub/Meg/src/pages/index.astro", void 0);

const $$file = "C:/Users/Thomas/Documents/GitHub/Meg/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { _export_sfc as _, page as p };

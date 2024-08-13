import { ref, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { C as Carousel } from './Carousel_D67Y40JD.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
/* empty css                         */
import { _ as _export_sfc } from './index_Bm5XlLbI.mjs';

const _sfc_main = {
  components: {
    Carousel
  },
  setup() {
    const educationItems = ref([
      {
        degree: '1',
        institution: 'Stanford University',
        period: '2018 - 2020',
        achievements: [
          'Specialized in Artificial Intelligence and Machine Learning',
          'Thesis: "Deep Learning Approaches for Natural Language Processing"',
          'GPA: 3.9/4.0'
        ]
      },
      {
        degree: '2',
        institution: 'Massachusetts Institute of Technology',
        period: '2014 - 2018',
        achievements: [
          'Minor in Data Science',
          'Capstone Project: Developed a predictive maintenance system for IoT devices',
          'Dean\'s List for all semesters'
        ]
      },
      {
        degree: '3',
        institution: 'Thomas Jefferson High School for Science and Technology',
        period: '2010 - 2014',
        achievements: [
          'Valedictorian',
          'President of the Computer Science Club',
          'First place in State Mathematics Olympiad'
        ]
      }
    ]);

    return { educationItems };
  }
};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Carousel = resolveComponent("Carousel");

  _push(`<div${ssrRenderAttrs(mergeProps({ class: "education" }, _attrs))} data-v-1328f542>`);
  _push(ssrRenderComponent(_component_Carousel, {
    items: $setup.educationItems,
    autoSlideInterval: 6000
  }, {
    default: withCtx(({ item: edu, index }, _push, _parent, _scopeId) => {
      if (_push) {
        _push(`<div class="education-card" data-v-1328f542${
          _scopeId
        }><h3 data-v-1328f542${
          _scopeId
        }>${
          ssrInterpolate(edu.degree)
        }</h3><p class="institution" data-v-1328f542${
          _scopeId
        }>${
          ssrInterpolate(edu.institution)
        }</p><p class="period" data-v-1328f542${
          _scopeId
        }>${
          ssrInterpolate(edu.period)
        }</p><ul class="achievements" data-v-1328f542${
          _scopeId
        }><!--[-->`);
        ssrRenderList(edu.achievements, (achievement, i) => {
          _push(`<li data-v-1328f542${
            _scopeId
          }>${
            ssrInterpolate(achievement)
          }</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        return [
          createVNode("div", { class: "education-card" }, [
            createVNode("h3", null, toDisplayString(edu.degree), 1),
            createVNode("p", { class: "institution" }, toDisplayString(edu.institution), 1),
            createVNode("p", { class: "period" }, toDisplayString(edu.period), 1),
            createVNode("ul", { class: "achievements" }, [
              (openBlock(true), createBlock(Fragment, null, renderList(edu.achievements, (achievement, i) => {
                return (openBlock(), createBlock("li", { key: i }, toDisplayString(achievement), 1))
              }), 128))
            ])
          ])
        ]
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/card-components/Education.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const Education = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender],['__scopeId',"data-v-1328f542"]]);

export { Education as default };

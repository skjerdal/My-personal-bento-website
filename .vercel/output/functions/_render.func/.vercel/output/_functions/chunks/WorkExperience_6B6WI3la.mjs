import { ref, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { C as Carousel } from './Carousel_D67Y40JD.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
/* empty css                         */
import { _ as _export_sfc } from './index_Bm5XlLbI.mjs';

const _sfc_main = {
  components: {
    Carousel
  },
  setup() {
    const jobs = ref([
      {
        company: 'Company A',
        title: '1',
        period: 'Jan 2020 - Present',
        description: 'Developed and maintained web applications using Vue.js and Node.js.'
      },
      {
        company: 'Company B',
        title: '2',
        period: 'Jun 2018 - Dec 2019',
        description: 'Assisted in the development of mobile apps using React Native and Firebase.'
      },
      // Add more job entries as needed
    ]);

    return { jobs };
  }
};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Carousel = resolveComponent("Carousel");

  _push(`<div${ssrRenderAttrs(mergeProps({ class: "work-experience" }, _attrs))} data-v-151bf78f>`);
  _push(ssrRenderComponent(_component_Carousel, { items: $setup.jobs }, {
    default: withCtx(({ item: job }, _push, _parent, _scopeId) => {
      if (_push) {
        _push(`<div class="job-card" data-v-151bf78f${
          _scopeId
        }><h3 data-v-151bf78f${
          _scopeId
        }>${
          ssrInterpolate(job.title)
        } at ${
          ssrInterpolate(job.company)
        }</h3><p class="period" data-v-151bf78f${
          _scopeId
        }>${
          ssrInterpolate(job.period)
        }</p><p class="description" data-v-151bf78f${
          _scopeId
        }>${
          ssrInterpolate(job.description)
        }</p></div>`);
      } else {
        return [
          createVNode("div", { class: "job-card" }, [
            createVNode("h3", null, toDisplayString(job.title) + " at " + toDisplayString(job.company), 1),
            createVNode("p", { class: "period" }, toDisplayString(job.period), 1),
            createVNode("p", { class: "description" }, toDisplayString(job.description), 1)
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
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/card-components/WorkExperience.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const WorkExperience = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender],['__scopeId',"data-v-151bf78f"]]);

export { WorkExperience as default };

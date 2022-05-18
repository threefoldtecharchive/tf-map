<svelte:options tag="tf-map" />

<script lang="ts">
  import { onMount } from "svelte";
  import { createPopper, Instance } from "@popperjs/core/dist/esm/popper-lite";

  import { countries, Country } from "./countries";
  import { virtualElement, generateGetBoundingClientRect } from "./popper";

  export let fill: string = "#d8d8d8";
  export let stroke: string = "#ccc";
  export let strokewidth: string = "1";
  export let width: string = "100%";
  export let colors: string;

  let tooltip: HTMLDivElement;
  let instance: Instance;

  let show: boolean = false;
  let country: Country;

  onMount(() => {
    instance = createPopper(virtualElement, tooltip);
  });

  function onMouseMove(ev: MouseEvent): void {
    const { clientX: x, clientY: y, target } = ev;
    if (!(target instanceof SVGPathElement)) {
      show = false;
      return;
    }

    show = true;
    country = countries[target.getAttribute("data-index")];

    virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
      x,
      y
    ) as any;
    instance.update();
  }

  $: _colors = colors ? JSON.parse(colors) : {};
</script>

<section class="map">
  <div
    bind:this={tooltip}
    style={`display: ${show ? "block" : "none"}`}
    class="tooltip"
  >
    {country?.value}
  </div>
  <svg {fill} {width} viewBox="-25 -25 1060 680" on:mousemove={onMouseMove}>
    {#each countries as country, i}
      <path
        id={country.id}
        d={country.d}
        data-index={i}
        {stroke}
        stroke-width={+strokewidth}
        fill={_colors[country.value] || _colors[country.id]}
      />
    {/each}
  </svg>
</section>

<style lang="scss" scoped>
  .map * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .tooltip {
    padding: 5px;
    border-radius: 5px;
    background-color: white;
  }
</style>

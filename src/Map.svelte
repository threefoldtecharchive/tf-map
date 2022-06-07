<svelte:options tag="tf-map" />

<script lang="ts">
  import { onMount } from "svelte";
  import { fetchData, Country } from "./utils/fetchData";

  let countries: Country[] = [];
  export let fill: string = "ghostwhite";
  export let stroke: string = "#4cbbd9";
  export let strokewidth: number = 0.5;
  export let r: number = 25;
  export let g: number = 130;
  export let b: number = 177;

  export let nodes: string;
  let nodesDistribution: { [key: string]: number } = {};

  $: {
    try {
      nodesDistribution = JSON.parse(nodes);
    } catch {}
  }

  $: max = Math.max(0, ...Object.values(nodesDistribution));

  let show: boolean = false;
  let country: Country;

  onMount(async () => {
    countries = await fetchData();
  });

  function hoverHandler(stroke: string = null) {
    return (e: any) => {
      e.target.style.stroke = stroke;
    };
  }

  function isActive(name: string): number | null {
    for (const key in nodesDistribution) {
      if (name.startsWith(key)) {
        return nodesDistribution[key];
      }
    }
    return null;
  }

  let x = 0;
  let y = 0;

  function onMouseMove(ev: MouseEvent): void {
    const { clientX: _x, clientY: _y, target } = ev;
    if (!(target instanceof SVGPathElement)) {
      show = false;
      return;
    }
    show = true;
    x = _x - 10;
    y = _y + 25;
    country = countries[target.getAttribute("data-index")];
  }
</script>

<section on:mousemove={onMouseMove}>
  {#if show}
    <div
      style={`
  background-color: #333;
  padding: 5px;
  position: fixed;
  top: ${y}px;
  left: ${x}px;
`}
    >
      <p style="color: white; font-size: 18px; margin: 0;">
        <span style="display: block;">
          {country?.name}
        </span>
        No.of nodes: {isActive(country.name) || 0}
      </p>
    </div>
  {/if}
  <svg
    width="100%"
    viewBox="30 -192 960 630"
    {fill}
    {stroke}
    stroke-width={strokewidth}
  >
    {#each countries as country, i}
      <path
        id={country.id}
        data-name={country.name}
        data-index={i}
        d={country.d}
        on:mousemove={hoverHandler("#1982b1")}
        on:mouseleave={hoverHandler()}
        fill={isActive(country.name)
          ? `rgba(${r}, ${g}, ${b}, ${0.5 + isActive(country.name) / max})`
          : null}
      />
    {/each}
  </svg>
</section>

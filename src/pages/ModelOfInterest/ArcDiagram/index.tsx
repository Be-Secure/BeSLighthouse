import React, { useEffect } from 'react';
import * as d3 from 'd3';

const ArcDiagram: React.FC = () => {
  useEffect(() => {
    const githubRawUrl = 'https://raw.githubusercontent.com/Be-Secure/besecure-assets-store/main/models/model-metadata.json';

    // Fetch data from GitHub raw URL and save it into a variable as JSON
    fetch(githubRawUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // set the dimensions and margins of the graph
        const margin = { top: 0, right: 30, bottom: 50, left: 60 },
          width = 650 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
          .append("svg")
          .attr("viewBox", [0, 0, width + 90, height + 80].join(' '))
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Your JSON data
        const jsonData = data;

        // Extract unique nodes and links from the JSON data
        const nodes: { name: string }[] = [];
        const links: { source: string; target: string }[] = [];

        jsonData.forEach(node => {
          nodes.push({ name: node.name });
          node.dependencies.forEach(dependency => {
            nodes.push({ name: dependency });
            links.push({ source: node.name, target: dependency });
          });
        });

        // A color scale for nodes
        const color = d3.scaleOrdinal()
          .domain(nodes.map(d => d.name))
          .range(d3.schemeSet3);

        // A linear scale to position the nodes on the X axis
        const x = d3.scalePoint()
          .range([0, width])
          .domain(nodes.map(d => d.name));

       // Add the links
      const linkSelection = svg
        .selectAll('mylinks')
        .data(links)
        .join('path')
        .attr('d', d => {
          const start = x(d.source);
          const end = x(d.target);

          // Check if start and end are not undefined before using them
          if (start !== undefined && end !== undefined) {
            return ['M', start, height - 30, 'A', (start - end) / 2, ',', (start - end) / 2, 0, 0, ',', start < end ? 1 : 0, end, ',', height - 30].join(' ');
          } else {
            return ''; // or handle it appropriately based on your use case
          }
        })
        .style("fill", "none")
        .attr("stroke", "grey")
        .style("stroke-width", 1);


       // Add the circle for the nodes
      const nodeSelection = svg
        .selectAll("mynodes")
        .data(nodes)
        .join("circle")
        .attr("cx", (d: { name: string }) => x(d.name) || 0)  // Explicitly provide type information
        .attr("cy", height - 30)
        .attr("r", 7)
        .style("fill", (d: { name: string }) => color(d.name) as string)  // Explicitly provide type information
        .attr("stroke", "white");


        // And give them a label
        const labelSelection = svg
          .selectAll("mylabels")
          .data(nodes)
          .join("text")
          .attr("x", 0)
          .attr("y", 0)
          .text(d => d.name)
          .style("text-anchor", "end")
          .attr("transform", d => `translate(${x(d.name)},${height - 15}) rotate(-45)`)
          .style("font-size", 12);

        // Add the highlighting functionality
        // Add the highlighting functionality
nodeSelection.on('mouseover', function (event, d) {
  // Highlight the nodes: every node is green except of him
  nodeSelection.style('opacity', .2);
  d3.select(this).style('opacity', 1);

  // Highlight the connections
  linkSelection
    .style('stroke', a => a.source === d.name || a.target === d.name ? color(d.name) as string : 'grey')
    .style('stroke-opacity', a => a.source === d.name || a.target === d.name ? 1 : 0.2)
    .style('stroke-width', a => a.source === d.name || a.target === d.name ? 4 : 1);
  labelSelection
    .style("font-size", b => b.name === d.name ? 18.9 : 2)
    .attr("y", b => b.name === d.name ? 10 : 0);
}).on('mouseout', function () {
  // Reset the styles on mouseout
  nodeSelection.style('opacity', 0.9);
  linkSelection
    .style('stroke', 'grey')
    .style('stroke-opacity', 1)
    .style('stroke-width', 1);
  labelSelection.style("font-size", 12);
});

      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  return (
    <div id="my_dataviz"></div>
  );
}

export default ArcDiagram;

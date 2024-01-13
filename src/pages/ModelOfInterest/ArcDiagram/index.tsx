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
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = window.innerWidth - margin.left - margin.right;
        const height = window.innerHeight - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
          .append("svg")
          .attr("viewBox", [0, 0, width, height + 150])
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Your JSON data
        const jsonData = data;

        // Extract unique nodes and links from the JSON data
        const nodes: { name: string, group: string }[] = [];
        const links: { source: string, target: string }[] = [];

        jsonData.forEach(node => {
          const mainNode = { name: node.name, group: node.group };
          nodes.push(mainNode);
          node.dependencies.forEach(dependency => {
            const dependentNode = { name: dependency, group: node.group };
            nodes.push(dependentNode);
            links.push({ source: mainNode.name, target: dependentNode.name });
          });
        });

        // A color scale for nodes based on unique names
        const color = d3.scaleOrdinal<string>()
          .domain(nodes.map(d => d.name))
          .range(d3.schemeCategory10);

        // A linear scale to position the nodes on the X axis
        const x = d3.scalePoint()
          .range([0, width])
          .domain(nodes.map(d => d.name));

        // Add some space between main node and its dependencies
        const spaceBetween = 50;
        const spacedNodes = nodes.map((node, index) => {
          const xPos = x(node.name);
          return {
            ...node,
            x: xPos !== undefined ? xPos + (node.group === 'main' ? spaceBetween : 0) : undefined
          };
        }).filter(node => node.x !== undefined);

        // Add the links
        const linkSelection = svg
        .selectAll('mylinks')
        .data(links)
        .join('path')
        .attr('d', d => {
          const start = spacedNodes.find(node => node.name === d.source)?.x;
          const end = spacedNodes.find(node => node.name === d.target)?.x;

          // Check if start and end are not undefined before using them
          if (start !== undefined && end !== undefined) {
            return ['M', start, height - 30, 'A', (start - end) / 2, ',', (start - end) / 2, 0, 0, ',', start < end ? 1 : 0, end, ',', height - 30].join(' ');
          } else {
            return ''; // or handle it appropriately based on your use case
          }
        })
        .style("fill", "none")
        .attr("stroke", d => color(d.source) as string)
        .style("stroke-width", 1);

        // Add the circle for the nodes
        const nodeSelection = svg
          .selectAll("mynodes")
          .data(spacedNodes)
          .join("circle")
          .attr("cx", (d: { name: string, x: number | undefined }) => d.x !== undefined ? d.x : 0)  // Explicitly provide type information
          .attr("cy", height - 30)
          .attr("r", 7)
          .style("fill", d => color(d.name) as string)
          .attr("stroke", "white")
          .on('click', (event, d) => {
            if (isClickable(d.name) && !event.active) {
              window.open(`/BeSLighthouse/model_report/:${d.name}`, "_blank");
            }
          });

        const isClickable = (nodeName) => {
          const res: boolean = data.find(item => item.name === nodeName);
          return res;
        };
            
        // And give them a label
        const labelSelection = svg
        .selectAll("mylabels")
        .data(spacedNodes)
        .join("text")
        .attr("x", 0)
        .attr("y", 0)
        .text(d => d.name)
        .style("text-anchor", "end")
        .attr("transform", d => `translate(${d.x},${height - 15}) rotate(-45)`)
        .style("font-size", 12)
        .on('mouseover', function (event, d) {
          // Highlight the nodes: every node is green except for him
          nodeSelection.style('opacity', node => node.group === d.group ? 0.2 : 0.1);
          d3.select(this).style('opacity', 1);
          d3.select(this).attr("cursor", isClickable(d.name) ? "pointer" : "default");

          // Highlight the directly connected nodes
          const directlyConnectedNodes = links
            .filter(link => link.source === d.name || link.target === d.name)
            .map(link => link.source === d.name ? link.target : link.source);

          nodeSelection
            .filter(node => directlyConnectedNodes.includes(node.name))
            .style('opacity', 1);

          // Highlight the connections
          linkSelection
            .style('stroke', a => a.source === d.name || a.target === d.name ? color(d.name) as string : 'grey')
            .style('stroke-opacity', a => a.source === d.name || a.target === d.name ? 1 : 0.2)
            .style('stroke-width', a => a.source === d.name || a.target === d.name ? 2 : 1);
          labelSelection
            .style("font-size", b => b.name === d.name || directlyConnectedNodes.includes(b.name) ? 18.9 : 2)
            .attr("y", b => b.name === d.name || directlyConnectedNodes.includes(b.name) ? 10 : 0);
          nodeSelection
            .filter(node => node.name === d.name)
            .style('opacity', 1)
            .attr("cursor", isClickable(d.name) ? "pointer" : "default");
        }).on('mouseout', function () {
          // Reset the styles on mouseout
          nodeSelection.style('opacity', 1);
          d3.select(this).attr("cursor", "default");
          linkSelection
            .style('stroke', d => color(spacedNodes.find(node => node.name === d.source)?.name || "") as string)
            .style('stroke-opacity', 1)
            .style('stroke-width', 1);
          labelSelection.style("font-size", 12);
          nodeSelection.style('opacity', 1);
          d3.select(this).attr("cursor", "default");
        })
        .on('click', (event, d) => {
          if (isClickable(d.name) && !event.active) {
            window.open(`/BeSLighthouse/model_report/:${d.name}`, "_blank");
          }
        });
        // Add the highlighting functionality
        nodeSelection.on('mouseover', function (event, d) {
          // Highlight the nodes: every node is green except for him
          nodeSelection.style('opacity', node => node.group === d.group ? 0.2 : 0.1);
          d3.select(this).style('opacity', 1);
          d3.select(this).attr("cursor", isClickable(d.name) ? "pointer" : "default");

          // Highlight the directly connected nodes
          const directlyConnectedNodes = links
            .filter(link => link.source === d.name || link.target === d.name)
            .map(link => link.source === d.name ? link.target : link.source);

          nodeSelection
            .filter(node => directlyConnectedNodes.includes(node.name))
            .style('opacity', 1);

          // Highlight the connections
          linkSelection
            .style('stroke', a => a.source === d.name || a.target === d.name ? color(d.name) as string : 'grey')
            .style('stroke-opacity', a => a.source === d.name || a.target === d.name ? 1 : 0.2)
            .style('stroke-width', a => a.source === d.name || a.target === d.name ? 2 : 1);
          labelSelection
            .style("font-size", b => b.name === d.name || directlyConnectedNodes.includes(b.name) ? 18.9 : 2)
            .attr("y", b => b.name === d.name || directlyConnectedNodes.includes(b.name) ? 10 : 0);
        }).on('mouseout', function () {
          // Reset the styles on mouseout
          nodeSelection.style('opacity', 1);
          d3.select(this).attr("cursor", "default");
          linkSelection
            .style('stroke', d => color(spacedNodes.find(node => node.name === d.source)?.name || "") as string)
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

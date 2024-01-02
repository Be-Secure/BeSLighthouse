// GraphDisplay.tsx
import React, { useEffect } from "react";
import * as d3 from "d3";
import { Link } from 'react-router-dom';

// Define the Node interface
interface Node extends d3.SimulationNodeDatum {
  name: string;
  color: string;
  model_card: any;
  isDependency: boolean;
}

// Define the Link interface
interface Link extends d3.SimulationLinkDatum<Node> {
  source: string; // Node name as source
  target: string; // Node name as target
}

const GraphDisplay = () => {
  useEffect(() => {
    const githubRawUrl =
      "https://raw.githubusercontent.com/Be-Secure/besecure-assets-store/main/models/model-metadata.json";

    // Fetch data from GitHub raw URL and save it into a variable as JSON
    fetch(githubRawUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Extract unique nodes from "name" and "dependencies"
        const nodesSet = new Set<string>();
        data.forEach((item) => {
          nodesSet.add(item.name as string);
          item.dependencies.forEach((dep) => nodesSet.add(dep as string));
        });

        const nodes: Node[] = Array.from(nodesSet).map((name) => ({
          name,
          color: "#0077cc",
          model_card: getModelCardLink(name),
          isDependency: false,
        }));

        // Create links based on dependencies
        const links: Link[] = [];
        data.forEach((item) => {
          item.dependencies.forEach((dep) => {
            links.push({ source: item.name, target: dep });
            // Mark dependencies for lighter color
            const depNode = nodes.find((node) => node.name === dep);
            if (depNode) depNode.isDependency = true;
          });
        });

        // Specify the dimensions of the chart.
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = window.innerWidth - margin.left - margin.right;
        const height = window.innerHeight - margin.top - margin.bottom;

        // Remove existing SVG content
        d3.select("#graph-container").selectAll("*").remove();

        // Specify the bounds for the simulation
    //const bounds = { x1: 0, y1: 0, x2: width, y2: height };

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => (d as Node).name).distance(50))
      .force("charge", d3.forceManyBody().strength(-20))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

        // Create the SVG container.
        const svg = d3.select("#graph-container")
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", `0 0 ${width} ${height}`)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add a line for each link, with arrowheads.
        const link = svg.append("g")
          .attr("stroke", "#555") // Dark link color
          .attr("stroke-opacity", 0.6)
          .selectAll()
          .data(links)
          .enter()
          .append("line")
          .attr("stroke-width", 1);

        // Add arrowhead markers.
        const arrowhead = svg.append("svg:defs")
          .selectAll("marker")
          .data(links)
          .enter()
          .append("svg:marker")
          .attr("id", (d, i) => "arrowhead-" + i)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 8)
          .attr("refY", 0)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-5L10,0L0,5");

        link.attr("marker-end", (d, i) => "url(#arrowhead-" + i + ")");

        const nodeGroup = svg.append("g");

        const drag = d3.drag<SVGCircleElement, Node>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        const node = nodeGroup
          .selectAll()
          .data(nodes)
          .enter()
          .append("circle")
          .attr("r", 10)
          .attr("fill", (d) => (d.isDependency ? "#aed6f1" : "#0077cc"))
          .on("click", (event, d) => handleNodeClick(event, d))
          .style("cursor", (d) => (d.model_card ? "pointer" : "default"));
        //  .call(drag);

        const handleNodeClick = (event, d) => {
          if (d.model_card && !event.active) {
            window.open(d.model_card, "_blank");
          }
        };


        // Add names to the nodes
        const nodeName = nodeGroup.selectAll()
          .data(nodes)
          .enter()
          .append("text")
          .text(d => (d as Node).name)
          .attr("font-size", 12)
          .attr("dx", 14)
          .attr("dy", 4)
          .attr("fill", d => (d as Node).isDependency ? "#34495e" : "#2c3e50"); // Darker color for dependencies

        // Set the position attributes of links and nodes each time the simulation ticks.
        function ticked() {
          link
            .attr("x1", d => (d.source as any).x || 0)
            .attr("y1", d => (d.source as any).y || 0)
            .attr("x2", d => (d.target as any).x || 0)
            .attr("y2", d => (d.target as any).y || 0);

          node.attr("cx", d => (d as Node).x || 0).attr("cy", d => (d as Node).y || 0);

          nodeName.attr("x", d => (d as Node).x || 0).attr("y", d => (d as Node).y || 0);
        }

        function getModelCardLink(nodeName) {
          const nodeData = data.find(item => item.name === nodeName);
          return nodeData ? nodeData.model_card : null;
        }

        function dragstarted(event: any, d: Node) {
            if (!event.active) simulation.alphaTarget(0.5).restart();
            (d as Node).fx = (d as Node).x;
            (d as Node).fy = (d as Node).y;
          }
      
          function dragged(event: any, d: Node) {
            (d as Node).fx = event.x;
            (d as Node).fy = event.y;
          }
      
          function dragended(event: any, d: Node) {
            if (!event.active) simulation.alphaTarget(0);
            (d as Node).fx = null;
            (d as Node).fy = null;
          }      
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <div id="graph-container">
      {/* You can add any additional React components or elements here */}
    </div>
  );
};

export default GraphDisplay;

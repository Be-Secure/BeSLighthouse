import React, { useEffect } from "react";
import * as d3 from "d3";

// Define the Node interface
interface Node extends d3.SimulationNodeDatum {
  name: string;
  color: string;
  clickable: boolean;
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

        const isClickable = (nodeName) => {
          const res: boolean = data.find(item => item.name === nodeName);
          return res;
        };

        const nodes: Node[] = Array.from(nodesSet).map((name) => ({
          name,
          color: "#0077cc",
          clickable: isClickable(name),
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

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => (d as Node).name))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", ticked);

        // Create the SVG container.
        const svg = d3.select("#graph-container")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "max-width: 100%; height: auto;")
          .append("g");
  
        // Add a line for each link, with arrowheads.
        const link = svg.append("g")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.8)
          .selectAll()
          .data(links)
          .enter()
          .append("line")
          .attr("stroke-width", 1);

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
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
          .attr("r", 7)
          .attr("fill", (d) => (d.isDependency ? "#EC5800" : "currentColor"))
          .on("click", (event, d) => handleNodeClick(event, d))
          .style("cursor", (d) => (d.clickable ? "pointer" : "default"))
          .call(drag);

        const handleNodeClick = (event, d) => {
          if (d.clickable && !event.active) {
            window.open(`/BeSLighthouse/model_report/:${d.name}`, "_blank");
          }
        };

        // Add names to the nodes
        const nodeNameGroup = nodeGroup.selectAll()
          .data(nodes)
          .enter()
          .append("g")
          .style("cursor", (d) => (d.clickable ? "pointer" : "default"))
          .on("click", (event, d) => handleNodeClick(event, d)); // Attach click event to the group

        const nodeName = nodeNameGroup.append("text")
          .text(d => (d as Node).name)
          .attr("font-size", 12)
          .attr("dx", 14)
          .attr("dy", 4)
          .attr("fill", d => (d as Node).isDependency ? "#34495e" : "#2c3e50");

        
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
    <div>
    <div id="indicator" style={{ position: "absolute", top: "0", right: "0", margin: "20px", marginTop: "70px" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", marginBottom: "2px", marginTop: "17px" }}>
        <div className="circle model" style={{ backgroundColor: "currentColor", width: "12px", height: "12px", borderRadius: "50%", marginRight: "5px", marginLeft: "20px"}}></div>
        <p style={{ fontSize: "13px" }}>Model</p>
      </div>

      <div className="container" style={{ display: "flex", alignItems: "center", marginBottom: "5px", marginTop: "2px" }}>
        <div className="circle dependency" style={{ backgroundColor: "#EC5800", width: "12px", height: "12px", borderRadius: "50%", marginRight: "5px", marginLeft: "20px"}}></div>
        <p style={{ fontSize: "13px" }}>Dependency</p>
      </div>
    </div>
    <div id="graph-container">
      {/* Your graph content goes here */}
    </div>
  </div>
  );
};

export default GraphDisplay;

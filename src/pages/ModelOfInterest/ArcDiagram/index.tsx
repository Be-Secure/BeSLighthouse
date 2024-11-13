import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { modelOfInterestData } from "../../../dataStore";

const ArcDiagram: React.FC = () => {
  useEffect(() => {
    // Fetch data from GitHub raw URL and save it into a variable as JSON
    fetch(modelOfInterestData)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return await response.json();
      })
      .then(data => {
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = window.innerWidth - margin.left - margin.right;
        const height = window.innerHeight - margin.top - margin.bottom - 400;

        // append the svg object to the body of the page
        const svg = d3.select("#Arc_diagram")
          .append("svg")
          .attr("viewBox", [0, height / 2, width, height + 150])
          .attr("width", width)
          .attr("height", height)
          .append("g");

        // Your JSON data
        const jsonData = data;

        // Extract unique nodes and links from the JSON data
        const nodes: Array<{ name: string, group: string, color: string, type: string }> = [];
        const links: Array<{ source: string, target: string }> = [];

        // get color
        function getColor(type: string) {
          if (type === "Classic") {
            return "blue";
          } else {
            return "#EC5800";
          }
        }
        jsonData.forEach((node: { name: any; group: any; type: string; dependencies: any[]; }) => {
          const mainNode = { name: node.name, group: node.group, color: getColor(node.type), type: node.type };
          nodes.push(mainNode);
          node.dependencies.forEach((dependency: any) => {
            // check if the dependency tracked under BeS
            const trackedObj = jsonData.find((item: { name: any; }) => item.name === dependency);
            let dependentNode;
            if (trackedObj) {
              dependentNode = { name: dependency, group: node.group, type: node.type, color: getColor(trackedObj.type) };
            } else {
              dependentNode = { name: dependency, group: node.group, type: node.type, color: "currentColor" };
            }
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
          .attr("stroke", d => color(d.source))
          .style("stroke-width", 1);

        // Add the circle for the nodes
        const nodeSelection = svg
          .selectAll("mynodes")
          .data(spacedNodes)
          .join("circle")
          .attr("cx", (d: { name: string, x: number | undefined }) => d.x !== undefined ? d.x : 0)  // Explicitly provide type information
          .attr("cy", height - 30)
          .attr("r", 8)
          .style("fill", d => d.color)
          .attr("stroke", "white")
          .on('click', (event, d: any) => {
            if (isClickable(d.name) && !event.active) {
              window.open(`/BeSLighthouse/model_report/:${d.name}?type=${d.type}`, "_blank");
            }
          });

        const isClickable = (nodeName: string) => {
          const res: boolean = data.find((item: { name: any; }) => item.name === nodeName);
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
          .attr("font-family", "sans-serif")
          .attr("font-size", 16)
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
              .style('stroke', a => a.source === d.name || a.target === d.name ? color(d.name) : 'grey')
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
              .style('stroke', d => color(spacedNodes.find(node => node.name === d.source)?.name ?? ""))
              .style('stroke-opacity', 1)
              .style('stroke-width', 1);
            labelSelection.style("font-size", 16);
            nodeSelection.style('opacity', 1);
            d3.select(this).attr("cursor", "default");
          })
          .on('click', (event, d: any) => {
            if (isClickable(d.name) && !event.active) {
              window.open(`/BeSLighthouse/model_report/:${d.name}?type=${d.type}`, "_blank");
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
            .style('stroke', a => a.source === d.name || a.target === d.name ? color(d.name) : 'grey')
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
            .style('stroke', d => color(spacedNodes.find(node => node.name === d.source)?.name ?? ""))
            .style('stroke-opacity', 1)
            .style('stroke-width', 1);
          labelSelection.style("font-size", 16);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
      });
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  return (
    <div>
      <div id="indicator" style={ { position: "absolute", top: "0", right: "0", margin: "20px", marginTop: "70px" } }>
        <div className="container" style={ { display: "flex", alignItems: "center", marginBottom: "2px", marginTop: "17px" } }>
          <div className="circle model" style={ { backgroundColor: "blue", width: "10px", height: "10px", borderRadius: "50%", marginRight: "5px", marginLeft: "20px" } } />
          <p style={ { fontSize: "13px" } }>Classic (Model)</p>
        </div>

        <div className="container" style={ { display: "flex", alignItems: "center", marginBottom: "5px", marginTop: "2px" } }>
          <div className="circle dependency" style={ { backgroundColor: "#EC5800", width: "10px", height: "10px", borderRadius: "50%", marginRight: "5px", marginLeft: "20px" } } />
          <p style={ { fontSize: "13px" } }>LLM (Model)</p>
        </div>

        <div className="container" style={ { display: "flex", alignItems: "center", marginBottom: "5px", marginTop: "2px" } }>
          <div className="circle dependency" style={ { backgroundColor: "currentColor", width: "10px", height: "10px", borderRadius: "50%", marginRight: "5px", marginLeft: "20px" } } />
          <p style={ { fontSize: "13px" } }>Not Tracked</p>
        </div>
      </div>
      <div id="Arc_diagram">
        { /* Your graph content goes here */ }
      </div>
    </div>
  );
};

export default ArcDiagram;

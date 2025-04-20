import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const RacelineVisualization = ({ data, rotation }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 400;
    const height = 300;
    const margin = 20;

    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);

    const xScale = d3.scaleLinear()
      .domain([Math.min(...xValues), Math.max(...xValues)])
      .range([margin, width - margin]);

    const yScale = d3.scaleLinear()
      .domain([Math.min(...yValues), Math.max(...yValues)])
      .range([height - margin, margin]); 

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveBasis);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2}) rotate(${rotation}) translate(${-width / 2}, ${-height / 2})`);

    // Draw the raceline
    g.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2);

    const movingDot = g.append("circle")
      .attr("r", 5)
      .attr("fill", "red");

    // Animate the dot along the path
    function animateDot() {
      movingDot.transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attrTween("transform", function () {
          return function (t) {
            const length = d3.select("path").node().getTotalLength();
            const point = d3.select("path").node().getPointAtLength(t * length);
            return `translate(${point.x}, ${point.y})`;
          };
        })
        .on("end", animateDot); // Loop animation
    }

    animateDot();

  }, [data, rotation]);

  return (
    <div style={{ border: "2px solid #ddd", padding: "10px", borderRadius: "10px", width: "420px", margin: "auto", background: "#f9f9f9" }}>
      <svg ref={svgRef} width={400} height={300} />
    </div>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [columns, setColumns] = useState({ x: "", y: "", velocity: "" });
  const [csvHeaders, setCsvHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsedData = d3.csvParse(text);
      
      if (parsedData.length === 0) return;

      const detectedHeaders = Object.keys(parsedData[0]);

      const autoColumns = {
        x: detectedHeaders.find(col => col.toLowerCase().includes("x")) || detectedHeaders[0],
        y: detectedHeaders.find(col => col.toLowerCase().includes("y")) || detectedHeaders[1],
        velocity: detectedHeaders.find(col => col.toLowerCase().includes("velocity")) || detectedHeaders[2]
      };

      setCsvHeaders(detectedHeaders);
      setColumns(autoColumns);

      const formattedData = parsedData.map(d => ({
        x: +d[autoColumns.x],
        y: +d[autoColumns.y],
        velocity: +d[autoColumns.velocity]
      }));

      setData(formattedData);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333" }}>Upload and Visualize Raceline</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} style={{ marginBottom: "10px" }} />

      {csvHeaders.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <label>X: </label>
          <select value={columns.x} onChange={(e) => setColumns({ ...columns, x: e.target.value })}>
            {csvHeaders.map(header => <option key={header} value={header}>{header}</option>)}
          </select>

          <label style={{ marginLeft: "10px" }}>Y: </label>
          <select value={columns.y} onChange={(e) => setColumns({ ...columns, y: e.target.value })}>
            {csvHeaders.map(header => <option key={header} value={header}>{header}</option>)}
          </select>

          <label style={{ marginLeft: "10px" }}>Velocity: </label>
          <select value={columns.velocity} onChange={(e) => setColumns({ ...columns, velocity: e.target.value })}>
            {csvHeaders.map(header => <option key={header} value={header}>{header}</option>)}
          </select>
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        <label>Rotation: {rotation}°</label>
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={rotation} 
          onChange={(e) => setRotation(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      <RacelineVisualization data={data} rotation={rotation} />
    </div>
  );
};

export default App;

const width = 1000,height = 500;

const treemap = data => d3.treemap()
    .tile(d3.treemapSquarify)
    .size([width, height])
    .padding(0)
    .round(true)
  (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
      )

const svg = d3.select("#graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font", "10px sans-serif")

let tooltip = d3.select("body")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .attr("id", "tooltip"); 

const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"

d3.json(url).then((data) => {
  console.log(data.children)
 let legendData = [];
  for (let prop in data.children){
    legendData.push(data.children[prop]["name"])}
  console.log(legendData);
  
  const root = treemap(data)
  
  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)

const color = d3.scaleOrdinal(d3.schemeCategory10)
  
leaf.append("rect")
  .attr("class", "tile")    
  .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .on("mouseover", d => {
      tooltip.style("opacity", 0.8)
      .style("left", (event.pageX + 10) + "px")
       .style("top", (event.pageY - 30) + "px")
      .attr("datavalue", d.data.value)
      .html("Name: " + d.data.name + "<br>" + "Category: " + d.data.category + "<br>" + "Value: " + d.data.value)
      .attr("data-value", d.data.value)
})
      .on("mouseout", function(d) {
           tooltip.style("opacity", 0)
       });
      
      
      
  
leaf.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .join("tspan")
    .attr("x",3)
    .attr("y",(d,i) => (i+1) * 14)
    .text(d => d);
  
  const legend = d3.select("#legend")
      .append("svg")
      .attr("width", 500)
      .style("font", "12px sans-serif")
      .append("g")
    .attr("transform", `translate(100,10)`);
  
  const leafLegend = legend.selectAll("g")
    .data(legendData)
    .join("g")
    .attr("transform", (d,i) => {
      return 'translate(' + 
      ((i%(3))*150) + ',' + 
      ((Math.floor(i/(3)))*25) + ')';
    })
  
  leafLegend.append("rect")
  .attr("class", "legend-item")    
  .attr("fill", d => color(d))
      .attr("fill-opacity", 0.6)
      .attr("width", 15)
      .attr("height",15)
      .attr("data-category", d => d)
    
  leafLegend.append("text")
  .text(d => d)
  .attr("x", 20)
  .attr("y", 12)
})
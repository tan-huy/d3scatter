let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(url, function(error, dataset) {
  //alert(data[0].Time);
  dataset.forEach(function(d) {
    let parsedTime = d.Time.split(':');
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });
  
  let padding = {"top": 110, "bottom": 80, "left": 80, "right": 80},
    width = 900,
    height = 600;
  
  let x = d3.scaleLinear()
    .range([0, width - padding.left - padding.right]);
  
  var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))
    
  x.domain([d3.min(dataset, (d) => d.Year) - 1, d3.max(dataset, (d) => d.Year) + 1]);

  let y = d3.scaleTime()
    .range([0, height - padding.top - padding.bottom]);
  
  var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));
  
  y.domain(d3.extent(dataset, (d) => d.Time));
  

  
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  svg.append("text")
    .text("Doping in Professional Cycling")
    .attr("id", "title")
    .attr("x", "50%")
    .attr("y", "40")
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle")
    .style("font-size", 28);
  
  svg.append("text")
    .text("35 Best Time Trials for Alpe d'Huez")
    .attr("x", "50%")
    .attr("y", "70")
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle")
    .style("font-size", 18);
  
  svg.append("text")
    .text("Time in Minutes")
    .attr("x", -220)
    .attr("y", 30)
    .attr("transform", "rotate(-90)")
    .style("font-size", 14);
  
  const legend1 = svg.append("g")
    .attr("id", "legend");
  
  legend1.append("text")
    .text("No doping allegations")
    .attr("x", width - padding.right - 4)
    .attr("y", (height - padding.top) / 2 + 12)
    .attr("text-anchor", "end")
    .style("font-size", 11);
    
  legend1.append("rect")
    .attr("x", width - padding.right)
    .attr("y", (height - padding.top) / 2)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", "rgb(255, 127, 14)");
  
  legend1.append("text")
    .text("Riders with doping allegations")
    .attr("x", width - padding.right - 4)
    .attr("y", (height - padding.top) / 2 + 12 + 22)
    .attr("text-anchor", "end")
    .style("font-size", 11);
    
  legend1.append("rect")
    .attr("x", width - padding.right)
    .attr("y", (height - padding.top) / 2 + 22)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", "rgb(31, 119, 180)");
  
  
  const circle = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 7.5)
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Time))
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .style("fill", (d) => d.Doping == "" ? "rgb(255, 127, 14)" : "rgb(31, 119, 180)")
    .attr("transform", "translate(" + padding.left + ", " + padding.top + ")");
  
  svg.append("g")
    .attr("transform", "translate(" + padding.left + ", " + (height - padding.bottom)  +")")
    .attr("id", "x-axis")
    .attr("class", "x axis")
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding.left + ", " + padding.top + ")")
    .attr("id", "y-axis")
    .call(yAxis);
  
  
  const tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip");
  
  
  circle.on("mouseover", function(d){ 
        return tooltip.style("visibility", "visible")
          .attr("data-year", d.Year)
          .html(d.Name + ': ' + d.Nationality + '<br /> Year: ' + d.Year + 
                ', TIme: ' + d3.timeFormat("%M:%S")(d.Time) + 
                (d.Doping == "" ? '' : '<br /><br />' + d.Doping));})
      .on("mousemove", function(){
        return tooltip.style("top", (d3.event.pageY-20)+"px")
          .style("left", (d3.event.pageX+20)+"px");})
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");});
});
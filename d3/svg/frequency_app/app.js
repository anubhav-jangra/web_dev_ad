var width  = 1200;
var height = 300;
var barPadding = 10;

d3.select("#reset")
    .on("click", function() {
      d3.selectAll(".letter")
        .remove();

      d3.select("#phrase")
          .text("");

      d3.select('"#count"')
          .text("");
    });

d3.select("form")
    .on("submit", function() {
      d3.event.preventDefault();
      var input = d3.select("input");
      var text = input.property("value");
      var data = getFrequencies(text);
      var numBars = data.length;
      var barWidth    = width / numBars - barPadding;

      var svg = d3.select('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .selectAll('rect')
                    .data(data, function(d) {
                        return d.character;
                    });
      svg
          .classed("new", false)
        .exit()
        .remove();

      d3.select('svg')
        .selectAll('text')
        .remove();

      svg
        .enter()
        .append("rect")
          .classed("new", true)
        .merge(svg)
          .attr('width', barWidth)
          .attr('height', function(d){
              return d.count*20;
          })
          .attr('y', function(d) {
              return height - d.count*20;
          })
          .attr('x', function(d, i){
              return (barWidth + barPadding) * i;
          });
      d3.select('svg')
      .selectAll('text')
      .data(data, function(d) {
          return d.character;
      })
        .enter()
        .append('text')
        .attr('x', function(d, i){
            return (barWidth + barPadding) * i + barWidth/2;
        })
        .attr('y', function(d) {
            return height - d.count*20;
        })
        .text(function(d){
            return d.character;
        })
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .attr('fill', 'black');

      d3.select("#phrase")
          .text("Analysis of: " + text);

      d3.select("#count")
          .text("(New characters: " + svg.enter().nodes().length + ")");

      input.property("value", "");
    });

function getFrequencies(str) {
  var sorted = str.split("").sort();
  var data = [];
  for (var i = 0; i < sorted.length; i++) {
    var last = data[data.length - 1];
    if (last && last.character === sorted[i]) last.count++;
    else data.push({ character: sorted[i], count: 1 });
  }
  return data;
}

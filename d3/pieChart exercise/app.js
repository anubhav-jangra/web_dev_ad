/* jshint esversion: 6 */
var width = 500;
var height = 500;
var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);

var months = [];
birthData.forEach(function(item) {
    if(months.indexOf(item.month) === -1) {
        months.push(item.month);
    }
});

var colorScale = d3.scaleOrdinal()
                        .domain(months)
                        .range(d3.schemeCategory20c);

var quaterColorScale = d3.scaleOrdinal()
                            .domain([0, 1, 2,3])
                            .range(d3.schemeCategory10);

d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
        .attr('transform', 'translate(' + width/2 + ', ' + height/2 + ')')
        .classed('outer-chart', true);

d3.select('svg')
    .append('g')
        .attr('transform', 'translate(' + width/2 + ', ' + height/2 + ')')
        .classed('inner-chart', true);

makeGraph(minYear);

d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', function() {
        makeGraph(+d3.event.target.value);
    });

function makeGraph(year) {
    d3.select('.title')
        .text('Birhts by months and quater for year: ' + year);
    var data = birthData.filter(d => d.year === year);

    var arcs = d3.pie()
      .value(d => d.births)
      .sort(function(a, b) {
          if(months.indexOf(a.months) > months.indexOf(b.month)) return 1;
          else if(months.indexOf(a.months) < months.indexOf(b.month)) return -1;
          else return 0;
      })
      (data);

    var path = d3.arc()
                  .outerRadius(width/2 - 10)
                  .innerRadius(width/4);

    var update = d3.select('.outer-chart')
                        .selectAll('.arc')
                        .data(arcs);

    update
      .exit()
      .remove();

    update
      .enter()
        .append('path')
        .classed('arc', true)
      .merge(update)
        .attr('fill', d => colorScale(d.data.month))
        .attr('stroke', 'black')
        .attr('d', path);

    var quaterData = [];
    for(let i = 0; i < 12; i++) {
        if(i % 3 === 0) {
            let tempObj = JSON.parse(JSON.stringify(data[i]));
            tempObj.index = i/3;
            delete tempObj.month;
            quaterData.push(tempObj);
        } else {
            quaterData[Math.floor(i/3)].births += data[i].births;
        }
    }

    var quaterArcs = d3.pie()
                        .value(d => d.births)
                        .sort(function(a, b) {
                            if(a.index > b.index) return 1;
                            else if(a.index < b.index) return -1;
                            else return 0;
                        })
                        (quaterData);

    var quaterPath = d3.arc()
                        .outerRadius(width/4 + 10)
                        .innerRadius(0);

    var quaterUpdate = d3.select('.inner-chart')
                            .selectAll('.arc')
                            .data(quaterArcs);

    quaterUpdate
        .exit()
        .remove();

    quaterUpdate
        .enter()
            .append('path')
            .classed('arc', true)
        .merge(quaterUpdate)
            .attr('fill', d => quaterColorScale(d.data.index))
            .attr('stroke', 'black')
            .attr('d', quaterPath);
}

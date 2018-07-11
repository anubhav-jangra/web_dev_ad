/* jshint esversion: 6 */
var width       = 700;
var height      = 500;
var barPadding  = 1;
var padding     = 60;
var data = regionData.filter(d => hasProperty(d));

var xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.medianAge))
                    .range([padding, width - padding]);

var xAxis = d3.axisBottom(xScale);

var histogram = d3.histogram()
                        .domain(xScale.domain())
                        .thresholds(xScale.ticks())
                        .value(d => d.medianAge);

var bins = histogram(data);

var yScale = d3.scaleLinear()
                    .domain([0, d3.max(bins, d => d.length)])
                    .range([height - padding, padding]);

var yAxis = d3.axisLeft(yScale);

var bars = d3.select('svg')
                  .attr('width', width)
                  .attr('height', height)
                .selectAll('.bar')
                .data(bins)
                .enter()
                .append('rect')
                  .classed('bar', true)
                    .attr('x', d => xScale(d.x0))
                    .attr('y', d => yScale(d.length))
                    .attr('width', d => xScale(d.x1) - xScale(d.x0) - barPadding)
                    .attr('height', d => height - yScale(d.length) - padding)
                    .attr('fill', '#3F51B5');

d3.select('svg')
    .append('g')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
            .classed('x-axis', true)
            .call(xAxis);

d3.select('svg')
    .append('g')
        .attr('transform', 'translate(' + (padding) + ', 0)')
            .classed('y-axis', true)
            .call(yAxis);

d3.select('svg')
    .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height/2)
        .attr('text-anchor', 'middle')
        .attr('dy', padding/3)
        .text('Frequency');

d3.select('svg')
    .append('text')
        .attr('x', width/2)
        .attr('y', height)
        .attr('text-anchor', 'middle')
        .attr('dy', -padding/5)
        .text('Median Age');

d3.select('.bin-count')
.text('Number of bins: ' + bins.length);

d3.select('input')
    .property('value', bins.length)
    .on('input', function() {
        var binCount = +d3.event.target.value;
        histogram.thresholds(xScale.ticks(binCount));
        bins = histogram(data);
        yScale.domain([0, d3.max(bins, d => d.length)]);
        d3.select('.y-axis')
            .call(d3.axisLeft(yScale));

        d3.select('.x-axis')
            .call(d3.axisBottom(xScale)
                        .ticks(binCount))
            .selectAll('text')
              .attr('x', 10)
              .attr('y', -3)
              .attr('transform', 'rotate(90)')
              .style('text-anchor', 'start');
              // .attr('x', -5)
              // .attr('y', 5)
              // .attr('transform', 'rotate(-30)')
              // .style('text-anchor', 'end');

        var rect = d3.select('svg')
                    .selectAll('rect')
                        .data(bins);
        rect
            .exit()
              .remove();

        rect
            .enter()
              .append('rect')
            .merge(rect)
              .classed('bar', true)
              .attr('x', d => xScale(d.x0))
              .attr('y', d => yScale(d.length))
              .attr('width', d => xScale(d.x1) - xScale(d.x0) - barPadding)
              .attr('height', d => height - yScale(d.length) - padding)
              .attr('fill', '#3F51B5');

        d3.select('.bin-count')
            .text('Number of bins: ' + bins.length);
    });

function hasProperty(data) {
    if(data.medianAge === null) return false;
    return true;
}

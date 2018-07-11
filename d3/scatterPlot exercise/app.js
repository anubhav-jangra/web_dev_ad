/* jshint esversion: 6*/
var height  = 500;
var width   = 500;
var padding = 50;

var data = regionData.filter(mustHaveKeys);

var yScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.subscribersPer100))
                    .range([height - padding, padding]);

var xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.adultLiteracyRate))
                    .range([padding, width - padding]);

var xAxis = d3.axisBottom(xScale)
                    .tickSize(-width + 2*padding)
                    .tickSizeOuter(0);

var yAxis = d3.axisLeft(yScale)
                    .tickSize(-height + 2*padding)
                    .tickSizeOuter(0);

var colorScale = d3.scaleLinear()
                        .domain(d3.extent(data, d => d.urbanPopulationRate))
                        .range(['darkblue', 'darkgreen']);

var radiusScale = d3.scaleLinear()
                        .domain(d3.extent(data, d => d.medianAge))
                        .range([5, 25]);

d3.select('svg')
    .append('g')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .call(xAxis);

d3.select('svg')
    .append('g')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis);

d3.select('svg')
        .attr('width', width)
        .attr('height', height)
    .selectAll('circles')
    .data(data)
    .enter()
    .append('circle')
        .attr('cx', d => xScale(d.adultLiteracyRate))
        .attr('cy', d => yScale(d.subscribersPer100))
        .attr('fill', d => colorScale(d.urbanPopulationRate))
        .attr('r', d => radiusScale(d.medianAge));

d3.select('svg')
    .append('text')
        .attr('x', width/2)
        .attr('y', height)
        .attr('dy', '-.5em')
        .attr('text-anchor', 'middle')
        .text('Literacy Rate, Aged 15 and Up');

d3.select('svg')
    .append('text')
        .attr('x', width/2)
        .attr('y', padding)
        .attr('dy', '-1em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '1.5em')
        .text('Cellular Subscriptions vs. Literacy Rate');

d3.select('svg')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height/2)
        .attr('y', padding)
        .attr('dy', '-1.5em')
        .attr('text-anchor', 'middle')
        .text('Cellular Subscriptions per 100 People');

function mustHaveKeys(obj) {
    var keys = [
        'subscribersPer100',
        'adultLiteracyRate',
        'medianAge',
        'urbanPopulationRate'
    ];
    for(var i = 0; i < keys.length; i++) {
        if(obj[keys[i]] === null ) return false;
    }
    return true;
}

/* jshint esversion: 6 */
var data = [];
var exceptionKeys = ['Country Code', 'Country Name', 'Indicator Code', 'Indicator Name'];

d3.queue()
    .defer(d3.csv, './methaneData.csv')
    .defer(d3.csv, './co2Data.csv')
    .defer(d3.csv, './renewableData.csv')
    .defer(d3.csv, './urbanPopData.csv')
    .defer(d3.csv, './population.csv')
    .await(function(error, methData, co2Data, renewableData, urbanPopData, population) {
        if(error) throw error;
        methData.forEach(function(item){
            Object.keys(item).forEach(function(year) {
                if(item[year] !== '' && exceptionKeys.indexOf(year) === -1) {
                    let tempObj = {
                        country: item['Country Name'],
                        countryCode: item['Country Code'],
                        year: year,
                        methaneEmission: Number(item[year])
                    };
                    data.push(tempObj);
                }
            });
        });
        var minYear = Number(d3.min(data, d => d.year));
        var maxYear = Number(d3.max(data, d => d.year));

        co2Data.forEach(function(item) {
            var i = data.findIndex(d => d.countryCode === item['Country Code']);
            if(data[i] == undefined) { return; }
            Object.keys(item).forEach(function(year) {
                if(minYear <= year && year <= maxYear) {
                    let j = i + Number(year) - minYear;
                    if(data[j].year === year && j <= data.length) {
                        data[j].co2Emission = Number(item[year]);
                    }
                }
            });
        });
        renewableData.forEach(function(item) {
            var i = data.findIndex(d => d.countryCode === item['Country Code']);
            if(data[i] == undefined) { return; }
            Object.keys(item).forEach(function(year) {
                if(minYear <= year && year <= maxYear) {
                    let j = i + Number(year) - minYear;
                    if(data[j].year === year && j <= data.length) {
                        data[j].renewableEnergy = Number(item[year]);
                    }
                }
            });
        });

        urbanPopData.forEach(function(item) {
            var i = data.findIndex(d => d.countryCode === item['Country Code']);
            if(data[i] == undefined) { return; }
            Object.keys(item).forEach(function(year) {
                if(minYear <= year && year <= maxYear) {
                    let j = i + Number(year) - minYear;
                    if(data[j].year === year && j <= data.length) {
                        data[j].urbanPopulation = Number(item[year]);
                    }
                }
            });
        });

        population.forEach(function(item) {
            var i = data.findIndex(d => d.countryCode === item['Country Code']);
            if(data[i] == undefined) { return; }
            Object.keys(item).forEach(function(year) {
                if(minYear <= year && year <= maxYear) {
                    let j = i + Number(year) - minYear;
                    if(data[j].year === year && j <= data.length) {
                        data[j].population = Number(item[year]);
                    }
                }
            });
        });
        createGraph();
    });

var width = 600;
var height = 600;
var padding = 50;
function createGraph() {
    var usableData = data.filter(mustHaveKeys);
    var minYear = d3.min(usableData, d => d.year);
    var maxYear = d3.max(usableData, d => d.year);
    makeGraph(usableData, minYear);
    d3.select('input')
        .property('min', minYear)
        .property('max', maxYear)
        .property('value', minYear)
        .on('input', function() {
            makeGraph(usableData, +d3.event.target.value);
        });
}

var tooltip = d3.select('body')
                    .append('div')
                        .classed('tooltip', true);

function makeGraph(usableData, year) {
    var yearData = usableData.filter(d => d.year == year);
    var xScale = d3.scaleLinear()
                        .domain(d3.extent(yearData, d => d.co2Emission / d.population))
                        .range([2*padding, width - 2*padding]);

    var xAxis = d3.axisBottom(xScale);

    var yScale = d3.scaleLinear()
                        .domain(d3.extent(yearData, d => d.methaneEmission / d.population))
                        .range([height - 2*padding, padding]);

    var yAxis = d3.axisLeft(yScale);

    var radiusScale = d3.scaleLinear()
                            .domain([0, 1])
                            .range([5, 30]);

    var colorScale = d3.scaleLinear()
                            .domain([0, 100])
                            .range(['black', 'green']);
    var svg = d3.select('svg')
                    .attr('width', width)
                    .attr('height', height);

    svg
        .selectAll('text')
        .remove();

    svg
        .selectAll('g')
        .remove();

    svg
      .append('text')
      .classed('title', true)
        .attr('transform', 'translate(' + width / 2 + ', ' + padding/2 + ')')
        .attr('text-anchor', 'middle')
        .attr('font-size', '1.5em')
        .text('Methane vs. CO2 emissions per Capita in ' + year);

    svg
      .append('text')
        .attr('x', width/2)
        .attr('y', height)
        .attr('dy', -padding/3)
        .attr('text-anchor', 'middle')
        .text('CO2 Emissions (kt per person))');

    svg
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height/2)
        .attr('dy', padding/3)
        .attr('text-anchor', 'middle')
        .text('Methane Emissions (kt of CO2 equivalent per person)');

    svg
      .append('g')
        .classed('x-axis', true)
          .attr('transform', 'translate(0, ' + (height - padding / 0.75) + ')')
          .call(xAxis);

    svg
      .append('g')
      .classed('y-axis', true)
        .attr('transform', 'translate(' + padding/0.75 + ', 0)')
        .call(yAxis);

    var update = d3.select('svg')
                        .selectAll('circle')
                        .data(yearData);

    update
      .exit()
      .remove();

    update
      .enter()
      .append('circle')
          .attr('cx', d => xScale(d.co2Emission / d.population))
          .attr('cy', d => yScale(d.methaneEmission / d.population))
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
        .merge(update)
        .on('mousemove', showTooltip)
        .on('mouseout', hideTooltip)
          .transition()
              .duration(500)
              .delay((d, i) => i * 5)
            .attr('cx', d => xScale(d.co2Emission / d.population))
            .attr('cy', d => yScale(d.methaneEmission / d.population))
            .attr('stroke', 'white')
            .attr('stroke-width', 1)
            .attr('r', d => radiusScale(d.urbanPopulation / d.population))
            .attr('fill', d => colorScale(d.renewableEnergy));
}

function mustHaveKeys(obj) {
    var keys = ['co2Emission', 'methaneEmission', 'renewableEnergy', 'urbanPopulation', 'population'];
    for(var i = 0; i < keys.length; i++) {
        if(obj[keys[i]] === '' || obj[keys[i]] == '0') return false;
        if(!(keys[i] in obj)) return false;
    }
    return true;
}

function showTooltip(d) {
    tooltip
        .style('opacity', 1)
        .style('left', d3.event.x - (tooltip.node().offsetWidth / 2) + 'px')
        .style('top', d3.event.y + 25 + 'px')
        .html(`
            <p>Country: ${d.country}</p>
            <p>Methane Per Capita: ${d.methaneEmission / d.population}</p>
            <p>CO2 Per Capita: ${d.co2Emission / d.population}</p>
            <p>Renewable Energy: ${d.renewableEnergy}%</p>
            <p>Urban Population: ${d.urbanPopulation / d.population * 100}%</p>
            `);
}

function hideTooltip() {
    tooltip
        .style('opacity', 0);
}

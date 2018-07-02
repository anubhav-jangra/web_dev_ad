/*jshint esversion: 6 */
var phrase = d3.select('#phrase');
var count = d3.select('#count');
var letters = d3.select('#letters');
var freq = {
    '1': {},
    '2': {}
};

d3.select('form').on('submit', function(){
    d3.event.preventDefault();
    var data = d3.select(this).select('input');
    var index;
    if(freq['1'] === {}) {
        index = '1';
    } else {
        index = '2';
    }
    for(var i = 0; i < data.property('value').length; i++) {
        // console.log(data.property('value')[i]);
        if(freq[index][data.property('value')[i]]) {
            freq[index][data.property('value')[i]] += 1;
        } else {
            freq[index][data.property('value')[i]] = 1;
        }
    }

    phrase.text(`Analysis of : ${data.property('value')}`);
    count.text(`(New characters: ${data.property('value').length})`);
    Object.keys(freq[index]).forEach(function(alphabet){
        letters
        .append('p')
        .text(alphabet)
        .classed('letter', true)
        .style('padding', '5px')
        .style('margin', '5px')
        .style('border-radius', '.2em')
        .style('height', 20*freq[alphabet] + 'px');
    });
    data.property('value', '');
});

d3.select('#reset').on('click', function() {
    phrase.text('');
    count.text('');
    letters.selectAll('p')
        .remove();
});

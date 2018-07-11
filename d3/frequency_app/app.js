// My solution

// /*jshint esversion: 6 */
// var phrase = d3.select('#phrase');
// var count = d3.select('#count');
// var letters = d3.select('#letters');
// var freq = -1;
// var freq1 = -1;
//
// d3.select('form').on('submit', function(){
//     d3.event.preventDefault();
//     var data = d3.select(this).select('input');
//     if(freq === -1) {
//         freq = {};
//         setValue(data, freq);
//     } else if(freq1 === -1){
//         freq1 = {};
//         setValue(data, freq1);
//     } else {
//         freq = freq1;
//         freq1 = {};
//         setValue(data, freq1);
//     }
//     reset();
//     phrase.text(`Analysis of : ${data.property('value')}`);
//     count.text(`(New characters: ${data.property('value').length})`);
//     Object.keys(freq).forEach(function(alphabet){
//         letters
//         .append('p')
//         .text(alphabet)
//         .classed('letter', true)
//         .classed('new', true)
//         .style('height', 20*freq[alphabet] + 'px');
//     });
//     Object.keys(freq1).forEach(function(alphabet){
//         letters
//         .append('p')
//         .text(alphabet)
//         .classed('letter', true)
//         .style('height', 20*freq1[alphabet] + 'px');
//     });
//     data.property('value', '');
// });
//
// d3.select('#reset').on('click', reset);
//
// function reset() {
//     phrase.text('');
//     count.text('');
//     letters.selectAll('p')
//         .remove();
// }
//
// function setValue(data, freq) {
//     for(let i = 0; i < data.property('value').length; i++) {
//         // console.log(data.property('value')[i]);
//         if(freq[data.property('value')[i]]) {
//             freq[data.property('value')[i]] += 1;
//         } else {
//             freq[data.property('value')[i]] = 1;
//         }
//     }
// }

// Instructor's approach

d3.select("#reset")
    .on("click", function() {
      d3.selectAll(".letter")
        .remove();

      d3.select("#phrase")
          .text("");

      d3.select("#count")
          .text("");
    });

d3.select("form")
    .on("submit", function() {
      d3.event.preventDefault();
      var input = d3.select("input");
      var text = input.property("value");

      var letters = d3.select("#letters")
                      .selectAll(".letter")
                      .data(getFrequencies(text), function(d) {
                        return d.character;
                      });

      letters
          .classed("new", false)
        .exit()
        .remove();

      letters
        .enter()
        .append("div")
          .classed("letter", true)
          .classed("new", true)
        .merge(letters)
          .style("width", "20px")
          .style("line-height", "20px")
          .style("margin-right", "5px")
          .style("height", function(d) {
            return d.count * 20 + "px";
          })
          .text(function(d) {
            return d.character;
          });

      d3.select("#phrase")
          .text("Analysis of: " + text);

      d3.select("#count")
          .text("(New characters: " + letters.enter().nodes().length + ")");

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

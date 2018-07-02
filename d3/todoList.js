var aNote = -1;
d3.select("#new-note").on("submit", function(){
    d3.event.preventDefault();
    var input = d3.select("input");
    d3.select("#notes")
        .append("p")
        .classed("note", true)
        .text(input.property("value"));
    input.property("value", "");
    d3.selectAll(".note").on("click", function(){
        d3.select(this).remove();
    });
    aNote.remove();
    aNote = -1;
});

d3.select('#remove-notes').on('click', function() {
    d3.selectAll('p')
    .remove();
});

d3.select('#lucky').on('click', function() {
    d3.selectAll('.note').nodes().forEach(function(note) {
        var fontSize = Math.floor(Math.random() * 50) + 'px';
        note.style.fontSize = fontSize;
        note.style.backgroundColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    });
});
d3.select('#new-note').on('input', function() {
    var data = d3.select('input').property('value');
    if(aNote === -1) {
        aNote = d3.select('#notes').append('p');
        aNote
        .classed("preview", true)
        .text(data);
    } else {
        aNote
        .classed("preview", true)
        .text(data);
    }
});

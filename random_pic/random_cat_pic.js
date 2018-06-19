$('#btn').click(function() {
    $.ajax({
        meathod: "GET",
        url: "http://aws.random.cat/meow",
        dataType: 'json'
    })
    .done(function(response){
        console.log(response.file);
        $('#cat-pic').css("background-image", "url(" + response.file + ")");
    })
    .fail(function() {
        console.log(error);
    });
});

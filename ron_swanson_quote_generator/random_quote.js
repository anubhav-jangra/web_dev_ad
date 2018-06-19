var quoteP = document.querySelector("#quote");
var axiosBtn = document.querySelector("#axios");
var xhrBtn = document.querySelector("#xhr");
var fetchBtn = document.querySelector("#fetch");

var url = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';

// XMLHttpRequest method
xhrBtn.addEventListener("click", function(){
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function() {
        if(XHR.readyState == 4 && XHR.status == 200) {
            var data = JSON.parse(XHR.responseText);
            quoteP.textContent = data[0];
        }
    };
    XHR.open("GET", url);
    XHR.send();
});

// Fetch approach
fetchBtn.addEventListener("click", function(){
    fetch(url)
    .then(function(request){ // Handel Errors
        if(!request.ok) {
            throw Error(request.status);
        } else {
            return request;
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        quoteP.textContent = data[0];
    })
    .catch(function(error){
        alert(error);
    });
});

$("#jquery").click(function(){
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json"
    })
    .done(function(response){
        $("#quote").text(response[0]);
    })
    .fail(function(error){
        alert(error);
    });
});

// For axios button
axiosBtn.addEventListener("click", function() {
    axios.get(url)
    .then(function(res) {
        quoteP.textContent = res.data[0];
    })
    .catch(function(err) {
        if (err.response) {
            console.log("PROBLLEM WITH RESPONSE!", err.response.status);
        } else if (err.request) {
            console.log("PROBLEM WITH REQUEST!");
        } else {
            console.log("ERROR", err.message);
        }
    });
});

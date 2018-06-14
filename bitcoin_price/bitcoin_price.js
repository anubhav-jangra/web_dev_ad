var btn = document.querySelector("#refresh");
var price = document.querySelector("#price");

var urlParams = new URLSearchParams(window.location.search);

window.addEventListener("load", getPrice, false);

btn.addEventListener("click", getPrice);

function getPrice(){
    var XML = new XMLHttpRequest();

    XML.onreadystatechange = function() {
        if(XML.readyState == 4 && XML.status == 200) {
            var currency = urlParams.toString() === "" ? "USD" : urlParams.toString().slice(-3);
            var data = JSON.parse(XML.responseText).bpi[currency].rate;
            price.textContent = data + " " + currency;
        }
    };

    XML.open("GET", "https://api.coindesk.com/v1/bpi/currentprice.json");
    XML.send();
}

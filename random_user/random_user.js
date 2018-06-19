var fullname    = document.querySelector("#fullname");
var username    = document.querySelector("#username");
var avatar      = document.querySelector("#avatar");
var email       = document.querySelector("#email");
var btn         = document.querySelector(".footer");
var city        = document.querySelector("#city");

var url = "https://randomuser.me/api/";

btn.addEventListener("click", function() {
    fetch(url)
    .then(handelErrors)
    .then(parseJSON)
    .then(updateProfile)
    .catch(printError);
});

function handelErrors(request) {
    if(!request.ok) {
        throw Error(request.status);
    } else {
        return request;
    }
}

function parseJSON(response) {
    return response.json();
}

function updateProfile(response) {
    var data = response.results[0];
    fullname.textContent            = data.name.first + " " + data.name.last;
    avatar.style.backgroundImage    = "url(" + data.picture.medium;
    username.textContent            = data.login.username;
    city.textContent                = data.location.city;
    email.textContent               = data.email;
}

function printError(error) {
    alert(error);
}

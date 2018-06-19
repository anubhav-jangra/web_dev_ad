var url = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json";

axios.get(url)
.then(function(res) {
    res.data.stadiums.forEach(function(data){
        console.log(data);
        var temp_div = document.createElement('div');
        temp_div.className = 'card';
        temp_div.innerHTML = '<div class="background-img" style="background-image: url(' +
        data.image + ')"></div> <p>' + '<strong>'+ data.name + '</strong>, <em>'  + data.city + '</em></p>';
        document.querySelector(".container").appendChild(temp_div);
    });
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

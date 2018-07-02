var button = document.querySelector('#click');

button.addEventListener('click', function() {
    var randColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ')';
    document.querySelector('.box1').style.backgroundColor = randColor;
});

document.querySelectorAll('.box').forEach(function(box) {
    box.addEventListener('mouseover', function() {
    var randColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ')';
    box.style.backgroundColor = randColor;
    });
});

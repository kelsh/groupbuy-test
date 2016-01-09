// variables
var line;
var socket;
var v;
var queue;
var pingTestArray = [];
var offSetArray = [];
var pingTestNumber = 1;
var fired = false;
var offset;
var newOffset;

function changeColors() {
    var a = $('#wow')

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    setInterval(function() {
        a.css('color', getRandomColor());
    }, 1183);
}

function playProgressBar() {
    line.animate(1.0, {
        duration: 8000
    });
}

function connectSocket() {
    socket = io.connect('http://kayimbo.com:3000');
    //event handlers
    socket.on('queue', function(data) {
        queue = data['users'];
        //loadAudio();  //load an audio file, start ping test
        loadAudio();
    });
    socket.on('pingTest', function(d) {
        var o = new Date().getTime()
        var a = d['time'] - o;
        pingTestArray.push({
            'd': d['offset'],
            'a': a
        });
        socket.emit("pingTestMe", {
            'time': o
        });
    });
    socket.on('pingTestOver', function() {
        console.log('recieve pingTestOver');
        analyze();
    });
    socket.on('ping', function(d) {
        console.log('recieve ping');
        v.currentTime = (d['time'] / 1000) - (newOffset / 1000) ;
        v.play();
    });

}




function loadAudio() {
    //src set from queue number
    v.setAttribute('src', '/audio/cannon.mp3');
}

function audioReady() {

    if (fired === false) {
        socket.emit("pingTestMe", {
            'time': new Date().getTime()
        });
        console.log('emit pingTestMe');
        playProgressBar();
        fired = true;
    }
}

function analyze() {

    var ar = pingTestArray;
    var n = 0;
    var m = 0;
    var nc = 0;
    var mc = 0;
    for (var i = 2; i < ar.length - 1; i++) {
        var k = ar[i];
        var bloop = ar[i-1]
        n = n + Math.abs(k['a']);
        m = m + Math.abs(k['d'] ) - Math.abs( bloop['d']);
        nc++;
        mc++;
    }
    newOffset = parseFloat(m/mc).toFixed(2);
    //calc offset here
    //at some point you have to do confidence calcs
    //and get rid of 1 standard deviation off
    //placeholder
    $("#offset").text(newOffset);
    socket.emit("pingMe", {});
    console.log('emit pingMe');
}


function init() {
    //set vars
    v = document.getElementsByTagName("audio")[0];
    line = new ProgressBar.Line('#progress-bar-offset', {
        color: '#FCB03C',
        strokeWidth: 6
    });

    //run initial functions
    changeColors();
    connectSocket();
}



$('document').ready(function() {
	$('#start').on('click',function(){
		  init();
	})
});

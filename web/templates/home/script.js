function create (s) {

	s.binaryType = "arraybuffer";
	
	s.onopen = function() {
	    console.log("Connected!");
	    isopen = true;
		Materialize.toast("Connected to " + s.url, 3000)
	    get_switch_stats()
		s.isopen = true
	}
	
	s.onmessage = function(e) {
	        console.log("Message received: " + e.data);
	        
	        // parse received data
	        if (e.data.split(" ")[0] === "PIN") {
	            var pin_number = e.data.split(" ")[1]
	            var pin_status = e.data.split(" ")[2]
	            
	            // select checkbox pertaining to gpiopin and toggle
	            var pin_switch = (document.getElementsByName(pin_number)[0])
	            if (pin_status === "0") {
	                pin_switch.checked = true
	            } else if (pin_status === "1") {
	                pin_switch.checked = false
	            }
	        }
	    
	}
	
	s.onclose = function(e) {
	    console.log("Connection closed.");
		socket = null;
	    isopen = false;
		Materialize.toast("Connection to " + s.url + " closed.", 5000)
	}
}



// get status of each switch's gpiopin
var get_switch_stats = function () {
    var boxes = document.getElementsByTagName('input');
    for (var x = 0; x < boxes.length; x++) {
        socket.send("PIN=" + boxes[x].name + ",IN,0")
    }
}


// get status at an interval
window.setInterval(function () {
    get_switch_stats()
}, 10000);


// send command to ws server to toggle gpio pin when switch is clicked
var switch_onclick = function(box) {
    if (socket.isopen != true) {
        Materialize.toast("Not connected to WebSocket server", 5000)
    }
    if (box.checked === true) {
        socket.send('PIN=' + box.name + ',OUT,0')
    } else if (box.checked === false) {
        socket.send('PIN=' + box.name + ',OUT,1')
    }
}


// start


window.onload = function() {
    
    // define and open main websocket connection
    hostname = window.location.hostname
	var wsport = document.getElementById("wsport").content
    socket = new WebSocket("ws://" + hostname + ":" + wsport);
    create(socket)
};




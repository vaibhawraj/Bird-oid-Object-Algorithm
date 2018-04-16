var boids = [];
var attractors = [];
var movers = [];

function addBoid(x,y) {
	console.log("Added new boid",x,y);
	boids.push(new Boid(x,y));
}
function addAttractor(x,y) {
	console.log("Added new boid",x,y);
	attractors.push(new Attractor(x,y));
}
function addMover(x,y) {
	console.log("Added new boid",x,y);
	movers.push(new Mover(x,y));
}

canvas.elem("#chain_container");
//var b = new Boid(100,100);
//b.draw(canvas);

//Key Press event
window.pointer = new Vector(0,0);
var applyForce = false;
var drawAlignment = true;
var drawSeparation = true;
var repelsionMaxSpeed = 20;
var repelsionForce = 2;
var drawBot = true;
var separationForce = false;
canvas.canvas.onmousemove = function(e){
	pointer.x = e.x;
	pointer.y = e.y;
}


window.onkeypress = function(e){
	if(e.key == "B" || e.key == "b") {
		addBoid(pointer.x,pointer.y);
	} else if(e.key == "P" || e.key == "p") {
		addAttractor(pointer.x,pointer.y);
	} else if(e.key == "O" || e.key == "o") {
		addMover(pointer.x,pointer.y);
	}
}
window.onkeyup = function(e){
	if(e.key == "B" || e.key == "b") {
		//addBoid(pointer.x,pointer.y);
	} else if(e.key == 'F' || e.key == 'f') {
		applyForce = !applyForce;
		console.log("Apply Force",applyForce);
	} else if(e.key == 'T' || e.key == 't') {
		separationForce = !separationForce;
		console.log("separationForce",separationForce);
	}
	else if(e.key == 'A' || e.key == 'a') {
		drawAlignment = !drawAlignment;
		console.log("drawAlignment",drawAlignment);
	}
	else if(e.key == 'S' || e.key == 's') {
		drawSeparation = !drawSeparation;
		console.log(" drawSeparation",drawSeparation);
	}
	else if(e.key == 'D' || e.key == 'd') {
		drawBot = !drawBot;
		console.log(" drawBot",drawBot);
	}
	if(e.key == 'M' || e.key == 'm') {
		for(var i = 10; i < canvas.canvas.width; i=i+100) {
			for(var j = 10; j < canvas.canvas.height; j=j+100) {
				addBoid(i,j);
			}
		}
	}
}

function loop() {
	canvas.clearCanvas();
	window.alignDistance = 90;
	window.separationDistance = 30;
	//Update and draw
	boids.forEach(function(boid) {
		boid.current.force = new Vector(0,0);
		
		//Steer Force
			var curSpeed = boid.current.velocity;
			var	desired = pointer.sub(boid.location);
			var maxDesired = 20;
			if(desired.magnitude() > maxDesired) {
				desired = desired.setMagnitude(maxDesired);
			}

			var steerForce = desired.sub(curSpeed);
			steerForce = steerForce.setMagnitude(1);
			if(applyForce)
				boid.applyForce(steerForce);

		//Separation Force
		var curSpeed = boid.current.velocity;
		var neighbours = boids.filter(function(b){return b.location.distance(boid.location) < separationDistance})
		if(neighbours.length > 1) {
			var	sepa = separation(neighbours);
			var desired = boid.location.sub(sepa);
			desired.setMagnitude(repelsionMaxSpeed);
			canvas.drawCircle("rgba(255,0,0,1)",sepa,5);
			//desired = desired.setMagnitude(-1 * desired.magnitude());
			//desired.setMagnitude(20);

			var steerForce = desired.sub(curSpeed);
			steerForce = steerForce.setMagnitude(1);
			if(separationForce)
				boid.applyForce(steerForce);
		}
		
		//Alignment Force
		var curSpeed = boid.current.velocity;
		var neighbours = boids.filter(function(b){return  b.location.distance(boid.location)>0 && b.location.distance(boid.location) < alignDistance});
		if(neighbours.length > 1) {
			var	desired = align(neighbours);
			desired = desired.setMagnitude(10);
			var steerForce = desired.sub(curSpeed);
			steerForce = steerForce.setMagnitude(1);
			boid.applyForce(steerForce);
		}
		
		
		//Cohesive Force
		/*var curSpeed = boid.current.velocity;
		var neighbours = boids.filter(function(b){return  b.location.distance(boid.location) < alignDistance})
		if(neighbours.length >= 1) {
			var	centroid = cohesive(neighbours);
			var desired = centroid.sub(boid.location);
			desired = desired.setMagnitude(1);
			var steerForce = desired.sub(curSpeed);
			steerForce = steerForce.setMagnitude(2);
			boid.applyForce(steerForce);
		}*/
		/*
		//Border Repelling force
		if(boid.location.y - 0 < 100) {
			var desiredSpeed = new Vector(0,100-boid.location.y);
			desiredSpeed.setMagnitude(10);
			var steerForce = desired.sub(curSpeed);
			steerForce = steerForce.setMagnitude(0.8);
			steerForce.x = 0;
			boid.applyForce(steerForce);
		}

		if(boid.location.x - 0 < 100) {
			var desiredSpeed = new Vector(100-boid.location.x,0);
			desiredSpeed.setMagnitude(10);
			var steerForce = desired.sub(curSpeed);
			steerForce = steerForce.setMagnitude(0.8);
			steerForce.y = 0;
			boid.applyForce(steerForce);
		}

		if(canvas.canvas.width - boid.location.x < 100) {
			var desiredSpeed = new Vector((canvas.canvas.width-boid.location.x) - 100,0);
			desiredSpeed.setMagnitude(10);
			var steerForce = desired.sub(curSpeed);
			steerForce = steerForce.setMagnitude(0.8);
			steerForce.y = 0;
			boid.applyForce(steerForce);
		}*/

		/* Deviate from walls by just steering away */

		var topWall = new Vector(canvas.canvas.width,0);
		var leftWall = new Vector(0,canvas.canvas.height);
		//Need distance of boid from this wall
		var projectionOnTop = boid.location.scalarProjectionOn(topWall);
		var projectionOnLeft = boid.location.scalarProjectionOn(leftWall);
		var projectionOnBottom = new Vector(projectionOnTop.x,canvas.canvas.height);
		var projectionOnRight = new Vector(canvas.canvas.width,projectionOnLeft.y);

		canvas.drawCircle("rgba(255,255,0,1)",projectionOnTop,5);
		canvas.drawCircle("rgba(255,255,0,1)",projectionOnLeft,5);
		canvas.drawCircle("rgba(255,255,0,1)",projectionOnRight,5);
		canvas.drawCircle("rgba(255,255,0,1)",projectionOnBottom,5);
		//boid.update();
	});

	boids.forEach(function(b){
		b.update();
	});

	var GravitationalPull = 10;
	//  Compute Force on movers
	/*movers.forEach(function(m) {
		m.current.force = m.current.force.setMagnitude(0);
		attractors.forEach(function(a){
			var forceMagnitude = (GravitationalPull * m.shape.mass * a.shape.mass)/Math.pow(m.location.distance(a.location),2);
			var force = a.location.sub(m.location).setMagnitude(forceMagnitude);
			m.applyForce(force);
		});
		//console.log(m.current.force.magnitude());
	});*/

	movers.forEach(function(m){
		m.current.force = m.current.force.setMagnitude(0);
		movers.forEach(function(m2){
			if(m.location.distance(m2.location) > 1) {
				var forceMagnitude = (GravitationalPull * m.shape.mass * m2.shape.mass)/Math.pow(m.location.distance(m2.location),2);
				var force = m2.location.sub(m.location).setMagnitude(forceMagnitude);
				m.applyForce(force);
			}
		});
	});
	
	//Merge
	for(var m1 = 0;m1<movers.length;m1++) {
		for(var m2 = m1 + 1;m2<movers.length;m2++) {
			if(movers[m1].location.distance(movers[m2].location) < (movers[m1].shape.radius + movers[m2].shape.radius)/2) {
				var m1m = movers[m1];
				var m2m = movers[m2];
				m1m.shape.radius = Math.sqrt(Math.pow(m1m.shape.radius,2) + Math.pow(m2m.shape.radius,2));
				m1m.shape.mass = m1m.shape.mass + m2m.shape.mass;

				m1m.applyForce(m2m.current.velocity);
				m1m.applyForce(m1m.current.velocity);
				
				movers.splice(m2,1);
				m2--;
			}
		}
	}
	for(var m1 = 0;m1<movers.length;m1++) {
		if(movers[m1].remove) {
			movers.splice(m1,1);
			m1--;
		}
	}

	

	movers.forEach(function(a) {
		a.update();
	});

	//Draw Attractors
	attractors.forEach(function(a) {
		a.draw(canvas);
	});

	//Draw Movers
	movers.forEach(function(a) {
		a.draw(canvas);
	});

	if(drawAlignment == true) {
		boids.forEach(function(boid) {
			boid.drawAlignment(canvas);
		});
	}
	if(drawSeparation == true) {
		boids.forEach(function(boid) {
			boid.drawSeparation(canvas);
		});
	}
	if(drawBot == true) {
		boids.forEach(function(boid) {
			boid.draw(canvas);
		});
	}
	
}

function align(neighbours) {
	var common = new Vector(0,0);
	if(neighbours.length == 0) return common;
	for(var i=0;i<neighbours.length;i++) {
		common = common.add(neighbours[i].current.velocity);
	}
	common.x = common.x / neighbours.length;
	common.y = common.y / neighbours.length;
	return common;
}

function cohesive(neighbours) {
	var common = new Vector(0,0);
	if(neighbours.length == 0) return common;
	for(var i=0;i<neighbours.length;i++) {
		common.x += neighbours[i].location.x;
		common.y += neighbours[i].location.y;
	}
	common.x = common.x / neighbours.length;
	common.y = common.y / neighbours.length;
	return common;
}

function separation(neighbours) {
	var common = new Vector(0,0);
	if(neighbours.length == 0) return common;
	for(var i=0;i<neighbours.length;i++) {
		common.x += neighbours[i].location.x;
		common.y += neighbours[i].location.y;
	}
	common.x = common.x / neighbours.length;
	common.y = common.y / neighbours.length;
	return common;
}


var interval = 100;
var loopInterval = setInterval(loop,interval);

for(var i = 10; i < canvas.canvas.width; i=i+100) {
	for(var j = 10; j < canvas.canvas.height; j=j+100) {
		//addBoid(i,j);
	}
}
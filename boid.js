(function(window){
	// boid
	function toRadians (angle) {
		  return angle * (Math.PI / 180);
		}
	function toDegree (radian) {
	  return radian * (180 / Math.PI);
	}
	
	var Boid = function(x,y){
		this.location = new Vector(x,y); 
		this.shape = {
			base : 10,
			height : 20,
			mass : 1
		};
		this.current = {
			velocity : new Vector(-10 + (Math.random()*20),-10 + (Math.random()*20)),
			accelaration : new Vector(0,0),
			force : new Vector(0,0)
		}
		this.limit = {
			"velocity" : 20,
			"accelaration" : 20,
			"force" : 5
		};
		
		this.drawAlignment = function(canvas) {
			canvas.drawCircle("rgba(0,255,0,0.2)",this.location,window.alignDistance);
		}
		this.drawSeparation = function(canvas) {
			canvas.drawCircle("rgba(255,0,0,0.2)",this.location,window.separationDistance);
		}
		this.draw = function(canvas) {
			var pointA = new Vector(0,0);
			var pointB = new Vector(0,0);
			var pointC = new Vector(0,0);
			var direction = this.current.velocity.add(new Vector(0,0));
			direction = direction.setMagnitude(1);
			var perpendicular = new Vector(-direction.y,direction.x);

			pointA = pointA.add(this.location);
			pointA = pointA.add(direction.setMagnitude(-this.shape.height/2));
			pointA = pointA.add(perpendicular.setMagnitude(this.shape.base/2));
			
			pointB = pointB.add(this.location);
			pointB = pointB.add(direction.setMagnitude(this.shape.height/2));

			pointC = pointC.add(this.location);
			pointC = pointC.add(direction.setMagnitude(-this.shape.height/2));
			pointC = pointC.add(perpendicular.setMagnitude(-this.shape.base/2));

			canvas.drawLine("black",this.location,pointB);
			canvas.drawLine("black",pointA,pointB);
			canvas.drawLine("black",pointB,pointC);
			canvas.drawLine("black",pointA,pointC);
			canvas.drawCircle("black",pointB,3);
		}
		this.update = function(){
			//F = ma
			//v = at
			//x = vt
			this.current.accelaration = this.current.force;
			this.current.velocity = this.current.velocity.add(this.current.accelaration);
			
			if(this.current.velocity.magnitude() > this.limit.velocity) {
				this.current.velocity = this.current.velocity.setMagnitude(this.limit.velocity);
			}
			this.location = this.location.add(this.current.velocity);


			//Apply border;
			if(this.location.x > canvas.canvas.width) this.location.x = 0;
			if(this.location.x < 0) this.location.x = canvas.canvas.width;
			if(this.location.y > canvas.canvas.height) this.location.y = 0;
			if(this.location.y < 0) this.location.y = canvas.canvas.height;
		}
		this.applyForce = function(force){
			this.current.force = this.current.force.add(force);
			if(this.current.force.magnitude() > this.limit.force)
				this.current.force = this.current.force.setMagnitude(this.limit.force);
		}
	}
	window.Boid = Boid;
})(window);
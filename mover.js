(function(window){
	var Mover = function(x,y){
		this.location = new Vector(x,y);
		this.remove = false;
		this.shape = {
			name : 'circle',
			radius : 2,
			color : 'green',
			mass : 2
		}
		this.limit = {
			velocity: 10
		}
		this.current = {
			velocity : new Vector(-10 + (Math.random()*20),-10 + (Math.random()*20)),
			accelaration : new Vector(0,0),
			force : new Vector(0,0)
		}
		this.draw = function(canvas){
			canvas.drawCircle(this.shape.color,this.location,this.shape.radius);
		}
		this.update = function(){
			this.current.accelaration.x = this.current.force.x/this.shape.mass;
			this.current.accelaration.y = this.current.force.y/this.shape.mass;
			this.current.velocity = this.current.velocity.add(this.current.accelaration);
			
			if(this.current.velocity.magnitude() > this.limit.velocity) {
				this.current.velocity = this.current.velocity.setMagnitude(this.limit.velocity);
			}
			this.location = this.location.add(this.current.velocity);


			//Apply border;
			if(this.location.x > canvas.canvas.width) {this.remove=true;this.location.x = 0;}
			if(this.location.x < 0) {this.remove=true;this.location.x = canvas.canvas.width;}
			if(this.location.y > canvas.canvas.height) {this.remove=true;this.location.y = 0;}
			if(this.location.y < 0) {this.remove=true;this.location.y = canvas.canvas.height;}
			this.remove=false;

		}
		this.applyForce = function(force){
			this.current.force = this.current.force.add(force);
		}
	};
	window.Mover = Mover;
})(window);
(function(window){
	var Vector = function(x,y) {
		this.x = x;
		this.y = y;
		this.distance = function(v){
			return Math.sqrt(Math.pow(this.x - v.x,2) + Math.pow(this.y - v.y,2))	
		}
		this.magnitude = function(){ return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2))}
		this.setMagnitude = function(newMag){
			if(this.magnitude() == 0) {
				return new Vector(this.x,this.y);
			}
			var unitX = this.x/this.magnitude();
			var unitY = this.y/this.magnitude();
			x = unitX * newMag;
			y = unitY * newMag;
			return new Vector(x,y);
		}
		this.scalarMult = function(s) {
			return new Vector(this.x*s,this.y*s);
		}
		this.dot = function(v){
			return (this.x * v.x) + (this.y * v.y);
		}
		this.angleBetween = function(v){
			return Math.cosh(this.dot(v) / (this.magnitude() * v.magnitude()));
		}
		this.scalarProjectionOn = function(v){
			// SP = |A| * cos theta ; where theta is angle between two vector
			// Projection point = vUnit * SP
			// cos theta = A.B / |A|*|B|
			//  Therefore, SP = (A.B) / |B|
			// Projection = vUnit * SP
			return v.setMagnitude(this.dot(v) / v.magnitude());
		}
		this.add = function(v) {return new Vector(this.x+v.x,this.y+v.y);}
		this.sub = function(v) {return new Vector(this.x-v.x,this.y-v.y);}
		this.rotate = function(degree,origin) {
			if(typeof(origin)=="undefined") {
				origin = new Vector(0,0);
			}

			//Translate this point to origin
			this.x = this.x - origin.x;
			this.y = this.y - origin.y;

			//Rotate
			var s = Math.sin(toRadians(degree));
			var c = Math.cos(toRadians(degree));

			var newx = (this.x * c) - (this.y * s);
			var newy = (this.x * s) + (this.y * c);

			this.x = newx;
			this.y = newy;

			//Translate back
			this.x = this.x + origin.x;
			this.y = this.y + origin.y;
			return this;
		};
		return null;
	}
	window.Vector = Vector;
})(window);
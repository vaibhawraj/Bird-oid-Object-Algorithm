(function(window){
	var Attractor = function(x,y){
		this.location = new Vector(x,y);
		this.shape = {
			name : 'circle',
			radius : 10,
			color : 'red',
			mass : 50
		}
		this.limit = {
			"velocity" : 20
		};
		this.draw = function(canvas){
			canvas.drawCircle(this.shape.color,this.location,this.shape.radius);
		}
	};
	window.Attractor = Attractor;
})(window);
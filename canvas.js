(function(window){
	var canvas = {
		canvas : null,
		canvasCtx : null,
		outerContainerEl : null,
		elem : function(elemId){
			this.outerContainerEl = document.querySelector(elemId);
			c = document.createElement('canvas');
			this.height = parseInt(this.outerContainerEl.style.height);
			this.width = parseInt(this.outerContainerEl.style.width);
			c.setAttribute("height",this.height + 'px');
			c.setAttribute("width",this.width + 'px');
			this.canvas = c;
			this.outerContainerEl.appendChild(this.canvas);
			this.canvasCtx = this.canvas.getContext("2d");
		},
		clearCanvas: function() {
    		this.canvasCtx.clearRect(0, 0, this.width,this.height);
  		},
		drawCircle : function(color,center,radius){
			this.canvasCtx.beginPath();
			this.canvasCtx.fillStyle = color;
			this.canvasCtx.arc(center.x,center.y,radius,0,2*Math.PI);
			this.canvasCtx.fill();
			this.canvasCtx.closePath();
		},
		drawLine : function(color,point1,point2){
			this.canvasCtx.beginPath();
			this.canvasCtx.moveTo(point1.x,point1.y);
			this.canvasCtx.lineTo(point2.x,point2.y);
			this.canvasCtx.strokeStyle = color;
			this.canvasCtx.stroke();
			this.canvasCtx.closePath();
		},
		drawGrid : function(point1,point2){},
		drawScore : function(){
			this.drawText("Score : "+Score.score,20);
			this.drawText("Level : "+Score.level,45);
			this.drawText("Target Ball : "+Score.targetBall,70);
		},
		drawText : function(text,y) {
			this.canvasCtx.fillStyle = 'rgb(200,50,14)';
			this.canvasCtx.font="20px Georgia";
			this.canvasCtx.fillText(text,10,y);
		}
	};
	window.canvas = canvas
})(window);
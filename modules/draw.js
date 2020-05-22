function axes(canvas, {lineWidth = 2, color = "blue"}={}) {
	const {width, height} = canvas;
	const ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	ctx.moveTo(width/2, 0);
	ctx.lineTo(width/2, height);
	ctx.moveTo(0, height/2);
	ctx.lineTo(width, height/2);
	ctx.stroke();
}

function grid(canvas, {spacing = 25, lineWidth = 1, color = "lightblue"}={}) {
	const {width, height} = canvas;
	const ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	for(let x=0; x < width/2; x += spacing){
		ctx.moveTo(width/2+x,0);
		ctx.lineTo(width/2+x,height);
		ctx.moveTo(width/2-x,0);
		ctx.lineTo(width/2-x,height);
	}
	for(let y=0; y < height/2; y += spacing){
		ctx.moveTo(0,height/2+y);
		ctx.lineTo(width,height/2+y);
		ctx.moveTo(0,height/2-y);
		ctx.lineTo(width,height/2-y);
	}
	ctx.stroke();
}

function clear(canvas) {
	const {width, height} = canvas;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,width, height);
}

export {axes, grid, clear};
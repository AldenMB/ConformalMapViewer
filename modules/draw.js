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

function swap(canvas1, canvas2) {
	const ctx1 = canvas1.getContext("2d");
	const ctx2 = canvas2.getContext("2d");
	const {width:w1, height:h1} = canvas1;
	const {width:w2, height:h2} = canvas2;
	const temp = ctx2.getImageData(0, 0, w2, h2);
	ctx2.putImageData(ctx1.getImageData(0,0,w1,h1), 0, 0);
	ctx1.putImageData(temp, 0, 0);
}

//based on the tutorial at https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/
function touch_listener(canvases, toolbar){
	let linesize, linecolor, selected_tool;
	onToolChange();
	onLineSizeChange();
	onColorChange();
	for(let canvas of canvases){
		add_drawing_listeners(canvas);
	}
	toolbar.brush_size.oninput = onLineSizeChange;
	toolbar.brush_color.oninput = onColorChange;
	for(let tool of toolbar.tools){
		tool.addEventListener('click', onToolChange, false);
	}
	
	function onToolChange(){
		for(let tool of toolbar.tools){
			if(tool.checked){
				selected_tool = tool.id;
			}
		}
	}
	
	function onLineSizeChange(){
		linesize = toolbar.brush_size.value;
		redraw_brush_preview();
	}
	
	function onColorChange(){
		linecolor = toolbar.brush_color.value;
		redraw_brush_preview();
	}
	
	function redraw_brush_preview(){
		clear(toolbar.brush_preview);
		const ctx = toolbar.brush_preview.getContext("2d");
		ctx.fillStyle = linecolor;
		ctx.beginPath();
		ctx.arc(
			toolbar.brush_preview.width/2,
			toolbar.brush_preview.height/2,
			linesize/2,
			0, 
			Math.PI*2
		);
		ctx.closePath();
		ctx.fill()
	}
	
	function add_drawing_listeners(canvas){
		let mouse_is_down = false;
		let mousex, mousey, touchx, touchy, lastx = -1, lasty = -1;
		const ctx = canvas.getContext("2d");
		
		canvas.addEventListener('mousedown', onMouseDown, false);
		canvas.addEventListener('mousemove', onMouseMove, false);
		window.addEventListener('mouseup', onMouseUp, false);
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		
		function drawLine(x, y){
			if(selected_tool !== "brush"){
				return;
			}			
			if(lastx === -1){
				lastx = x;
				lasty = y;
			}
			ctx.strokeStyle = linecolor;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.lineWidth = linesize;
			ctx.beginPath();
			ctx.moveTo(lastx, lasty);
			ctx.lineTo(x, y);
			ctx.stroke();
			lastx = x;
			lasty = y;
		}
		function onMouseDown(){
			mouse_is_down = true;
			drawLine(mousex, mousey);
		}
		function onMouseUp(){
			mouse_is_down = false;
			lastx = -1;
			lasty = -1;
		}
		function onMouseMove(e){
			getMousePosition(e);
			if(mouse_is_down){
				drawLine(mousex, mousey);
			}
		}
		function getMousePosition(e){
			if(!e){
				e = event;
			}
			if(e.offsetX){
				mousex = e.offsetX;
				mousey = e.offsetY;
			} else if(e.layerX){
				mousex = e.layerX;
				mousey = e.layerY;
			}
		}
		function onTouchStart(){
			getTouchPosition();
			drawLine(touchx, touchy);
			event.preventDefault();
		}
		function onTouchEnd(){
			lastx = -1;
			lasty = -1;
		}
		function onTouchMove(e){
			getTouchPosition(e);
			drawLine(touchx, touchy);
			event.preventDefault();
		}
		function getTouchPosition(e){
			if(!e){
				e = event;
			}
			if(e.touches && e.touches.length === 1){
				const t = e.touches[0];
				touchx = t.pageX-t.target.offsetLeft;
				touchy = t.pageY-t.target.offsetTop;
			}
		}
	}	
}

export {axes, grid, clear, swap, touch_listener};
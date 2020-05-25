import {clear} from './draw.js';

function apply_stamp(canvas,x,y,img){
	const ctx = canvas.getContext("2d");
	const {width, height} = img;
	ctx.drawImage(img, x-width/2, y-height/2);
}

function get_image(callback){
	const img = new Image();
	img.onload = callback;
	const input = document.createElement('input');
	input.type = 'file';
	input.onchange = receive_image;
	input.click();
	
	function receive_image(e){
		img.src = URL.createObjectURL(e.target.files[0]);
	}
	
	return img;
}

function new_stamp(id, img){
	const radio = document.createElement('input');
	radio.type = 'radio';
	radio.id = id;
	radio.name = 'stamp_select';
	const label = document.createElement('label');
	label.for = id;
	const slider = document.createElement('input');
	slider.type = 'range';
	slider.min = 0;
	slider.max = 400;
	slider.value = 50;
	slider.oninput = resize_canvas;
	label.appendChild(slider);
	const canvas = document.createElement('canvas');
	canvas.style = "border:1px solid #000000;";
	if(!img){
		img = get_image(resize_canvas);
	} else {
		resize_canvas();
	}
	label.appendChild(canvas);
	
	return {canvas, radio, label};
	
	function resize_canvas(){
		canvas.width = slider.value;
		canvas.height = slider.value;
		let {width:iw, height:ih} = img;
		if(iw<ih){
			iw *= canvas.height/ih;
			ih = canvas.height;
		} else if(ih<iw){
			ih *= canvas.width/iw;
			iw = canvas.width;
		} else {
			ih = canvas.height;
			iw = canvas.width;
		}
		const ctx = canvas.getContext("2d");
		clear(canvas);
		ctx.drawImage(img, (canvas.width-iw)/2, (canvas.height-ih)/2, iw, ih);
	}
}

function add_listeners(canvases, toolbar, included_stamps, stamp_selector, newstamp_button){
	let selected_tool, selected_image;
	onToolChange();
	for(let tool of toolbar.tools){
		tool.addEventListener('click', onToolChange, false);
	}
	const stamplist = [];
	for(let i=0; i<included_stamps.length; ++i){
		stamplist.push(new_stamp("stamp"+i, included_stamps[i]));
	}
	stamplist.forEach(register_stamp);
	newstamp_button.onclick = get_new_stamp;
	canvases.forEach(add_stamp_listeners);
	
	if(!stamplist.some(st => st.radio.checked)){
		stamplist[0].radio.click();
	}
	
	function add_stamp_listeners(canvas){
		canvas.addEventListener('mousedown', onMouseDown, false);
		
		function onMouseDown(e){
			if(selected_tool !== 'stamp'){
				return;
			}
			const {x, y} = getMousePosition(e);
			apply_stamp(canvas, x, y, selected_image);
		}
		function getMousePosition(e){
			let x, y;
			if(!e){
				e = event;
			}
			if(e.offsetX){
				x = e.offsetX;
				y = e.offsetY;
			} else if(e.layerX){
				x = e.layerX;
				y = e.layerY;
			}
			return {x,y}
		}
	}
	
	function get_new_stamp(){
		const id = "stamp"+stamplist.length;
		const stamp = new_stamp(id);
		stamplist.push(stamp);
		register_stamp(stamp);
	}
	
	function onToolChange(){
		for(let tool of toolbar.tools){
			if(tool.checked){
				selected_tool = tool.id;
			}
		}
	}
	
	function register_stamp(stamp){
		stamp_selector.appendChild(stamp.radio);
		stamp_selector.appendChild(stamp.label);
		stamp_selector.appendChild(document.createElement('div'));
		stamp.radio.onclick = function(){
			if(stamp.radio.checked){
				selected_image = stamp.canvas;
			}
		}
		stamp.radio.onclick();
	}
}

export {add_listeners};

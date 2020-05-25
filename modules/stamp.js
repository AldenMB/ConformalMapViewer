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

function add_stamp(stamplist){
	const div = document.createElement('div');
	const radio = document.createElement('input');
	radio.type = 'radio';
	const id = 'stamp'+stamplist.length;
	radio.id = id;
	const label = document.createElement('label');
	label.for = id;
	div.appendChild(radio);
	div.appendChild(label);
	div.appendChild(document.createElement('br'));
	const slider = document.createElement('input');
	slider.type = 'range';
	slider.min = 0;
	slider.max = 400;
	slider.value = 50;
	label.appendChild(slider);
	const canvas = document.createElement('canvas');
	canvas.width = slider.value;
	canvas.height = slider.value;
	const img = get_image(resize_canvas);
	
	function resize_canvas(){
		
	}
}

function add_listeners(canvases, toolbar){
	let selected_tool;
	
	function onToolChange(){
		for(let tool of toolbar.tools){
			if(tool.checked){
				selected_tool = tool.id;
			}
		}
	}
	
	function new_stamp(){
		
	}
}



import {clear} from './draw.js';

function apply_stamp(canvas,x,y,img){
	const ctx = canvas.getContext("2d");
	const {width, height} = img;
	ctx.drawImage(img, x-width/2, y-height/2);
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



import * as draw from './modules/draw.js';
import {preimage, image_draw} from './modules/transform.js';

function get_user_function(){
	const input = document.getElementById("user_supplied_function").value;
	const display = document.getElementById("parsed_function");
	const f = math.parse(input);
	display.innerHTML = f.toString(); //use toTex to get latex
	window.user_function = f.compile();
}

window.onload = function() {
	const domain = document.getElementById("domain_canvas");
	const codomain = document.getElementById("codomain_canvas");
	get_user_function()
	document.getElementById('domain_clear').onclick = function(){
		draw.clear(domain);
	}
	document.getElementById('codomain_clear').onclick = function(){
		draw.clear(codomain);
	}
	document.getElementById('domain_grid').onclick = function(){
		draw.grid(domain);
	}
	document.getElementById('codomain_grid').onclick = function(){
		draw.grid(codomain);
	}
	document.getElementById('domain_axes').onclick = function(){
		draw.axes(domain);
	}
	document.getElementById('codomain_axes').onclick = function(){
		draw.axes(codomain);
	}
	document.getElementById('parser').onclick = get_user_function
	document.getElementById('preimage').onclick = function(){
		preimage(window.user_function, domain, codomain);
	}
	document.getElementById('image').onclick = function(){
		image_draw(window.user_function, domain, codomain);
	}
	draw.grid(codomain);
	draw.grid(domain);
	draw.axes(codomain);
	draw.axes(domain);
}
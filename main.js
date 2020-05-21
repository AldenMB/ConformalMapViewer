import * as draw from './modules/draw.js';

window.onload = function() {
	let domain = document.getElementById("domain_canvas");
	let codomain = document.getElementById("codomain_canvas");
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
	
}
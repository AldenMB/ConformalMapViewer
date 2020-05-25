import * as draw from './modules/draw.js';
import {preimage, image_draw} from './modules/transform.js';
import {load_image} from './modules/load_image.js';
import * as stamp from './modules/stamp.js';

function get_user_function(){
	const input = document.getElementById("user_supplied_function").value;
	const display = document.getElementById("parsed_function");
	try {
		const f = math.parse(input);
		display.innerHTML = f.toString();
		const latex = f.toTex({parenthesis: 'hide', implicit: 'hide'});
		const elem = MathJax.Hub.getAllJax('jax')[0];
		if(elem){
			MathJax.Hub.Queue(['Text', elem, latex]);
		}
		window.user_function = f.compile();
	} catch (e) {
		if (e instanceof SyntaxError){
			display.innerHTML = "could not parse input";
		} else {
			throw(e);
		}
	}
}


function add_hover_coords(canvas, display, unit = 100){
	canvas.addEventListener('mousemove', function(e){
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const re = (x - canvas.width/2) / unit;
		const im = (canvas.height/2 - y) / unit;
		let re_str = re.toFixed(2);
		if(re_str >= 0){
			re_str = ' '+re_str;
		}
		let im_str;
		if(im>=0){
			im_str = ' + ' + im.toFixed(2);
		} else {
			im_str = ' - ' + (-im).toFixed(2);
		}
		const theta = Math.atan2(im, re);
		const theta_str = theta>=0? ' '+theta.toFixed(2) : theta.toFixed(2);
		const r = Math.hypot(im, re);
		display.innerHTML = re_str+im_str+'i (r='+r.toFixed(2)+', θ='+theta_str+')' ;
	});
}

window.onload = function() {
	const domain = document.getElementById("domain_canvas");
	const codomain = document.getElementById("codomain_canvas");
	const toolbar = {
		tools: document.getElementsByName("tool"),
		brush_color: document.getElementById("brush_color"),
		brush_size: document.getElementById("brush_size"),
		brush_preview: document.getElementById("brush_preview")
	}
	draw.touch_listener([domain,codomain], toolbar);
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
	document.getElementById('swap').onclick = function(){
		draw.swap(domain,codomain);
	}
	document.getElementById('preimage').onclick = function(){
		preimage(window.user_function, domain, codomain);
	}
	document.getElementById('image').onclick = function(){
		image_draw(window.user_function, domain, codomain);
	}
	document.getElementById('domain_load').onclick = function(){
		load_image(domain);
	}
	document.getElementById('codomain_load').onclick = function(){
		load_image(codomain);
	}
	add_hover_coords(domain, document.getElementById("coords"));
	add_hover_coords(codomain, document.getElementById("coords"));
	document.getElementById("user_supplied_function").oninput = get_user_function;
	stamp.add_listeners(
		[domain,codomain],
		toolbar,
		document.getElementById("default_stamps").getElementsByTagName('img'),
		document.getElementById("stamp_select"),
		document.getElementById("add_stamp")
	);
	draw.grid(codomain);
	draw.grid(domain);
	draw.axes(codomain);
	draw.axes(domain);
	get_user_function();
}
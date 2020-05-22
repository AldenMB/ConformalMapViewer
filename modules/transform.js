function complex2pixel(complex, width, height, unit){
	const x = math.re(complex)*unit + width/2;
	const y = -math.im(complex)*unit + height/2;
	return {x:Math.round(x),y:Math.round(y)};
}

function pixel2complex(x, y, width, height, unit){
	const real = (x - width/2)/unit;
	const imaginary = -(y - height/2)/unit;
	return math.complex(real, imaginary);
}

function preimage(func, domain, codomain, domain_unit = 100, codomain_unit = 100){
	const {width:dwidth, height:dheight} = domain.getBoundingClientRect();
	const dctx = domain.getContext("2d");
	const {width:cwidth, height:cheight} = codomain.getBoundingClientRect();
	const cctx = codomain.getContext("2d");
	for(let x=0; x < dwidth; ++x){
		for(let y=0; y < dheight; ++y){
			const dom_num = pixel2complex(x, y, dwidth, dheight, domain_unit);
			const cod_num = func.evaluate({x:dom_num}).valueOf()[0];
			const {x:cod_x, y: cod_y} = complex2pixel(cod_num, cwidth, cheight, codomain_unit);
			const imdat = cctx.getImageData(cod_x, cod_y, 1, 1);
			dctx.putImageData(imdat, x, y);
		}
	}
}

function image_draw(func, domain, codomain, domain_unit = 25, codomain_unit = 25){
	
}

export {preimage, image_draw}
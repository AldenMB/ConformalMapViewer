function clamp(num, min, max){
	return Math.max(min, Math.min(max, num));
}

function condition_pix(pixel, width, height){
	let {x, y} = pixel;
	x = clamp(x, 0, width-1);
	y = clamp(y, 0, height-1);
	x = Math.round(x);
	y = Math.round(y);
	return {x,y};
}

function complex2pixel(complex, width, height, unit){
	const x = math.re(complex)*unit + width/2;
	const y = -1*math.im(complex)*unit + height/2;
	return {x, y};
}

function pixel2complex(x, y, width, height, unit){
	const real = (x - width/2)/unit;
	const imaginary = -(y - height/2)/unit;
	return math.complex(real, imaginary);
}

function pixelmap(domain_pixel, func, domain, codomain, domain_unit, codomain_unit){
	const {width:dwidth, height:dheight} = domain;
	const {width:cwidth, height:cheight} = codomain;
	const {x, y} = domain_pixel;
	const dnum = pixel2complex(x, y, dwidth, dheight, domain_unit);
	let cnum = func.evaluate({x:dnum});
	if(cnum instanceof math.ResultSet){
		cnum = cnum.entries[0];
	}
	return complex2pixel(cnum, cwidth, cheight, codomain_unit);
}

function preimage(func, domain, codomain, domain_unit = 100, codomain_unit = 100){
	const {width:dwidth, height:dheight} = domain;
	const dctx = domain.getContext("2d");
	const {width:cwidth, height:cheight} = codomain;
	const cctx = codomain.getContext("2d");
	const codomain_data = cctx.getImageData(0, 0, cwidth, cheight);
	const domain_data = dctx.createImageData(dwidth, dheight);
	for(let dx=0; dx<dwidth; ++dx){
		for(let dy=0; dy<dheight; ++dy){
			const unconditioned = pixelmap({x:dx, y:dy}, func, domain, codomain, domain_unit, codomain_unit);
			const {x: cx, y:cy} = condition_pix(unconditioned, cwidth, cheight);
			const ci = 4*(cy*cwidth+cx);
			const di = 4*(dx+dwidth*dy);
			for(let j of [0,1,2,3]) {
				domain_data.data[di+j] = codomain_data.data[ci+j];
			}
		}
	}
	dctx.putImageData(domain_data, 0, 0);
}

function image_draw(func, domain, codomain, domain_unit = 100, codomain_unit = 100){
	const {width:dwidth, height:dheight} = domain;
	const dctx = domain.getContext("2d");
	const {width:cwidth, height:cheight} = codomain;
	const cctx = codomain.getContext("2d");
	const domain_data = dctx.getImageData(0, 0, dwidth, dheight);
	const codomain_data = cctx.createImageData(cwidth, cheight);
	for(let dx=0; dx<dwidth; ++dx){
		for(let dy=0; dy<dheight; ++dy){
			const unconditioned = pixelmap({x:dx, y:dy}, func, domain, codomain, domain_unit, codomain_unit);
			const {x: cx, y:cy} = condition_pix(unconditioned, cwidth, cheight);
			const ci = 4*(cy*cwidth+cx);
			const di = 4*(dx+dwidth*dy);
			for(let j of [0,1,2,3]) {
				codomain_data.data[ci+j] = domain_data.data[di+j];
			}
		}
	}
	cctx.putImageData(codomain_data, 0, 0);
}

export {preimage, image_draw}
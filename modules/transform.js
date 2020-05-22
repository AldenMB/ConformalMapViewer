function clamp(num, min, max){
	return Math.max(min, Math.min(max, num));
}

function complex2pixel(complex, width, height, unit){
	let x = math.re(complex)*unit + width/2;
	let y = -math.im(complex)*unit + height/2;
	x = clamp(x, 0, width-1)
	y = clamp(y, 0, height-1)
	return {x:Math.round(x),y:Math.round(y)};
}

function pixel2complex(x, y, width, height, unit){
	const real = (x - width/2)/unit;
	const imaginary = -(y - height/2)/unit;
	return math.complex(real, imaginary);
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
			const dnum = pixel2complex(dx, dy, dwidth, dheight, domain_unit);
			const cnum = func.evaluate({x:dnum}).valueOf()[0];
			const {x: cx, y: cy} = complex2pixel(cnum, cwidth, cheight, codomain_unit);
			const ci = 4*(cy*cwidth+cx);
			const di = 4*(dx+dwidth*dy);
			for(let j of [0,1,2,3]) {
				domain_data.data[di+j] = codomain_data.data[ci+j];
			}
		}
	}
	dctx.putImageData(domain_data, 0, 0);
}

function image_draw(func, domain, codomain, domain_unit = 25, codomain_unit = 25){
	const {width:dwidth, height:dheight} = domain;
	const dctx = domain.getContext("2d");
	const {width:cwidth, height:cheight} = codomain;
	const cctx = codomain.getContext("2d");
	const domain_data = dctx.getImageData(0, 0, dwidth, dheight);
	const codomain_data = cctx.createImageData(cwidth, cheight);
	for(let dx=0; dx<dwidth; ++dx){
		for(let dy=0; dy<dheight; ++dy){
			const dnum = pixel2complex(dx, dy, dwidth, dheight, domain_unit);
			const cnum = func.evaluate({x:dnum}).valueOf()[0];
			const {x: cx, y: cy} = complex2pixel(cnum, cwidth, cheight, codomain_unit);
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
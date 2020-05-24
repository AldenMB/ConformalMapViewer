function load_image(canvas){
	const img = new Image();
	img.onload = draw;
	const input = document.createElement('input');
	input.type = 'file';
	input.onchange = receive_image;
	input.click();
	
	function receive_image(e){
		img.src = URL.createObjectURL(e.target.files[0]);
	}
	
	function draw(){
		const ctx = canvas.getContext("2d");
		const {width, height} = canvas;
		ctx.drawImage(img, width/2 - img.width/2, height/2 - img.height/2);
	}
}

export {load_image};




//funcion del salto
function saltando(direccion) {
	
	var repe = setTimeout("saltando(direccion)",0);
			
		    //if(this.value != 'null'){

				if(posicionY-salto != 90 && contSalt == 0){
					corY=posicionY-salto;
					++salto;
					if(direccion ==1)
						spriteX=spriteX+0.5;
					else
						spriteX=spriteX-0.5;

				}else if(posicionY >= posicionY-salto){
					
				corY=posicionY-salto;
				contSalt=1;
				--salto;
				if(direccion ==1)
						spriteX=spriteX+0.5;
					else
						spriteX=spriteX-0.5;
					
				}else{
				//this.value = 'null';
				clearTimeout(repe);
				contSalt=0;
				j=0;
				//init();
				}
				pintar();
				ctx.drawImage(imgList[spriteIndex],posicionX,corY,imgList[spriteIndex].width,imgList[spriteIndex].height);
				

}


	//a la funcion animateFrame le pasamos un 1 o un -1 dependiendo el boton pulsado y lo recogemos en la variable dir, solo entra si se pulsa la flecha hacia la izquierda o hacia la derecha
animateFrame = function (dir) {
	if(j==0){
	//si la variable contiene un 1 entra en este if
   if ( dir > 0)
   {
	   direccion=dir;
	   //No se que hace
        spriteIndex = ( spriteIndex >= 2 ) ? 0 : ++ spriteIndex;
		//Esto sirve para indicar la velocidad de desplazamiento de la imagen por la coordenada x (spriteX) hacia adelante
        spriteX = ( spriteX >= 1000 ) ? 1000 : spriteX + 5;
		comprobar();
		

		
   }
   //si la variable contiene un -1 entra en este else
   else if(dir < 0)
   {
	   direccion=dir;
	   cont++;
	   if(cont==1)
	   {
		   spriteIndex=5;
	   }
	   //No se que hace
        spriteIndex = ( spriteIndex <= 3 ) ? 5	 : -- spriteIndex;
		//Esto sirve para indicar el tamaño de la pantalla y dar velocidad de desplazamiento de la imagen por la coordenada x (spriteX) hacia atras
        spriteX = ( spriteX <= -500 ) ? -100 : spriteX - 5;
		comprobar();
		
   }else{
	j=1;
	saltando(direccion);
   }
   
   pintar(); 
	
   //Dibuja la imgen que tenemos con imgList y con nuestro indice spriteIndex sabemos qué imagen toca cargar, le damos la posicion x e y en la que va a cargar nuesta imagen (500;0) y le damos el tamaño de la imagen (imgList[spriteIndex].width,imgList[spriteIndex].height)
   ctx.drawImage(imgList[spriteIndex],posicionX,posicionY,imgList[spriteIndex].width,imgList[spriteIndex].height);
}
   
}



function pintar()
{
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = "blue";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	 ctx.fillStyle = "green";
   	//Crea el tamaño y la posicion del fondo superponiendolo al que ya estaba (rectangulo de fondo)
   ctx.fillRect(0,190,canvas.width,canvas.height);
	for(i=(Math.floor((-20+spriteX)*0.04)); i<((spriteX+470)*0.04); i++)
	{ 
	
	//comprobamos si hay barrancos
		if(controlA[i]==barranco)
		{
			ctx.fillStyle = "#EBE5E5";
			ctx.fillRect((i*25)-Math.floor(spriteX), 190, 25, canvas.height);	
			console.log(i, " ",spriteX );
		}
		//comprobamos si hay plataformas
		else if(controlA[i]==plataforma || controlA[i]==platanoarriba || controlA[i]==platanoabajo)
		{
			ctx.fillStyle = "brown";
			ctx.fillRect((i*25)-Math.floor(spriteX), 140, 25, 20);	
			console.log(i, " ",spriteX );	
		}
		//colocamos los platanos que pueden ir a la vez que las plataformas
		if(controlA[i]==platano || controlA[i]==platanoarriba || controlA[i]==platanoabajo)
		{
			if(controlA[i]==platano || controlA[i]==platanoabajo)
			{
				ctx.drawImage(imgListPuntos[0],(i*25)-Math.floor(spriteX),posicionY+10,imgListPuntos[0].width,imgListPuntos[0].height);
				console.log(i, " ",spriteX );	
			}
			else
			{
				ctx.drawImage(imgListPuntos[0],(i*25)-Math.floor(spriteX),posicionY-42,imgListPuntos[0].width,imgListPuntos[0].height);
				console.log(i, " ",spriteX );

			}
		}
	}	
}

function comprobar(){
			if(controlA[Math.floor((spriteX+posicionX)*0.04)] == barranco)
			{
				caer();
			}
			if(controlA[Math.floor((spriteX+posicionX)*0.04)] == platano )
			{
				contar();
				controlA[Math.floor((spriteX+posicionX)*0.04)] = cesped; 
			}
			else if(controlA[Math.floor((spriteX+posicionX)*0.04)] == platanoarriba || controlA[Math.floor((spriteX+posicionX)*0.04)] == platanoabajo)
			{
				contar();
				controlA[Math.floor((spriteX+posicionX)*0.04)] = plataforma; 
			}
}
function caer(){
	
	/*var repe = setTimeout("saltando(direccion)",0);
	 ctx.drawImage(imgList[spriteIndex],posicionX,h-posicionY,imgList[spriteIndex].width,imgList[spriteIndex].height);
	--h;*/
	//alert("caigo");
	totalvidas--;
	console.log(totalvidas);
	alert("Vidas: "+ totalvidas);
}

function contar(){
	
	totalbananas++;
	console.log(totalbananas);
	alert("Platanos: "+ totalbananas);
	
}
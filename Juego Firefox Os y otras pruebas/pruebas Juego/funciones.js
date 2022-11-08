//Fichero con funciones generales para el juego 
/******************************************************************************************************************************/
//aqui
function comprobarSalto()
{
	console.log(monoarriba );

	if (monoarriba==false)
	 {
		if( ((controlA[Math.floor(((spriteX+posicionX)*0.04)-(10))] == plataforma) || controlA[Math.floor(((spriteX+posicionX)*0.04)-(10))] == platanoarriba || controlA[Math.floor(((spriteX+posicionX)*0.04)-(10))] == platanoabajo))
		{
			monoarriba=true;  
			posicionY=120;
			cambioposicion=true;
			
		}
	}
	
	else if (monoarriba==true)
	{
		monoarriba=false;
		posicionY=162;
		cambioposicion=true;
		//falta movimiento hacia abajo
	}
}

function comprobarAndar()
{
	if(monoarriba==true)
	{
	if((controlA[Math.floor(((spriteX+posicionX)*0.04))] != plataforma) && controlA[Math.floor(((spriteX+posicionX)*0.04))] != platanoarriba && controlA[Math.floor(((spriteX+posicionX)*0.04))] != platanoabajo)
		{
			monoarriba=false;  
			posicionY=162;
			
		}	
	}
}
/******************************************************************************************************************************/

//funcion del salto
function saltando(direccion) {
	if (caigo==false)
	{
	var repe = setTimeout("saltando(direccion)",0);
			
		    //if(this.value != 'null'){

				if(posicionY-salto != 90 && contSalt == 0){
					corY=posicionY-salto;
					++salto;
					if(direccion ==1)
						spriteX=spriteX+0.5;
					else
						spriteX=spriteX-0.5;
				/******************************************************************************************************************************/
				//aqui
				/*if(cambioposicion==false)
				{
				comprobarSalto();
				}*/
				/******************************************************************************************************************************/

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
				kk=0;
				
				//init();
				comprobar();
				/******************************************************************************************************************************/
				//aqui!!
				cambioposicion=false;
				/******************************************************************************************************************************/
				}

				pintar();
				ctx.drawImage(imgList[spriteIndex],posicionX,corY,imgList[spriteIndex].width,imgList[spriteIndex].height);
				
			}
}

	//a la funcion animateFrame le pasamos un 1 o un -1 dependiendo el boton pulsado y lo recogemos en la variable dir, solo entra si se pulsa la flecha hacia la izquierda o hacia la derecha
animateFrame = function (dir) {
	if(caigo==false)
		{
		if(kk==0){
		//si la variable contiene un 1 entra en este if
	   if ( dir > 0)
	   {
		   direccion=dir;
		   //No se que hace
			spriteIndex = ( spriteIndex >= 2 ) ? 0 : ++ spriteIndex;
			//Esto sirve para indicar la velocidad de desplazamiento de la imagen por la coordenada x (spriteX) hacia adelante
			spriteX = ( spriteX >= 1000 ) ? 1000 : spriteX + 5;
			comprobar();
				/******************************************************************************************************************************/
				//aqui
				comprobarAndar();
				
				/******************************************************************************************************************************/

			
	
			
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
			/******************************************************************************************************************************/
				//aqui
				comprobarAndar();
				
			/******************************************************************************************************************************/

			
	   }else{
		kk=1;
		saltando(direccion);
	   }
	   
	   pintar(); 
		
	   //Dibuja la imgen que tenemos con imgList y con nuestro indice spriteIndex sabemos qué imagen toca cargar, le damos la posicion x e y en la que va a cargar nuesta imagen (500;0) y le damos el tamaño de la imagen (imgList[spriteIndex].width,imgList[spriteIndex].height)
	   ctx.drawImage(imgList[spriteIndex],posicionX,posicionY,imgList[spriteIndex].width,imgList[spriteIndex].height);
	}
	}
   
}



function pintar()
{

	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "rgba(255,255,255,0)";
   	//Crea el tamaño y la posicion del fondo superponiendolo al que ya estaba (rectangulo de fondo)
   ctx.fillRect(0,190,canvas.width,canvas.height);
   
	for(i=(Math.floor((-20+spriteX)*0.04)); i<((spriteX+470)*0.04); i++)
	{ 
	
	//comprobamos si hay barrancos
		if(controlA[i]==barranco)
		{
			//ctx.fillStyle = "#EBE5E5";
			//ctx.fillRect((i*25)-Math.floor(spriteX), 190, 25, canvas.height);	
			//console.log(i, " ",spriteX );
			ctx.drawImage(imgListBarranco[0],(i*25)-Math.floor(spriteX),190,25,imgListBarranco[0].height);
			
		}
		//comprobamos si hay plataformas
		else if(controlA[i]==plataforma || controlA[i]==platanoarriba || controlA[i]==platanoabajo)
		{
			//ctx.fillStyle = "brown";
			//ctx.fillRect((i*25)-Math.floor(spriteX), 140, 25, 20);	
			//console.log(i, " ",spriteX );	
			ctx.drawImage(imgListPlataforma[0],(i*25)-Math.floor(spriteX),140,25,imgListPlataforma[0].height);
		}
		
		if(controlA[i] == 8 )
		{
			
			ctx.drawImage(imgListCactus[0],(i*25)-Math.floor(spriteX),172,imgListCactus[0].width,imgListCactus[0].height);
	
		}
		
		
		//colocamos los platanos que pueden ir a la vez que las plataformas
		if(controlA[i]==platano || controlA[i]==platanoarriba || controlA[i]==platanoabajo)
		{
			if(controlA[i]==platano || controlA[i]==platanoabajo)
			{

				ctx.drawImage(imgListPuntos[0],(i*25)-Math.floor(spriteX),172,imgListPuntos[0].width,imgListPuntos[0].height);
				//console.log(i, " ",spriteX );	
				
			}
			else
			{
				
				
				ctx.drawImage(imgListPuntos[0],(i*25)-Math.floor(spriteX),120,imgListPuntos[0].width,imgListPuntos[0].height);
				//console.log(i, " ",spriteX );
				

			}
			$("#wrapper").css({"background-position": -spriteX + "px 0px;"});
		}
	}	
}

function comprobar(){
			//console.log("aqui", Math.floor((((spriteX+posicionX)*0.04)+(1*0.5))));

			if(controlA[Math.floor(((spriteX+posicionX)*0.04)+(1*0.5))] == barranco)
			{
				//console.log("cae");
				caer();
			}
			if(controlA[Math.floor((spriteX+posicionX)*0.04)] == platano )
			{
				contar();
				controlA[Math.floor((spriteX+posicionX)*0.04)] = cesped; 
			}
			if(controlA[Math.floor(((spriteX+posicionX)*0.04)+(1*0.5))] == cactus )
			{
				pinchar();
				
			} 
			else if(controlA[Math.floor((spriteX+posicionX)*0.04)] == platanoarriba || controlA[Math.floor((spriteX+posicionX)*0.04)] == platanoabajo)
			{
				/******************************************************************************************************************************/
				//aqui
				if(monoarriba==true && controlA[Math.floor((spriteX+posicionX)*0.04)] == platanoarriba)
				{
				contar();
				controlA[Math.floor((spriteX+posicionX)*0.04)] = plataforma; 
				}
				
				if(monoarriba==false && controlA[Math.floor((spriteX+posicionX)*0.04)] == platanoabajo)
				{
				contar();
				controlA[Math.floor((spriteX+posicionX)*0.04)] = plataforma; 
				}
				/******************************************************************************************************************************/
				
				
			}
}
function caer(){
	
	/*var repe = setTimeout("saltando(direccion)",0);
	 ctx.drawImage(imgList[spriteIndex],posicionX,h-posicionY,imgList[spriteIndex].width,imgList[spriteIndex].height);
	--h;*/
	//alert("caigo");
	totalvidas--;
	caigo=true;
/*********************************************************************************/
//aqui
	posicionY=162;
/*********************************************************************************/
	bajando();
	
	if(vibra==true)
		window.navigator.vibrate([100]);
		
	$("#totvid").css({"width": (totalvidas*23) + "px"});

	muerto();
	
}

function pinchar(){
	
	
	//alert("caigo");
	totalvidas--;
	pincharbis();
	
	if(vibra==true)
		window.navigator.vibrate([100]);
	$("#totvid").css({"width": (totalvidas*23) + "px"});

	muerto();
	
}
function pincharbis(){
	spriteX=spriteX-100;
		ctx.drawImage(imgList[spriteIndex],posicionX,canvas.height-20,imgList[spriteIndex].width,imgList[spriteIndex].height);	

	   if (totalvidas==0)
	   {
		  pintar();
		  ctx.drawImage(imgList[6],posicionX,posicionY+10,imgList[6].width,imgList[6].height);	
		}
	
}

function bajando(){
	var repe = setTimeout(bajando,40);
	
	++posCaer;
	
	if(posCaer!=canvas.height-20){
		pintar();
		ctx.drawImage(imgList[spriteIndex],posicionX,posCaer,imgList[spriteIndex].width,imgList[spriteIndex].height);	
	}else{
		caigo=false;
		//posicionY=162;
		spriteX=spriteX-100;
		pintar();
		ctx.drawImage(imgList[spriteIndex],posicionX,posicionY,imgList[spriteIndex].width,imgList[spriteIndex].height);	
	   clearTimeout(repe);
	   posCaer=162;
	   if (totalvidas==0)
	   {
		  caigo=true; 
		  pintar();
		  ctx.drawImage(imgList[6],posicionX,posicionY+10,imgList[6].width,imgList[6].height);	
		}
	}
}

function contar(){
	document.getElementById("fx2").play();
	totalbananas++;
	$("#totban").html(totalbananas);
	if(totalbananas==16)
		compruebapuntu();
}

function muerto(){
	if(totalvidas==0){
		alert("No quedan mas vidas");
		setTimeout("compruebapuntu()",2000);
	}
}
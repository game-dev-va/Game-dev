var tiempo;

function cargacrono(margenx , margeny){
	var crono= document.createElement("div");
	$(crono).attr("id","crono");
	$(crono).css({"width":"100px","height":"20px","text-align":"center", "font-size":"40px","color":"white", "top": (margeny +5) + "px", "left": (margenx + 200) + "px", "position":"fixed"});
	$("#wrapper").append(crono);
	$(crono).html("100");
	tiempo = "";
}

function iniciacrono(){
	tiempo = setInterval(function(){
		document.getElementById("crono").innerHTML-=1;
		if(document.getElementById("crono").innerHTML==0){
			paracrono();
			alert("Se agotó el tiempo");
			compruebapuntu();
		}
},1000);
}

function paracrono(){
	clearInterval(tiempo);
}
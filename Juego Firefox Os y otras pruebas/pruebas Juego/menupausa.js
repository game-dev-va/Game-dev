function cargamenupausa(margenx, margeny){
	var botpausa = document.createElement("div");
    $(botpausa).attr("id","botpausa");
    $("#wrapper").append(botpausa);
    $(botpausa).css({"width":"40px","height":"40px","background-image":"url(img/pausa.png)", "background-size":"40px", "position":"fixed", "left": (margenx + 440) + "px", "top": margeny + "px"});
    $(botpausa).on("click",function(){
        paracrono();
    	$("#contepausa").css({"display":"block"});
    });

    //contenedor que tapa toda la pantalla e inutiliza los botones del escenario
    var contepausa = document.createElement("div");
    $(contepausa).attr("id","contepausa");
    $("#wrapper").append(contepausa);
    $(contepausa).css({"width":"480px","height":"320px","display":"none"});
  	

  	var pausa = document.createElement("div");
    $(pausa).attr("id","pausa");
    $("#contepausa").append(pausa);
    $(pausa).css({"width":"300px","height":"200px","background-color":"rgba(255,255,255,0.5)", "background-image":"url(img/pantapausa.png)", "background-position":"top", "background-repeat":"no-repeat","color":"white", "left": (margenx + 90) + "px", "top": (margeny + 40) + "px","position":"fixed"});

    var continuar = document.createElement("div");
    $(continuar).attr("id","continuar");
    $("#pausa").append(continuar);
    $(continuar).css({"width":"200px","height":"30px", "padding":"10px", "background-color":"rgba(255,255,255,0.8)", "border":"1px solid orange", "border-radius":"10px", "background-position":"top", "background-repeat":"no-repeat", "text-align":"center", "font-size":"20px","color":"orange", "left": (margenx + 130) + "px", "top": (margeny + 90) + "px","position":"fixed"});
    $(continuar).html("Continuar Jugando");
    $(continuar).on("click",function(){
    	$("#contepausa").css({"display":"none"});
        iniciacrono();
    });
  	
  	var salir = document.createElement("div");
    $(salir).attr("id","salir");
    $("#pausa").append(salir);
    $(salir).css({"width":"200px","height":"30px", "padding":"10px", "background-color":"rgba(255,255,255,0.8)", "border":"1px solid orange", "border-radius":"10px", "background-position":"top", "background-repeat":"no-repeat", "text-align":"center", "font-size":"20px","color":"orange", "left": (margenx + 130) + "px", "top": (margeny + 180) + "px","position":"fixed"});
    $(salir).html("Salir al Menu");
    $(salir).on("click",function(){
    	compruebapuntu(totalbananas);
    	document.getElementById("music").pause();
    	$("#contenedor").empty();
    	loadapp();
    });
}
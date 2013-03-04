// JavaScript Document


function parser()
{
    $.ajax({
    type: "GET",
    url: "data/data.json",
    dataType: "json",
    success: showData,
	error: errorfunction
  })
};

function errorfunction(){
	console.log("Erreur : Fichier non pars&eacute;");
}


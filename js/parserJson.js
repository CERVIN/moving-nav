// JavaScript Document

function parseJson(){
    $.ajax({
    type: "GET",
    url: "data/data.json",
    dataType: "json",
    success: showData,
	error: errorfunction
  });
}

function errorfunction(){
	console.log("parseJson Erreur, impossible de r�cup�rer les donn&eacute;es.");
}


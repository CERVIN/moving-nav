// JavaScript Document

function parser(url) {
	$.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: showData,
	error: errorfunction
	});

}

function parser(){
    $.ajax({
    type: "GET",
    url: "data/data.json",
    dataType: "json",
    success: showData,
	error: errorfunction
  });
   
}

function errorfunction(json)
{
	alert("Erreur, impossible de r&eacutecup&eacuterer les donn&eacutees.");
	
}


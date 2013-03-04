// JavaScript Document

var data;


$(document).ready(function ()
{
    $.ajax({
    type: "GET",
    url: "data/data.json",
    dataType: "json",
    success: showData,
	error: errorfunction
  });
   
});

function errorfunction(json)
{
	alert("Erreur, impossible de récupérer les données.");
	
}

function getData() {
    return data;
}
// JavaScript Document

var data;



function parser()
{
    $.ajax({
    type: "GET",
    url: "data/data.json",
    dataType: "json",
    success: showData,
	error: errorfunction
  });
   
};

function errorfunction(json)
{
	alert("Erreur, impossible de r�cup�rer les donn�es.");
}

function getData() {
    return data;
}
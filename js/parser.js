// JavaScript Document
$(document).ready(function()
{
    $.ajax({
    type: "GET",
    url: "../moving-nav/data/json/test.json",
    dataType: "JSON",
    success: function(string) {
        data = $.parseJSON(string);
		console.log(data);
       }
  });
  
});



/*
$(document).ready(function()
{
    $.ajax({
    type: "GET",
    url: "../moving-nav/data/xml/parcoursOK.xml",
    dataType: "xml",
    success: parseXml
  });
  
});

function parseXml(xml)
{
  //Find All Parcours Information
  $(xml).find("info").each(function()
  {
	$(this).find("parcours").each(function()
	{
		$('#output').append("<ul id='parcoursList'></ul>");
		$(this).find("infoparcours").each(function()
		{
		});
	});
});
  	// Start the carousel
   $("#parcoursList").roundabout({
   shape:'rollerCoaster'
   });
*/

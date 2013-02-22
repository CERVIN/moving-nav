// JavaScript Document
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
			$("#parcoursList").append("<li>"+$(this).find("id").text()+$(this).find("nom").text()+$(this).find("image").text()+"</li>");
			/*$("#parcoursList").append("id : "+$(this).find("id").text() + "<br />");
			$("#parcoursList").append("nom : "+$(this).find("nom").text() + "<br />");
			$("#parcoursList").append("image : "+$(this).find("image").text() + "<br />");
			$("#parcoursList").append("</li>");*/
		});
	});
});
  	// Start the carousel
   $("#parcoursList").roundabout({
   shape:'rollerCoaster'
   });
/*
  //print each existing node
  $(xml).find("noeuds").each(function()
  {
    $(xml).find("noeud").each(function()
	{
		$("#output").append("noeud : " + $(this).children("id").text() + "<br />");
		
	});

  });

*/
}
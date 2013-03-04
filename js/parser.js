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
			$("#parcoursList").append('<li>'+$(this).find("id").text()+$(this).find("nom").text()+'<a href="'+$(this).find("id").text()+'"><img src="../moving-nav/images/'+$(this).find("image").text()+'" /></a>'+"</li>");

		});
	});
});
  	// Start the carousel
   $("#parcoursList").roundabout({
   shape:'rollerCoaster'
   });

}
function createCarousel(data, noeud, parcours, historique) {
    var nbrImage = noeud.data.images;
    var nbrVideo = noeud.data.videos;
    var name = noeud.data.nom;
	
	
    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;
	
	if (nbrVideo == null){
		nbrVideo="0";
	}
	if (nbrImage == null){
		nbrImage="0";
	}
	
	var nbrMedia=1;
	if(nbrImage>0){
		nbrMedia=nbrMedia+1;
	}
	if(nbrVideo>0){
		nbrMedia=nbrMedia+1;
	}
	
	if(nbrMedia !=0){
		
		//Carousel indicators
		if(nbrMedia ==1 || (nbrMedia==2 && nbrImage ==1)){
			$('.carousel-indicators').append("");
		}
		else{
			for (i = 0; i < nbrMedia; i++) {
				var actif = "";
				if (i == 0) { actif = "class= active" } else { actif = "" };
				$('.carousel-indicators').append("<li data-target=#myCarousel data-slide-to=" + i + " " + actif + "></li>");
			}
		}
		
		//Carousel Media

    //image
    if (nbrImage != "0") {

        var image = j;
		var hiddenobject = 0;
        for (j = 0; j < nbrImage; j++) {
            var actif = "";
            image = j + 1;
            if (j == 0) {
                actif = "active ";

                $('.carousel-inner').append("<div class=\"" + actif + "item\"><div class=titleMedia>Résumé</div><div class=imageCarrousel><img src=data/" + noeud.id + "/image" + image + ".jpg width=auto height=auto/></div> <div class=textCarrousel><p><span class=legende></span><span class=resume></span></p></div></div>");
				
				$('.carousel-inner').append("<div class=\"item\"><div class=titleMedia>Visionneuse</div> <div id=galleryPhoto class=\"html5gallery\" data-skin=\"vertical\" data-width=\"250\" data-height=\"120\" data-showsocialmedia=\"false\"> <a href=data/" + noeud.id + "/image" + image + ".jpg><img src=data/" + noeud.id + "/image" + image + ".jpg alt=\"image"+image +"\"></a> </div></div>");
				
            }
            else {
                actif = "";

				$('.html5gallery').append("<a href=data/" + noeud.id + "/image" + image + ".jpg><img src=data/" + noeud.id + "/image" + image + ".jpg alt=\"image"+image +"\"></a>");
				
            }

        }
    	document.getElementById("galleryPhoto").style.left = "10%";
    	document.getElementById("galleryPhoto").style.marginTop = "2%";
    	document.getElementById("galleryPhoto").style.borderStyle = "solid";
    	document.getElementById("galleryPhoto").style.borderColor = "#fff";


    }
	
	else{
		if (i == 0) { actif = "class= active" } else { actif = "" };
		$('.carousel-inner').append("<div class=\"" + actif + "item\"><div class=titleMedia>Résumé</div><div class=textOnly><p><span class=legende></span><span class=resume></span></p></div></div>");
		
	}

    //video
    if (nbrVideo != 0) {
		 var actif = "";
	$('.carousel-inner').append("<div class=\"item\"><div class=titleMedia>Vidéo</div> <div id=video class=\"html5gallery\" data-skin=\"vertical\" data-width=\"320\" data-height=\"120\"  data-showimagetoolbox=\"true\" data-showsocialmedia= \"false\"  data-xml=\"./data/"+noeud.id+"/videos.xml\" style=\"display:none;\"></div></div>");
	document.getElementById("video").style.left = "10%";
	document.getElementById("video").style.marginTop = "2%";
	document.getElementById("video").style.borderStyle = "solid";
	document.getElementById("video").style.borderColor = "#fff";    
    }
	}
		
    //lien
    if (historique.length != 0) {
        var parent = getNodeById(historique[historique.length - 1], data);
        var legende;
        if (isNodeParcours(parent, parcours.id, data)) {
            var infoParcours = getParcoursFromNode(parent, parcours.id, data);
            if (infoParcours.suivant == noeud.id) {
                legende = infoParcours.legende;
            }
        } else {
            var info = getInfoVoisinFromNode(parent, noeud.id, data);
            if (info != null) {
                legende = info.legende;
            }
        }
        if (legende != null) {
            $('.textCarrousel p .legende').append(legende+"<br/><br/>");
			$('.textOnly p .legende').append(legende+"<br/><br/>");
        }
    }
	
	if(parseInt(nbrImage) + parseInt(nbrVideo) < 2){
			document.getElementById('myCarousel').removeChild(document.getElementById('controlLeft'));
			document.getElementById('myCarousel').removeChild(document.getElementById('controlRight'));
		}

    //Resume
    $('.textCarrousel p .resume').load('data/' + noeud.id + '/resume.txt');
	$('.textOnly p .resume').load('data/' + noeud.id + '/resume.txt');
	$('#info').append(parcours.nom + " - " + name);

    /*CSS dynamique*/
    //Info
	var heightBtn=$('#info a.bouton-home').css('height', ($("#info").height() / 3) * 2.7);
	$('#info').css('font-size', ($("#info").height() / 3) * 2);
	$('#info a.bouton-home').css('height', ($("#info").height() / 3) * 3);
	$('#info a.bouton-home').css('font-size', ($("#info").height() / 3) * 2.3);
	$('#info a.bouton-home').css('line-height', (($("#info").height() / 3) * 2.8) + "px");
	$('#info a.bouton-home').css('width', ($("#info").height() / 3) * 7 + "px");
	$('#info a.bouton-home').css('padding', 0);

    //Caroussel
	$('#myCarousel').css('font-size', ($("#info").height() / 3) * 2);
	$('#myCarousel .titleMedia').css('height', (($("#myCarousel").height() * 1) / 10) + 'px');
	$('#myCarousel .titleMedia').css('font-size', $("#myCarousel .titleMedia").height());
	$('#myCarousel .imageCarrousel').css('height', (($("#myCarousel").height() * 85) / 100) + 'px');
	$('#myCarousel .imageCarrousel img').css('max-height', $("#myCarousel .imageCarrousel").height() + 'px');
	$('#myCarousel .textOnly').css('height', (($("#myCarousel").height() * 85) / 100) + 'px');
	$('#myCarousel .textCarrousel').css('height', (($("#myCarousel").height() * 85) / 100) + 'px');

    //$('#myCarousel li').css('background-color', parcours.couleur1);
    //$('#myCarousel li.active').css('background-color', "#FFF");

    //$("#controlRight").click(function () {
    //    $('#myCarousel li').css('background-color', parcours.couleur1);
    //    $('#myCarousel li.active').css('background-color', "#FFF");
    //});

    //$("#controlLeft").click(function () {
    //    $('#myCarousel li').css('background-color', parcours.couleur1);
    //    $('#myCarousel li.active').css('background-color', "#FFF");
    //});
	
	loadHtml5Gallery("");
}
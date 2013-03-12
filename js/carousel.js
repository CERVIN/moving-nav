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
    //image
    if (nbrImage != "0") {
		if(parseInt(nbrImage) + parseInt(nbrVideo) == 1){
			$('.carousel-indicators').append("");
		}
		else{
			for (i = 0; i < nbrImage; i++) {
				var actif = "";
				if (i == 0) { actif = "class= active" } else { actif = "" };
				$('.carousel-indicators').append("<li data-target=#myCarousel data-slide-to=" + i + " " + actif + "></li>");
			}
		}

        var image = j;
		var hiddenobject = 0;
        for (j = 0; j < nbrImage; j++) {
            var actif = "";
            image = j + 1;
            if (j == 0) {
                actif = "active ";
                $('.carousel-inner').append("<div class=\"" + actif + "item\"><div class=imageCarrousel><img src=data/" + noeud.id + "/image" + image + ".jpg width=auto height=auto/></div> <div class=textCarrousel><p><span class=legende></span><span class=resume></span></p></div></div>");
				
				$('.carousel-inner').append("<div class=\"item\"> <div class=\"html5gallery\" data-skin=\"vertical\" data-width=\"500\" data-height=\"300\" style=\"dispay:block; position:relative; left:10%; width:660px; height: 371px;\"> <a href=data/" + noeud.id + "/image" + image + ".jpg><img src=data/" + noeud.id + "/image" + image + ".jpg alt=\"image"+image +"\"></a>  </div></div></div>");
            }
            else {
                actif = "";
                $('.carousel-inner').append("<div class=\"" + actif + "item\"><img src=data/" + noeud.id + "/image" + image + ".jpg width=auto height=auto/></div>");

					 $('.html5gallery').append("<a href=data/" + noeud.id + "/image" + image + ".jpg><img src=data/" + noeud.id + "/image" + image + ".jpg alt=\"image"+image +"\"></a>");
				
            }

        }


    }
	
	else{
		if (i == 0) { actif = "class= active" } else { actif = "" };
		if(nbrImage + nbrVideo <2){
			$('.carousel-indicators').append("");
		}
		else{
			$('.carousel-indicators').append("<li data-target=#myCarousel data-slide-to=" + i + " " + actif + "></li>");
		}	
		$('.carousel-inner').append("<div class=\"" + actif + "item\"><div class=textCarrousel><p><span class=legende></span><span class=resume></span></p></div></div>");
	
		
	}

    //video
    if (nbrVideo != 0) {
		if(nbrImage + nbrVideo == 1){
			$('.carousel-indicators').append("");
		}
		else{
			nbrVideo = parseInt(nbrVideo) + i;
			for (k = i; k < nbrVideo; k++) {
				var actif = "";
				if (k == 0) { actif = "class= active" } else { actif = "" };
				$('.carousel-indicators').append("<li data-target=#myCarousel data-slide-to=" + k + " " + actif + "></li>");
			}
		}

        var adrVideo = 1;
        for (l = j; l < nbrVideo; l++) {
            var actif = "";
            if (l == 0) { actif = "active " } else { actif = "" };
            $('.carousel-inner').append("<div class=\"" + actif + "item\"><video controls=controls width=400 height=222><source src=data/" + noeud.id + "/video" + adrVideo + ".mp4 type=video/mp4 /><source src=video1.webm type=video/webm /><source src=video1.ogv type=video/ogg /></video></div></div>");
            adrVideo++;
        }
    }
    //lien
    if (historique.length != 0) {
        var parent = getNodeById(historique[historique.length - 1], data);
        var legende;
        if (isNodeParcours(parent, parcours.id, data)) {
           legende = getParcoursFromNode(parent, parcours.id, data).legende;
        } else {
            var info = getInfoVoisinFromNode(parent, noeud.id, data);
            if (info != null) {
                legende = info.legende;
            }
        }
        if (legende != null) {
            $('.textCarrousel p .legende').append(legende+"<br/>");
        }
    }
	
	if(parseInt(nbrImage) + parseInt(nbrVideo) < 2){
			document.getElementById('myCarousel').removeChild(document.getElementById('controlLeft'));
			document.getElementById('myCarousel').removeChild(document.getElementById('controlRight'));
		}


    //Resume
    $('.textCarrousel p .resume').load('data/' + noeud.id + '/resume.txt');
    $('.info').append("<p>" + parcours.nom + " - " + name + "<p>");
}
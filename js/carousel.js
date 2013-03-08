function createCarousel(data, noeud, parcours) {
    var nbrImage = noeud.data.images;
    var nbrVideo = noeud.data.videos;
    var name = noeud.data.nom;
    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;


    //image
    if (nbrImage != null) {

        for (i = 0; i < nbrImage; i++) {
            var actif = "";
            if (i == 0) { actif = "class= active" } else { actif = "" };
            $('.carousel-indicators').append("<li data-target=#myCarousel data-slide-to=" + i + " " + actif + "></li>");
        }

        var image = j;
		var hiddenobject = 0;
        for (j = 0; j < nbrImage; j++) {
            var actif = "";
            image = j + 1;
            if (j == 0) {
                actif = "active ";
                $('.carousel-inner').append("<div class=\"" + actif + "item\"><div class=imageCarrousel><img src=data/" + noeud.id + "/image" + image + ".jpg width=auto height=auto/></div> <div class=textCarrousel><p></p></div></div>");
            }
            else {
                actif = "";
                $('.carousel-inner').append("<div class=\"" + actif + "item\"><img src=data/" + noeud.id + "/image" + image + ".jpg width=auto height=auto/></div>");

				if(hiddenobject == 0){
                $('.carousel-inner').append("<div class=\""+actif+"item\"> <div class=\"highslide-gallery\"> <a class=\"highslide\" href=\"miniature/images/gallery3.jpg\" onclick=\"return hs.expand(this, { anchor: 'top' })\"> <img src=\"miniature/images/gallery3.thumb.jpg\" alt=\"\"/> </a> <a class=\"highslide\" href=\"miniature/images/gallery2.jpg\" onclick=\"return hs.expand(this, { anchor: 'top' })\"> <img src=\"miniature/images/gallery2.thumb.jpg\" alt=\"\"/> </a> <a class=\"highslide\" href=\"miniature/images/thumbstrip24.jpg\" onclick=\"return hs.expand(this, { anchor: 'top' })\"> <img src=\"miniature/images/thumbstrip24.thumb.png\" alt=\"\"/> </a> </div></div></div>");
								hiddenobject = hiddenobject+1;
					}
            }

        }


    }

    //video
    if (nbrVideo != null) {
        nbrVideo = parseInt(nbrVideo) + i;
        for (k = i; k < nbrVideo; k++) {
            var actif = "";
            if (k == 0) { actif = "class= active" } else { actif = "" };
            $('.carousel-indicators').append("<li data-target=#myCarousel data-slide-to=" + k + " " + actif + "></li>");
        }

        var adrVideo = 1;
        for (l = j; l < nbrVideo; l++) {
            var actif = "";
            if (l == 0) { actif = "active " } else { actif = "" };
            $('.carousel-inner').append("<div class=\"" + actif + "item\"><video controls=controls width=400 height=222><source src=data/" + noeud.id + "/video" + adrVideo + ".mp4 type=video/mp4 /><source src=video1.webm type=video/webm /><source src=video1.ogv type=video/ogg /></video></div></div>");
            adrVideo++;
        }
    }


    $('.textCarrousel p').load('data/' + noeud.id + '/resume.txt');
    $('.info').append("<p>" + parcours.nom + " - " + name + "<p>");
}
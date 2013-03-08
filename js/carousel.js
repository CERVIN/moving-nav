function createCarousel(data, noeud, parcours, historique) {
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
        for (j = 0; j < nbrImage; j++) {
            var actif = "";
            image = j + 1;
            if (j == 0) {
                actif = "active ";
                $('.carousel-inner').append("<div class=\"" + actif + "item\"><div class=imageCarrousel><img src=data/" + noeud.id + "/image" + image + ".jpg width=auto height=auto/></div> <div class=textCarrousel><p><span class=legende></span><span class=resume></span></p></div></div>");
            }
            else {
                actif = "";
                $('.carousel-inner').append("<div class=\"" + actif + "item\"><img src=data/" + noeud.id + "/image" + image + ".jpg width=auto height=auto/></div>");

                $('.carousel-inner').append("<div class=\"" + actif + "item\"> <div class='highslide-gallery' >"
                        + "<a class='highslide' id='thumb1' href='miniature/images/thumbstrip11.jpg' onclick=\"return hs.expand(this,miniGalleryOptions1)\" title=\"Two cabins\"> <img src='miniature/images/thumbstrip11.jpg' margin-left:auto margin-right:auto width:50% height:50% alt=''/></a>"
                        + "<div class=\"hidden-container\" margin-left:0%>"
                        + "<a class='highslide' href='miniature/images/thumbstrip09.jpg' onclick=\"return hs.expand(this)\" title=\"Ptarmigan\"><img 			   src='miniature/images/thumbstrip09.thumb.png' alt=''/></a>"
                        + "<a class='highslide' href='miniature/images/thumbstrip12.jpg' title=\"Patterns in the snow\" onclick=\"return hs.expand(this,miniGalleryOptions1)\"> <img src='miniature/images/thumbstrip12.thumb.png' alt=''/></a>"
                        + "</div></div></div></div>");
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

    //Resume
    $('.textCarrousel p .resume').load('data/' + noeud.id + '/resume.txt');
    $('.info').append("<p>" + parcours.nom + " - " + name + "<p>");
}
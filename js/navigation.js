function formatNameByLength(name, length) {
    if (name.length <= length) {
        return name;
    } else {
        return name.substring(0, length - 3) + "...";
    }
}

function createNavigation(data, noeud, parcours, historique, TEXTCOLOR, COLOR1, COLOR2, COLORDEFAULT, STROKECOLOR) {
    /* PARAMETRES */
    var TEXTCOLOR = "white";
    var COLOR1 = parcours.couleur1;
    var COLOR2 = parcours.couleur2;
    var COLORDEFAULT = '#F58F00';
    var STROKECOLOR = 'black';
    var ESPACE_ENTRE_NOEUD = 150;
    var NB_CHAR_MAX = 15;


    /* Scene */
    var stage = new Kinetic.Stage({
        container: 'container',
        width: document.body.clientWidth,
        height: $(".navigation").height()
    });

    var debugLayer = new Kinetic.Layer();


    var lineLayer = new Kinetic.Layer();
    var shapesLayer = new Kinetic.Layer();

    var historiqueLayer = new Kinetic.Layer();
    var selectionLayer = new Kinetic.Layer();
    var futurLayer = new Kinetic.Layer();

    var noeudsDansHistorique;

    var zoneHistorique = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: stage.getWidth() / 3,
        height: stage.getHeight(),
        fill: 'green',
        opacity: 0

    });

    var zoneSelection = new Kinetic.Rect({
        x: stage.getWidth() / 3,
        y: 0,
        width: stage.getWidth() / 3,
        height: stage.getHeight(),
        fill: 'blue',
        opacity: 0

    });

    var zoneFutur = new Kinetic.Rect({
        x: (stage.getWidth() / 3) * 2,
        y: 0,
        width: stage.getWidth() / 3,
        height: stage.getHeight(),
        fill: 'red',
        opacity: 0

    });

    var parcoursLine = new Kinetic.Line({
        points: [0, stage.getHeight() / 3, stage.getWidth(), stage.getHeight() / 3],
        stroke: COLOR1,
        strokeWidth: 10
    });

    var imageIndiceDrag = new Image();
    var indiceDrag1 = new Kinetic.Image({
        x: zoneHistorique.getX() + zoneHistorique.getWidth() / 6,
        y: (stage.getHeight() / 3) * 2,
        image: imageIndiceDrag,
        width: (zoneHistorique.getWidth() / 3) * 2,
        height: 20 * ((zoneHistorique.getWidth() / 3) * 2) / 168
    });

    var indiceDrag2 = new Kinetic.Image({
        x: zoneFutur.getX() + zoneFutur.getWidth() / 6,
        y: (stage.getHeight() / 3) * 2,
        image: imageIndiceDrag,
        width: (zoneFutur.getWidth() / 3) * 2,
        height: 20 * ((zoneFutur.getWidth() / 3) * 2) / 168
    });

    imageIndiceDrag.src = "images/indice_drag.png"

    historiqueLayer.add(indiceDrag1);
    futurLayer.add(indiceDrag2);

    /* Marqueurs de contenu caché */

    var pointilleGauche = createHiddenSprite(COLOR1, 'white', 90, stage);
    pointilleGauche.setOpacity(0);

    var pointilleDroite = new Kinetic.Group();

    var flecheDroite = createHiddenSprite(COLOR1, 'white', 270, stage);
    pointilleDroite.setOpacity(0);

    /* Zones draggable */
    var lastDrag = [-1, -1];
    var suiteParcours = [];
    var precedentParcours = [];

    zoneHistorique.on('mousedown touchstart', function () {
        startDrag(zoneHistorique, historiqueLayer, precedentParcours, (stage.getWidth() / 3), false, pointilleGauche, lastDrag, stage, selectionLayer);
    });

    zoneHistorique.on('mouseup mouseout touchend', function () {
        stopDrag(zoneHistorique, lastDrag);
    });

    zoneFutur.on('mousedown touchstart', function () {
        startDrag(zoneFutur, futurLayer, suiteParcours, (stage.getWidth() / 3) * 2, true, pointilleDroite, lastDrag, stage, selectionLayer);
    });

    zoneFutur.on('mouseup mouseout touchend', function () {
        stopDrag(zoneFutur, lastDrag);
    });


    /* Zone historique */

    for (var h = historique.length - 1; h >= 0 && historique.length != 0; h--) {
        var noeudHisto = getNodeById(historique[h], data);

        var group = new Kinetic.Group({
            name: historique[h]
        });

        var colorNoeud = COLOR1;

        var rond = new Kinetic.Circle({
            x: stage.getWidth() / 3 - ((precedentParcours.length + 1) * ESPACE_ENTRE_NOEUD),
            y: stage.getHeight() / 3,
            radius: 20,
            fill: colorNoeud,
            stroke: STROKECOLOR,
            strokeWidth: 2
        });

        var texteAAfficher = formatNameByLength(noeudHisto.data.nom, NB_CHAR_MAX)

        var texte = new Kinetic.Text({
            x: stage.getWidth() / 3 - ((precedentParcours.length + 1) * ESPACE_ENTRE_NOEUD) - (texteAAfficher.length / 2) * 10,
            y: stage.getHeight() / 3 - 44,
            text: texteAAfficher,
            fill: TEXTCOLOR,
            fontSize: 20,
            fontFamily: 'Calibri'
        });

        group.on("click tap", function () {
            navigateTo(noeud, parcours, historique, this.getName());
        });

        group.add(texte);
        group.add(rond);

        precedentParcours.push(group);

    }


    /* Zone selection */
    var colorNoeud = COLOR1;

    var rondNoeud = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 3,
        radius: 20,
        fill: colorNoeud,
        stroke: STROKECOLOR,
        strokeWidth: 2
    });

    var rondNoeudSel = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 3,
        radius: 15,
        fill: COLOR2
    });


    var texteNoeud = new Kinetic.Text({
        x: stage.getWidth() / 2 - (noeud.data.nom.length / 2) * 10,
        y: stage.getHeight() / 3 - 44,
        text: noeud.data.nom,
        fill: TEXTCOLOR,
        fontSize: 20,
        fontFamily: 'Calibri'
    });

    /* Zone futur */

    // Récupération noeuds voisins
    if (noeud.voisins.length != 0) {
        var nbVoisinsParcours = 0;
        var nbVoisinsSimple = 0;
        var voisinSimple;
        var voisinParcours;
        for (var v in noeud.voisins) {
            var monVoisin = getNodeById(noeud.voisins[v].id, data);
            if (monVoisin.parcours.length == 0) {
                if (nbVoisinsSimple == 0) {
                    //Création du lien
                    voisinSimple = new Kinetic.Group({
                        name: noeud.voisins[v].id
                    });
                    voisinSimple.add(new Kinetic.Rect({
                        x: stage.getWidth() / 3 * 2 + ((suiteParcours.length) * ESPACE_ENTRE_NOEUD),
                        y: stage.getHeight() / 3,
                        fill: COLOR1,
                        width: 200,
                        height: (stage.getHeight() / 6) * 5 - stage.getHeight() / 3,
                        opacity: 0
                    }));
                    voisinSimple.add(new Kinetic.Line({
                        name: "line",
                        points: [stage.getWidth() / 3 * 2 + ((suiteParcours.length) * ESPACE_ENTRE_NOEUD), stage.getHeight() / 3, stage.getWidth() / 3 * 2 + ((suiteParcours.length + 1) * ESPACE_ENTRE_NOEUD), (stage.getHeight() / 6) * 5],
                        stroke: COLOR1,
                        strokeWidth: 10,
                    }));
                    voisinSimple.add(new Kinetic.Circle({
                        x: stage.getWidth() / 3 * 2 + ((suiteParcours.length + 1) * ESPACE_ENTRE_NOEUD),
                        y: (stage.getHeight() / 6) * 5,
                        radius: 20,
                        fill: COLOR1,
                        stroke: STROKECOLOR,
                        strokeWidth: 2
                    }));
                    var texteAAfficher = formatNameByLength(monVoisin.data.nom, NB_CHAR_MAX)
                    voisinSimple.add(new Kinetic.Text({
                        x: stage.getWidth() / 3 * 2 + ((suiteParcours.length + 1) * ESPACE_ENTRE_NOEUD) - (texteAAfficher.length / 2) * 10,
                        y: (stage.getHeight() / 6) * 5 - 44,
                        text: texteAAfficher,
                        fill: TEXTCOLOR,
                        fontSize: 20,
                        fontFamily: 'Calibri'
                    }));
                    voisinSimple.on("click tap", function () {
                        navigateTo(noeud, parcours, historique, this.getName());
                    });
                    suiteParcours.push(voisinSimple);
                    nbVoisinsSimple++;
                } else {
                    //MENU MULTI NOEUD

                }
            } else {
                if (nbVoisinsParcours == 0) {
                    //TODO: LIEN PARCOURS
                } else {
                    //TODO: MENU MULTI NOEUD
                }
            }

        }

    }

    // Récupération noeuds parcours
    var noeudParcoursPrecedent = noeud;
    var incrHisto = historique.length - 1;
    while (!isNodeParcours(noeudParcoursPrecedent, parcours.id) && incrHisto >= 0) {
        noeudParcoursPrecedent = getNodeById(historique[incrHisto--], data);
    }
    if (!isNodeParcours(noeudParcoursPrecedent, parcours.id, data)) {
        noeudParcoursPrecedent = getNodeById(parcours.debut, data);
    }

    var suivant = getParcoursFromNode(noeudParcoursPrecedent, parcours.id, data).suivant;
    while (suivant != -1) {
        var noeudSuivant = getNodeById(suivant, data);
        var group = new Kinetic.Group({
            name: suivant
        });


        var rond = new Kinetic.Circle({
            x: stage.getWidth() / 3 * 2 + ((suiteParcours.length) * ESPACE_ENTRE_NOEUD),
            y: stage.getHeight() / 3,
            radius: 20,
            fill: COLOR1,
            stroke: STROKECOLOR,
            strokeWidth: 2
        });

        var texteAAfficher = formatNameByLength(noeudSuivant.data.nom, NB_CHAR_MAX)

        var texte = new Kinetic.Text({
            x: stage.getWidth() / 3 * 2 + ((suiteParcours.length) * ESPACE_ENTRE_NOEUD) - (texteAAfficher.length / 2) * 10,
            y: stage.getHeight() / 3 - 44,
            text: texteAAfficher,
            fill: TEXTCOLOR,
            fontSize: 20,
            fontFamily: 'Calibri'
        });

        group.on("click tap", function () {
            navigateTo(noeud, parcours, historique, this.getName());
        });


        group.add(texte);
        group.add(rond);

        suiteParcours.push(group);
        suivant = getParcoursFromNode(noeudSuivant, parcours.id, data).suivant;
    }

    lineLayer.add(parcoursLine);

    historiqueLayer.add(zoneHistorique);
    for (var rond in precedentParcours) {
        historiqueLayer.add(precedentParcours[rond]);
    }

    selectionLayer.add(zoneSelection);
    selectionLayer.add(texteNoeud);
    selectionLayer.add(rondNoeud);
    selectionLayer.add(rondNoeudSel);
    selectionLayer.add(pointilleGauche);
    selectionLayer.add(pointilleDroite);

    futurLayer.add(zoneFutur);
    for (var rond in suiteParcours) {
        futurLayer.add(suiteParcours[rond]);
    }

    stage.add(lineLayer);
    stage.add(selectionLayer);
    stage.add(historiqueLayer);
    stage.add(futurLayer);

    stage.add(debugLayer);
}

function writeMessage(messageLayer, message) {
    var context = messageLayer.getContext();
    messageLayer.clear();
    context.font = '18pt Calibri';
    context.fillStyle = TEXTCOLOR;
    context.fillText(message, 10, 25);
}

function startDrag(zone, layer, obj, limite, cacherGauche, marqueur, lastDrag, stage, selectionLayer) {
    zone.on('mousemove touchmove', function () {
        var mousePos = stage.getMousePosition();
        if (lastDrag[0] != -1 && lastDrag[1] != -1) {
            //writeMessage(debugLayer, "" + obj[0].children[0].getPosition().x + " - " + obj[0].children[0].getY());

            for (var o in obj) {
                //obj[o].move(mousePos.x - lastDrag[0], 0);
                for (var child in obj[o].children) {
                    if (obj[o].children[child].getName() == "line") {
                        var points = obj[o].children[child].getPoints();
                        points[0].x += mousePos.x - lastDrag[0];
                        points[1].x += mousePos.x - lastDrag[0];
                        obj[o].children[child].setPoints(points);
                    } else {
                        obj[o].children[child].move(mousePos.x - lastDrag[0], 0);
                    }
                }
                if ((!cacherGauche && obj[o].children[0].getX() + obj[o].children[0].getWidth() > limite) || (cacherGauche && obj[o].children[0].getX() < limite)) {
                    if (o == 0) {
                        marqueur.setOpacity(1);
                    }
                    if ((cacherGauche && Math.abs(obj[o].children[0].getX() - limite) > obj[o].children[0].getWidth()) || (!cacherGauche && obj[o].children[0].getX() > limite)) {
                        obj[o].setOpacity(0);
                    } else {
                        // Effet transparent
                        var opacity = Math.abs(obj[o].children[0].getX() - limite) / obj[o].children[0].getWidth();
                        if (cacherGauche) {
                            opacity = 1 - opacity;
                        }
                        obj[o].setOpacity(opacity);
                    }
                } else {
                    if (o == 0) {
                        marqueur.setOpacity(0);
                    }
                    obj[o].setOpacity(1);
                }

            }
            layer.draw();
            selectionLayer.draw();
        }
        lastDrag[0] = mousePos.x;
        lastDrag[1] = mousePos.y;
    });
}

function stopDrag(zone, lastDrag) {
    zone.off('mousemove touchmove');
    lastDrag[0] = -1;
    lastDrag[1] = -1;
}

/** Change la page vers le noeud idToNavigate **/
function navigateTo(noeud, parcours, historique, idToNavigate) {
    var url = "exploration.html?parcours=" + parcours.id + "&noeud=" + idToNavigate + "&historique=";
    for (var h in historique) {
        if (historique[h] != idToNavigate) {
            url += historique[h];
            url += "N";
        }
    }
    url += noeud.id;
    window.location = url;
}

/** Retourne le signe qui indique que le plan a été scrollé **/
function createHiddenSprite(strokeColor, inColor, rotation, stage) {
    var pointille = new Kinetic.Group();

    var fleche = new Kinetic.RegularPolygon({
        x: (stage.getWidth() / 3),
        y: stage.getHeight() / 3,
        sides: 3,
        radius: 20,
        fill: inColor,
        stroke: strokeColor,
        strokeWidth: 2,
        rotationDeg: rotation
    });

    var fleche2 = new Kinetic.RegularPolygon({
        x: (stage.getWidth() / 3) + 30,
        y: stage.getHeight() / 3,
        sides: 3,
        radius: 20,
        fill: inColor,
        stroke: strokeColor,
        strokeWidth: 2,
        rotationDeg: rotation
    });

    pointille.add(fleche);
    pointille.add(fleche2);
    return pointille;
}

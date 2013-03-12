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
    var BACKGROUNDCOLOR = 'black';

    /* Scene */
    var stage = new Kinetic.Stage({
        container: 'container',
        width: document.body.clientWidth,
        height: $(".navigation").height()
    });

    var popupStage = new Kinetic.Stage({
        container: 'popupmenu',
        width: $("#popupmenu").width(),
        height: $("#popupmenu").height()
    });

    var layer = new Kinetic.Layer();

    var layerPopup = new Kinetic.Layer();

    var groupLayer = new Kinetic.Group({
        draggable: true,
        dragBoundFunc: function (pos) {
            return {
                x: pos.x,
                y: this.getAbsolutePosition().y
            }
        }
    });

    var suiteParcours = [];
    var precedentParcours = [];



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

    var popupMenu;
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
                        name: "circle",
                        x: stage.getWidth() / 3 * 2 + ((suiteParcours.length + 1) * ESPACE_ENTRE_NOEUD),
                        y: (stage.getHeight() / 6) * 5,
                        radius: 20,
                        fill: COLOR1,
                        stroke: STROKECOLOR,
                        strokeWidth: 2
                    }));
                    // var texteAAfficher = formatNameByLength(monVoisin.data.nom, NB_CHAR_MAX)
                    voisinSimple.add(new Kinetic.Text({
                        x: stage.getWidth() / 3 * 2 + ((suiteParcours.length + 1) * ESPACE_ENTRE_NOEUD),
                        y: (stage.getHeight() / 6) * 5 - 44,
                        text: monVoisin.data.nom,
                        fill: TEXTCOLOR,
                        fontSize: 20,
                        fontFamily: 'Calibri'
                    }));
                    voisinSimple.children[2].on("click tap", function () {
                        navigateTo(noeud, parcours, historique, monVoisin.id);
                    });
                    suiteParcours.push(voisinSimple);
                    // Création du popupMenu
                    popupMenu = createPopupMenu(popupStage, layerPopup, BACKGROUNDCOLOR, COLOR1);
                    popupMenu.children[1].add(createLinePopupMenu(noeud, parcours, historique, popupStage, COLOR1, STROKECOLOR, TEXTCOLOR, popupMenu, monVoisin));

                    nbVoisinsSimple++;
                } else {
                    //MENU MULTI NOEUD
                    nbVoisinsSimple++;
                    voisinSimple.children[3].setText("(" + nbVoisinsSimple + ")");
                    voisinSimple.children[2].off("click tap");
                    voisinSimple.children[2].on("click tap", function () {
                        popupMenu.show();
                        layerPopup.draw();
                    });
                    popupMenu.children[1].add(createLinePopupMenu(noeud, parcours, historique, popupStage, COLOR1, STROKECOLOR, TEXTCOLOR, popupMenu, monVoisin));
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

    var ligneDebut = rondNoeud.getX();
    var ligneFin = rondNoeud.getX();
    if (precedentParcours.length != 0) {
        ligneDebut = stage.getWidth() / 3 - ((precedentParcours.length) * ESPACE_ENTRE_NOEUD);
    }
    if (suiteParcours.length != 0) {
        ligneFin = stage.getWidth() / 3 * 2 + ((suiteParcours.length - 1) * ESPACE_ENTRE_NOEUD);
    }

    var parcoursLine = new Kinetic.Line({
        points: [ligneDebut, stage.getHeight() / 3, ligneFin, stage.getHeight() / 3],
        stroke: COLOR1,
        strokeWidth: 10
    });

    var zoneDraggable = new Kinetic.Rect({
        x: ligneDebut,
        y: 0,
        width: ligneFin - ligneDebut,
        height: stage.getHeight(),
        fill: COLOR1,
        opacity: 0
    });


    groupLayer.add(zoneDraggable);
    groupLayer.add(parcoursLine);

    for (var rond in precedentParcours) {
        groupLayer.add(precedentParcours[rond]);
    }

    groupLayer.add(texteNoeud);
    groupLayer.add(rondNoeud);
    groupLayer.add(rondNoeudSel);
    for (var rond in suiteParcours) {
        groupLayer.add(suiteParcours[rond]);
    }
    layerPopup.add(popupMenu);
    popupStage.add(layerPopup);

    layer.add(groupLayer);
    stage.add(layer);

}

/** Crée une branche **/



/** Crée un menu **/
function createPopupMenu(stage,layer, BACKGROUNDCOLOR, COLOR1) {
    var popupMenu = new Kinetic.Group();
    popupMenu.add(new Kinetic.Rect({
        x: 0,
        y: 0,
        fill: BACKGROUNDCOLOR,
        stroke: COLOR1,
        strokeWidth: 5,
        width: stage.getWidth(),
        height: stage.getHeight()

    }));
    var groupCroix = new Kinetic.Group();
    var groupNoeud = new Kinetic.Group({
        draggable: true,
        dragBoundFunc: function (pos) {
            return {
                x: this.getAbsolutePosition().x,
                y: pos.y
            }
        }

    });
    groupCroix.add(new Kinetic.Line({
        points: [stage.getWidth()- 40, 20, stage.getWidth() - 20, 40],
        stroke: COLOR1,
        strokeWidth: 10
    }));
    groupCroix.add(new Kinetic.Line({
        points: [stage.getWidth() - 40, 40, stage.getWidth() - 20, 20],
        stroke: COLOR1,
        strokeWidth: 10
    }));
    groupCroix.on("click tap", function () {
        popupMenu.hide();
        layer.draw();
    });
    popupMenu.add(groupNoeud);
    popupMenu.add(groupCroix);
    popupMenu.hide();
    return popupMenu;
}

///** Renvoie une ligne au menu **/
function createLinePopupMenu(noeud, parcours, historique, stage, COLOR1, STROKECOLOR, TEXTCOLOR, popupMenu, monVoisin) {
    var line = new Kinetic.Group();
    line.add(new Kinetic.Circle({
        x: 50,
        y: (popupMenu.children[1].children.length +1)* 50,
        radius: 20,
        fill: COLOR1,
        stroke: STROKECOLOR,
        strokeWidth: 2,
    }));
    line.add(new Kinetic.Text({
        x: 100,
        y: (popupMenu.children[1].children.length +1) * 50 - 20,
        width: stage.getWidth() - 140,
        height: 50,
        text: monVoisin.data.nom,
        fill: TEXTCOLOR,
        fontSize: 30,
        fontFamily: 'Calibri'
    }));

    line.children[0].on("click tap", function () {
        navigateTo(noeud, parcours, historique, monVoisin.id);
    });

    return line;
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

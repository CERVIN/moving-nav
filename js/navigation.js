function formatNameByLength(name, length) {
    if (name.length <= length) {
        return name;
    } else {
        return name.substring(0, length - 3) + "...";
    }
}

var TEXTCOLOR;
var COLOR1;
var COLOR2;
var COLORDEFAULT;
var STROKECOLOR;
var ESPACE_ENTRE_NOEUD;
var ESPACE_TEXTE;
var NB_CHAR_MAX;
var BACKGROUNDCOLOR;
var FONTSIZE;
var FONTFAMILY;
var NODE_RADIUS;
var LINE_WIDTH;
var STROKE_WIDTH;

function createNavigation(data, noeud, parcours, historique) {
    /* PARAMETRES */
    TEXTCOLOR = '#fff';
    COLOR1 = parcours.couleur1;
    COLOR2 = parcours.couleur2;
    COLORDEFAULT = '#F58F00';
    STROKECOLOR = '#000';
    ESPACE_ENTRE_NOEUD = (document.body.clientWidth / 10)*2;
    NB_CHAR_MAX = 15;
    BACKGROUNDCOLOR = '#000';
    FONTSIZE = $(".navigation").height() / 10;
    FONTFAMILY = 'Calibri';
    NODE_RADIUS = $(".navigation").height() / 10;
    LINE_WIDTH = $(".navigation").height() / 20;
    ESPACE_TEXTE = 2 * NODE_RADIUS;
    STROKE_WIDTH = NODE_RADIUS / 10;




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
            name: noeud.id + "K" + parcours.id + "K" + historique[h]
        });

        var colorNoeud = COLOR1;
        // SI on était dans un parcours différent
        if (noeudHisto.parcours.length != 0 && getParcoursFromNode(noeudHisto, parcours.id, data) == null) {
            var parcoursDuNoeudId = tryGetDifferentParcoursFromNode(noeudHisto, parcours.id);
            group.setName(noeud.id + "K" + parcoursDuNoeudId + "K" + historique[h]);
            colorNoeud = getInfoParcours(parcoursDuNoeudId, data).couleur1;

        }

        var rond = new Kinetic.Circle({
            x: stage.getWidth() / 3 - ((precedentParcours.length + 1) * ESPACE_ENTRE_NOEUD),
            y: stage.getHeight() / 3,
            radius: NODE_RADIUS,
            fill: colorNoeud,
            stroke: STROKECOLOR,
            strokeWidth: STROKE_WIDTH
        });

        var texteAAfficher = formatNameByLength(noeudHisto.data.nom, NB_CHAR_MAX)

        var texte = new Kinetic.Text({
            x: stage.getWidth() / 3 - ((precedentParcours.length + 1) * ESPACE_ENTRE_NOEUD) - (texteAAfficher.length / 2) * FONTSIZE /2,
            y: stage.getHeight() / 3 - ESPACE_TEXTE,
            text: texteAAfficher,
            fill: TEXTCOLOR,
            fontSize: FONTSIZE,
            fontFamily: FONTFAMILY
        });

        group.on("click tap", function () {
            var param = this.getName().split("K");
            navigateTo(getNodeById(param[0], data), getInfoParcours(param[1], data), historique, param[2]);
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
        radius: NODE_RADIUS,
        fill: colorNoeud,
        stroke: STROKECOLOR,
        strokeWidth: STROKE_WIDTH
    });

    var rondNoeudSel = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 3,
        radius: (NODE_RADIUS / 4) * 3,
        fill: COLOR2
    });

    var texteNoeud = new Kinetic.Text({
        x: stage.getWidth() / 2 - (noeud.data.nom.length / 2) * FONTSIZE/2,
        y: stage.getHeight() / 3 - ESPACE_TEXTE,
        text: noeud.data.nom,
        fill: TEXTCOLOR,
        fontSize: FONTSIZE,
        fontFamily: FONTFAMILY
    });

    /* Zone futur */

    var popupMenu = new Kinetic.Group();
    var popupMenuParcours = new Kinetic.Group();
    // Récupération noeuds voisins
    if (noeud.voisins.length != 0 || noeud.parcours.length > 1) {
        var nbVoisinsParcours = 0;
        var nbVoisinsSimple = 0;
        var voisinSimple;
        var voisinParcours;
        for (var v in noeud.voisins) {
            var monVoisin = getNodeById(noeud.voisins[v].id, data);
            if (monVoisin.parcours.length == 0) {
                if (nbVoisinsSimple == 0) {
                    //Création du lien
                    voisinSimple = createBranche(noeud, parcours, historique, stage, monVoisin, suiteParcours, ESPACE_ENTRE_NOEUD, COLOR1, STROKECOLOR, TEXTCOLOR);
                    suiteParcours.push(voisinSimple);
                    // Création du popupMenu
                    popupMenu = createPopupMenu(popupStage, layerPopup, BACKGROUNDCOLOR, COLOR1);
                    popupMenu.children[1].add(createLinePopupMenu(noeud, parcours, historique, popupStage, COLOR1, STROKECOLOR, TEXTCOLOR, popupMenu, monVoisin));
                    nbVoisinsSimple++;
                } else {
                    //MENU MULTI NOEUD
                    nbVoisinsSimple++;
                    switchToMultiNode(popupMenu, layerPopup, nbVoisinsSimple, voisinSimple);
                    popupMenu.children[1].add(createLinePopupMenu(noeud, parcours, historique, popupStage, COLOR1, STROKECOLOR, TEXTCOLOR, popupMenu, monVoisin));
                }
            } else {
                if (nbVoisinsParcours == 0) {
                    //LIEN PARCOURS
                    var monParcoursVoisinId = tryGetDifferentParcoursFromNode(monVoisin, parcours.id);
                    voisinParcours = createBranche(noeud, getInfoParcours(monParcoursVoisinId, data), historique, stage, monVoisin, suiteParcours, ESPACE_ENTRE_NOEUD, getInfoParcours(monParcoursVoisinId, data).couleur1, STROKECOLOR, TEXTCOLOR);
                    suiteParcours.push(voisinParcours);
                    popupMenuParcours = createPopupMenu(popupStage, layerPopup, BACKGROUNDCOLOR, getInfoParcours(monParcoursVoisinId, data).couleur1);
                    for (var p in monVoisin.parcours) {
                        var info = getInfoParcours(monVoisin.parcours[p].id, data);
                        nbVoisinsParcours++;
                        popupMenuParcours.children[1].add(createLinePopupMenu(noeud, info, historique, popupStage, info.couleur1, STROKECOLOR, TEXTCOLOR, popupMenuParcours, monVoisin));
                        if (nbVoisinsParcours > 1) {
                            switchToMultiNode(popupMenuParcours, layerPopup, nbVoisinsParcours, voisinParcours);
                        }
                    }

                } else {
                    //MENU MULTI NOEUD
                    nbVoisinsParcours++;
                    popupMenuParcours.children[1].add(createLinePopupMenu(noeud, info, historique, popupStage, info.couleur1, STROKECOLOR, TEXTCOLOR, popupMenuParcours, monVoisin));
                    switchToMultiNode(popupMenuParcours, layerPopup, nbVoisinsParcours, voisinParcours);
                }
            }

        }
        //Changement de parcours sur le noeud
        for (var p in noeud.parcours) {
            if (noeud.parcours[p].id != parcours.id && noeud.parcours[p].suivant != -1) {
                var monVoisin = getNodeById(noeud.parcours[p].suivant, data);
                if (nbVoisinsParcours == 0) {
                    //LIEN PARCOURS
                    var monParcoursVoisinId = noeud.parcours[p].id;
                    voisinParcours = createBranche(noeud, noeud.parcours[p], historique, stage, monVoisin, suiteParcours, ESPACE_ENTRE_NOEUD, getInfoParcours(monParcoursVoisinId, data).couleur1, STROKECOLOR, TEXTCOLOR);
                    suiteParcours.push(voisinParcours);
                    popupMenuParcours = createPopupMenu(popupStage, layerPopup, BACKGROUNDCOLOR, getInfoParcours(monParcoursVoisinId, data).couleur1);
                    for (var p in monVoisin.parcours) {
                        if (monVoisin.parcours[p].id != parcours.id) {
                            var info = getInfoParcours(monVoisin.parcours[p].id, data);
                            nbVoisinsParcours++;
                            popupMenuParcours.children[1].add(createLinePopupMenu(noeud, info, historique, popupStage, info.couleur1, STROKECOLOR, TEXTCOLOR, popupMenuParcours, monVoisin));
                            if (nbVoisinsParcours > 1) {
                                switchToMultiNode(popupMenuParcours, layerPopup, nbVoisinsParcours, voisinParcours);
                            }
                        }
                    }
                } else {
                    //MENU MULTI NOEUD
                    nbVoisinsParcours++;
                    popupMenuParcours.children[1].add(createLinePopupMenu(noeud, info, historique, popupStage, info.couleur1, STROKECOLOR, TEXTCOLOR, popupMenuParcours, monVoisin));
                    switchToMultiNode(popupMenuParcours, layerPopup, nbVoisinsParcours, voisinParcours);
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
            radius: NODE_RADIUS,
            fill: COLOR1,
            stroke: STROKECOLOR,
            strokeWidth: STROKE_WIDTH
        });

        var texteAAfficher = formatNameByLength(noeudSuivant.data.nom, NB_CHAR_MAX)
        var texte = new Kinetic.Text({
            x: stage.getWidth() / 3 * 2 + ((suiteParcours.length) * ESPACE_ENTRE_NOEUD) - (texteAAfficher.length / 2) * FONTSIZE /2 ,
            y: stage.getHeight() / 3 - ESPACE_TEXTE,
            text: texteAAfficher,
            fill: TEXTCOLOR,
            fontSize: FONTSIZE,
            fontFamily: FONTFAMILY
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
        strokeWidth: LINE_WIDTH
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
    layerPopup.add(popupMenuParcours);
    popupStage.add(layerPopup);

    layer.add(groupLayer);
    stage.add(layer);

}

/** Creer une branche parcours ou la met a jour. Renvoie le nombre liens sur la branche **/
function updateParcoursBranch(noeud, parcours, historique, stage, data, nbVoisinsParcours, monVoisin, suiteParcours, voisinParcours, popupStage, popupMenuParcours, layerPopup, ESPACE_ENTRE_NOEUD, STROKECOLOR, TEXTCOLOR, BACKGROUNDCOLOR) {
    alert("test : " + nbVoisinsParcours + " - " + popupMenuParcours.children.length);
    if (nbVoisinsParcours == 0) {
        //LIEN PARCOURS
        var monParcoursVoisinId = tryGetDifferentParcoursFromNode(monVoisin, parcours.id);
        voisinParcours = createBranche(noeud, getInfoParcours(monParcoursVoisinId, data), historique, stage, monVoisin, suiteParcours, ESPACE_ENTRE_NOEUD, getInfoParcours(monParcoursVoisinId, data).couleur1, STROKECOLOR, TEXTCOLOR);
        suiteParcours.push(voisinParcours);
        popupMenuParcours = createPopupMenu(popupStage, layerPopup, BACKGROUNDCOLOR, getInfoParcours(monParcoursVoisinId, data).couleur1);
        for (var p in monVoisin.parcours) {
            var info = getInfoParcours(monVoisin.parcours[p].id, data)
            nbVoisinsParcours++;
            popupMenuParcours.children[1].add(createLinePopupMenu(noeud, info, historique, popupStage, info.couleur1, STROKECOLOR, TEXTCOLOR, popupMenuParcours, monVoisin));
            if (nbVoisinsParcours > 1) {
                switchToMultiNode(popupMenuParcours, layerPopup, nbVoisinsParcours, voisinParcours);
            }
        }

    } else {
        //MENU MULTI NOEUD
        nbVoisinsParcours++;
        popupMenuParcours.children[1].add(createLinePopupMenu(noeud, info, historique, popupStage, info.couleur1, STROKECOLOR, TEXTCOLOR, popupMenuParcours, monVoisin));
        switchToMultiNode(popupMenuParcours, layerPopup, nbVoisinsParcours, voisinParcours);
    }
    return nbVoisinsParcours;
}


/** Transforme un branche simple en lien multiple (avec popup) **/
function switchToMultiNode(popupMenu, layerPopup, nbLink, branch) {
    branch.children[3].setText("(" + nbLink + ")");
    branch.children[2].off("click tap");
    branch.children[2].on("click tap", function () {
        $("#popupmenu").css('zIndex', 100);
        popupMenu.show();
        layerPopup.draw();

    });
}

/** Crée une branche **/
function createBranche(noeud, parcours, historique, stage, monVoisin, tabParcours, ESPACE_ENTRE_NOEUD, COLOR1, STROKECOLOR, TEXTCOLOR) {
    voisinSimple = new Kinetic.Group({
        name: monVoisin.id
    });
    voisinSimple.add(new Kinetic.Rect({
        x: stage.getWidth() / 3 * 2 + ((tabParcours.length) * ESPACE_ENTRE_NOEUD),
        y: stage.getHeight() / 3,
        fill: COLOR1,
        width: 200,
        height: (stage.getHeight() / 6) * 5 - stage.getHeight() / 3,
        opacity: 0
    }));
    voisinSimple.add(new Kinetic.Line({
        name: "line",
        points: [stage.getWidth() / 3 * 2 + ((tabParcours.length) * ESPACE_ENTRE_NOEUD), stage.getHeight() / 3, stage.getWidth() / 3 * 2 + ((tabParcours.length + 1) * ESPACE_ENTRE_NOEUD), (stage.getHeight() / 6) * 5],
        stroke: COLOR1,
        strokeWidth: LINE_WIDTH,
    }));
    voisinSimple.add(new Kinetic.Circle({
        name: "circle",
        x: stage.getWidth() / 3 * 2 + ((tabParcours.length + 1) * ESPACE_ENTRE_NOEUD),
        y: (stage.getHeight() / 6) * 5,
        radius: NODE_RADIUS,
        fill: COLOR1,
        stroke: STROKECOLOR,
        strokeWidth: STROKE_WIDTH
    }));
    // var texteAAfficher = formatNameByLength(monVoisin.data.nom, NB_CHAR_MAX)
    voisinSimple.add(new Kinetic.Text({
        x: stage.getWidth() / 3 * 2 + ((tabParcours.length + 1) * ESPACE_ENTRE_NOEUD),
        y: (stage.getHeight() / 6) * 5 - ESPACE_TEXTE,
        text: monVoisin.data.nom,
        fill: TEXTCOLOR,
        fontSize: FONTSIZE,
        fontFamily: FONTFAMILY
    }));
    voisinSimple.children[2].on("click tap", function () {
        navigateTo(noeud, parcours, historique, monVoisin.id);
    });
    return voisinSimple;
}


/** Crée un menu **/
function createPopupMenu(stage, layer, BACKGROUNDCOLOR, COLOR1) {
    var popupMenu = new Kinetic.Group();
    popupMenu.add(new Kinetic.Rect({
        x: 0,
        y: 0,
        fill: BACKGROUNDCOLOR,
        stroke: COLOR1,
        strokeWidth: 2 * STROKE_WIDTH,
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
        points: [stage.getWidth() - (2 * NODE_RADIUS), NODE_RADIUS, stage.getWidth() - NODE_RADIUS, (2 * NODE_RADIUS)],
        stroke: COLOR1,
        strokeWidth: LINE_WIDTH
    }));
    groupCroix.add(new Kinetic.Line({
        points: [stage.getWidth() - (2 * NODE_RADIUS), (2 * NODE_RADIUS), stage.getWidth() - NODE_RADIUS, NODE_RADIUS],
        stroke: COLOR1,
        strokeWidth: LINE_WIDTH
    }));
    groupCroix.on("click tap", function () {
        popupMenu.hide();
        layer.draw();
        $("#popupmenu").css('zIndex', -100);
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
        x: 2 * NODE_RADIUS,
        y: (popupMenu.children[1].children.length + 1) * (3 * NODE_RADIUS),
        radius: NODE_RADIUS,
        fill: COLOR1,
        stroke: STROKECOLOR,
        strokeWidth: STROKE_WIDTH,
    }));
    line.add(new Kinetic.Text({
        x: 100,
        y: (popupMenu.children[1].children.length + 1) * (3 * NODE_RADIUS) - (NODE_RADIUS),
        width: stage.getWidth() - (6 * NODE_RADIUS),
        height: 2 * NODE_RADIUS,
        text: monVoisin.data.nom,
        fill: TEXTCOLOR,
        fontSize: FONTSIZE,
        fontFamily: FONTFAMILY
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

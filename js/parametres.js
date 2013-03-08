function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

function getParcours(data) {
    var parcours = getURLParameter("parcours");

    if (parcours != null) {

        for (var p in data.info.parcours) {
            if (data.info.parcours[p].id == parcours) {
                parcours = data.info.parcours[p];
                break;
            }
        }
    }

    return parcours;
}

function getNoeud(data, parcours) {
    var noeud = getURLParameter("noeud");

    if (noeud == null) {

        noeud = parcours.debut;

    }
    if (noeud == null) {
        return null;
    }
    for (var p in data.noeuds) {
        if (data.noeuds[p].id == noeud) {
            noeud = data.noeuds[p];
            break;
        }
    }
    return noeud;
}

function getHistorique() {
    var historique = [];

    if (getURLParameter("historique") != null) {
        historique = getURLParameter("historique").split("N");
    }

    return historique;
}
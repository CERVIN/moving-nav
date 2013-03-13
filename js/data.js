// JavaScript Document

function parser(url) {
	$.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: showData,
	error: errorfunction
	});

}

function parser(){
    $.ajax({
    type: "GET",
    url: "data/data.json",
    dataType: "json",
    success: showData,
	error: errorfunction
  });
   
}

function errorfunction(json)
{
	alert("Erreur, impossible de récupérer les données.");
	
}

function getNodeById(id, data) {
    for (var p in data.noeuds) {
        if (data.noeuds[p].id == id) {
            return data.noeuds[p];
            break;
        }
    }
    return null;
}

function getParcoursFromNode(node, id, data) {
    for (var p in node.parcours) {
        if (node.parcours[p].id == id) {
            return node.parcours[p];
            break;
        }
    }
    return null;
}

function tryGetDifferentParcoursFromNode(node, idParcours) {
    var hasFoundParcours = false;
    for (var p in node.parcours) {
        if (node.parcours[p].id != idParcours) {
            return node.parcours[p].id;
            break;
        } else {
            hasFoundParcours = true;
        }
    }
    if (hasFoundParcours) {
        return idParcours;
    }
    return null;
}


function isNodeParcours(node, id, data) {
    for (var p in node.parcours) {
        if (node.parcours[p].id == id) {
            return true;
            break;
        }
    }
    return false;
}

function getInfoVoisinFromNode(node, idVoisin, data) {
    for (var p in node.voisins) {
        if (node.voisins[p].id == idVoisin) {
            return node.voisins[p];
            break;
        }
    }
    return null;
}

function getInfoParcours(idParcours, data) {
    for (var p in data.info.parcours) {
        if (data.info.parcours[p].id == idParcours) {
            return data.info.parcours[p];
            break;
        }
    }
    return null;
}
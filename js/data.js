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
        if (node.voisins[p].id == id) {
            return node.voisins[p];
            break;
        }
    }
    return null;
}
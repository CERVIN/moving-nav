// JavaScript Document

  function parser(url){
  
	var req = new XMLHttpRequest();
	req.open("GET", url, true);

	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200 || req.status == 0) {
				showData(JSON.parse(req.responseText));
				}
			}	
		};
	req.send(null);
	}
	
	  function parser(){
  
	var req = new XMLHttpRequest();
	req.open("GET", "data/data.json", true);

	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200 || req.status == 0) {
				showData(JSON.parse(req.responseText));
				}
			}	
		};
	req.send(null);
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
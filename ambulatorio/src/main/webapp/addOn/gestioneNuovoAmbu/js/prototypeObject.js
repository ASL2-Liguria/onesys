// JavaScript Document
// prototype object
Object.keyAt = function(obj, index) {
    var i = 0;
    for (var key in obj) {
        if ((index || 0) === i++) return key;
    }
};
 
Object.GetObjectKeyIndex = function (lista, keyToFind) {
    var i = 0, k=0, key;
	var obj;
	var bolFind = false;
	var indexOut = -1; 
	for (k=0; k<lista.length; k++){ 
		obj = lista[k];
		for (key in obj) {
			if (key == keyToFind) {
//				return i;
				bolFind = true;
				indexOut = i;
				break;
			}
			i++;
		}
		if (bolFind){break;}
	}
    return indexOut;
};

// *******************
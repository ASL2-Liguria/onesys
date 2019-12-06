var riga = -1;
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
    try {
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
});

function viewAnamnesi(obj) {
    try {
        $('iframe#frameAnamnesi').remove();
        if (riga == setRiga(obj)) {
            riga = -1;
        } else {
            riga = setRiga(obj);
            var url = array_url[riga];
            $('<iframe id="frameAnamnesi" src="'+url+'" border="0" scrolling="yes" style="overflow-x:scroll;" width="100%" height="100%" onload=setTimeout("removePrintAndRecord();",0);></iframe>').insertAfter('table#oTable');
            setTimeout(function() {
                try {          
                    $("#frameAnamnesi").contents().find("body").find('form[name="ANAMNESI"]').css({"overflow-x":"scroll","overflow-y":"hidden","width":$(document).width()});
                } catch (e) {
                    alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
                }                
            }, 1000);
        }
        
    } catch(e) {
        alert("NAME: " + e.name + "\nMESSAGE: " + e.message + "\nNUMBER: " + e.number + "\nDESCRIPTION: " + e.description);
    }
}

function registra(obj) {
    // alert(array_iden[setRiga(obj)]);
    parent.registra(array_iden[setRiga(obj)]);
}

function removePrintAndRecord() {
    $("#frameAnamnesi").contents().find("#lblstampa").parent().hide();
    $("#frameAnamnesi").contents().find("#lblregistra").parent().hide();
}

function setRiga(obj) {
    while (obj.nodeName != 'TR') {
        obj = obj.parentNode;
    }
    return obj.sectionRowIndex;
}

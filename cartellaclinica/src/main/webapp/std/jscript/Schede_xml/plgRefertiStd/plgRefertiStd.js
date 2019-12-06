jQuery(document).ready(function(){
	
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    if (window.WindowCartella.name=='' || window.WindowCartella.name!='schedaRicovero') {
    	window.WindowCartella = parent.opener.top.window;
    }
	
	ricerca();
	initTinyMCE();	
});



function  importaTestoStd(cod, id){
	var idenTesto=document.getElementById(id).value;
	var pBinds = new Array();
	var resp='';
	var txt='';
	var target='';
	
	pBinds.push(idenTesto);
	//alert(idenTesto);

		
	var vResp = WindowCartella.executeQuery("TestiStandard.xml","load",pBinds);

	if(vResp.next()){
		resp=vResp.getString("TESTO");
	}

	try{
		target=parent.document.EXTERN.TARGET.value;
		prov=parent.document.EXTERN.PROV.value;
	}catch(e){
		target=document.EXTERN.TARGET.value;
		prov=document.EXTERN.PROV.value;
	}

	//var textToCopy = jQuery(resp).html();
	var textToCopy = repHTML(resp);
	//alert(textToCopy);

	var valueConverted=ConvChar(textToCopy);
	//alert(valueConverted);
	
	if (typeof resp != 'undefined'){
		
		if(prov == 'LETTERA' || prov == 'CONSULENZA'){
			if( window.clipboardData && clipboardData.setData ){
				clipboardData.setData("Text", resp);
				textToCopy=clipboardData.getData("Text");
				//alert('prov Lettera textToCopy: '+textToCopy);
			}
		}else{
			textToCopy=valueConverted;
			//alert('textToCopy else: '+textToCopy);
		}
	
	}else{
		if( window.clipboardData && clipboardData.setData ){
			clipboardData.setData("Text", document.selection.createRange().text);
			textToCopy=clipboardData.getData("Text");
			//alert('textToCopy: '+textToCopy);
		}
	}
		
	if(prov == 'LETTERA' || prov == 'CONSULENZA'){

		var str = parent.tinyMCE.get(target).getContent();
			str += textToCopy;
		 
		parent.tinyMCE.get(target).setContent('');     
		parent.tinyMCE.get(target).setContent(str);
		parent.$.fancybox.close();

	}else{
		
		if(controlFormatString(resp)){
			
			msg='Attenzione! Il testo standard verrà importato senza la formattazione*';
			msg+='\n\n\n';
			msg+='*grassetto, corsivo, ritorno a capo, sottolineature, colore,...';
			alert(msg);
			
			txt=jQuery(resp).text();
			
		}else{
			txt=textToCopy;
		}
		
		//alert('La stringa controllata è formattata? '+controlFormatString(textToCopy) + '\nIl testo da importare è: '+txt);
		
		parent.document.getElementById(target).value+=txt;
		parent.document.getElementById(target).focus();
		parent.$.fancybox.close();
	}
}


//funzione che richiama prototype.js
function ConvChar( str ) {

	strReplaced = str.stripX(true);
	
	return strReplaced;
}


//funzione che restituisce true se il testo è formattato e false se non lo è
function controlFormatString(str){
	
	var controllo=false;
	
	if(
			str.indexOf("<span") 	!= '-1' ||
			str.indexOf("style=") 	!= '-1' ||
			str.indexOf("<em>") 	!= '-1' ||
			str.indexOf("<strong>") != '-1'	||
			str.indexOf("STYLE=") 	!= '-1'	||
			str.indexOf("<EM>") 	!= '-1'	||
			str.indexOf("<br") 		!= '-1'	||
			str.indexOf("<STRONG>") != '-1'
	){
		controllo=true;
	}
	
	return controllo;
}


function repHTML(str){
	
	var replaced=str.replace(/<\/p\>/gi, '\n');
	replaced=replaced.replace(/<p\>/gi, '\n');
	
	return replaced;
}

/*

var dicituraAllegaDatiStr = '<p id="legendaAllegati"><strong>per i dati strutturati di laboratorio vedere allegato</strong></p>';
var str = tinyMCE.get("idAccertamentiEseguiti").getContent();

if (hAllega =='N')
{
 str += dicituraAllegaDatiStr;
 tinyMCE.get("idAccertamentiEseguiti").setContent('');     
 tinyMCE.get("idAccertamentiEseguiti").setContent(str);
}
else
{
 try{ 
   var re = new RegExp(dicituraAllegaDatiStr);
   str = str.replace(re,'');
   tinyMCE.get("idAccertamentiEseguiti").setContent('');     
   tinyMCE.get("idAccertamentiEseguiti").setContent(str);
  }catch(e){};
}*/

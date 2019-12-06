var _INFO_COLONNA	= 'S';
var contatoreRiga 	= 1000;

$(document).ready(function(){
	_INFO_COLONNA	= NS_UTILITY.getUrlParameter('INFO_COLONNA');
});

// Riporta Esami Selezionati
function arrayEsami(){

	// Le Note dipendono da Configurazione MEDUC_RIA_COLONNA_INFO
	var combo 		= opener.document.all['cmbPrestRich_L'];
	var chk			= document.getElementsByName('chkEsami');
	var idEsami		= '';
	var note 		= '';
	var debugEsami 	= '';
	
	// Creo Listbox - Poi Lo Sostituisco
	myListBox=document.createElement("SELECT");
	myListBox.id			= 'cmbPrestRich_L';
	myListBox.name			= 'cmbPrestRich_L';
	myListBox.style.width 	= '100%';
	myListBox.setAttribute('STATO_CAMPO',combo.STATO_CAMPO);
	myListBox.setAttribute('multiple','multiple');
	
	svuotaListBox(myListBox);

	for (var i=0; i<chk.length; i++){

		if (chk[i].checked){
			
			var num = chk[i].rownumber;
			
			myListBox.options[myListBox.options.length] = new Option(chk[i].descr, chk[i].id + '@0');
			
			if(idEsami!=""){idEsami+="#";note+="#";debugEsami+="#";}

			idEsami 	+= chk[i].id;
			debugEsami 	+= chk[i].id;
			debugEsami 	+= '-';
			debugEsami 	+= chk[i].descr;

			if (_INFO_COLONNA == 'S'){
				note		+= '@';
				note		+= $("#txtInfoEsami"+num.toString()).attr("value");
			}
			
		}
	}

	var s= idEsami;
	var b=/#$/.test(s);   
	var t=s.replace(/#$/,"");    

	opener.document.all.HelencoEsami.value 	= idEsami;
	if (_INFO_COLONNA == 'S')
		opener.document.all.Hnote.value 		= note;			
	
	// Sostituisco il Listbox con Quello Creato
	combo.options.outerHTML = combo.options.outerHTML.substr(0,combo.options.outerHTML.toUpperCase().indexOf('<OPTION') > 0 ? combo.options.outerHTML.toUpperCase().indexOf('<OPTION'):combo.options.outerHTML.toUpperCase().indexOf('</SELECT')) + myListBox.options.innerHTML + '</SELECT>';
	
	self.close();
}


function chiudi(){
	
	self.close();
}


function DeselezionaTutto() {
	
	jQuery(".selected").remove();
}


//funzione che seleziona gli esami già scelti alla riapertura della pagina	
function ricordaEsami(){
        TABELLA.caricaEsamiPagina();
}


//seleziona gli esami di un determinato profilo. Configurabile nella tabella radsql.TAB_ESA_GRUPPI
function scegliProfilo(profilo){
	
	TABELLA.aggiungiRigaProfilo(profilo);			
}


function valorizzaCampo(check, tipo){
	
	if(typeof tipo == 'undefined'){
		if(!TABELLA.selezionaEsame(check)){
			if (_INFO_COLONNA == 'S')
				return alert("Esame già presente tra i selezionati. Per inserirlo nuovamente compilare il campo info esame dell'esame già selezionato");
			else
				return alert("Esame già presente tra i selezionati.");
		}
	}else{
		TABELLA.selezionaEsame(check);
	}
	
	var rownumber=check.rownumber;

	if (check.checked){
		
		jQuery("#tr"+rownumber).addClass("selected");
	}
}

var TABELLA = {
		
		aggiungiRigaProfilo : function(profilo){
			
			var statementFile 	= 'OE_Richiesta.xml';
			var statementName 	= 'getEsamiProfiliMNVitro';
			var reparto			= gup('REPARTO_RICHIEDENTE');
			var resp			= '';

			var vResp	=opener.top.executeQuery(statementFile, statementName, [profilo,reparto]);

			while(vResp.next()){
				
				contatoreRiga++;
				input = '<INPUT id='+vResp.getString("IDEN")+' onclick="javascript: valorizzaCampo(this);" value="" trOld="'+vResp.getString("COD_ESA")+'" type=checkbox name=chkEsami rownumber="'+contatoreRiga+'" cod_esa="'+vResp.getString("COD_ESA")+'" descr="'+vResp.getString("DESCR")+'" checked></INPUT></TD>';
				riga = $('<tr></tr>').attr({'id':'tr'+contatoreRiga,'id_esame':vResp.getString("IDEN")}).addClass('selected');
				riga.append($('<td></td>').addClass('tdCheck').append(input));
				riga.append($('<td></td>').addClass('tdCodEsa').html(vResp.getString("COD_ESA"))).append($('<td></td>').addClass('tdDescr').html(vResp.getString("DESCR")));
				riga.append($('<td></td>').addClass('tdCod').html(vResp.getString("COD_MIN")));
				
				if(_INFO_COLONNA == 'S'){
					input	= $('<input/>').addClass('tempi').attr({'type':'text' , 'name' : 'txtInfoEsami' + contatoreRiga , 'id' : 'txtInfoEsami' + contatoreRiga , 'value' : vResp.getString("INFO_ESAME")})
					riga.append($('<td></td>').addClass('tdTempi').append(input));
				}

				resp += vResp.getString("COD_ESA") + ',';
				
				jQuery("#sceltaEsami").prepend(riga);	
			}
			
			// alert(vResp.getString("COD_ESA") + ' : ' +jQuery("input[cod_Esa="+vResp.getString("COD_ESA")+"]").hasClass("selected"));
			
		},
		
		selezionaEsame : function(chk){
			
			contatoreRiga++;
			
			var RowNuovo = contatoreRiga ;
			var idRiga=chk.parentElement.parentElement.id;
			var riga=document.getElementById(idRiga).outerHTML;
			var boolean=true;
			
			if(chk.checked){
				jQuery(".selected").each(function(){

					if(jQuery(this).find("[type=checkbox]").attr("cod_esa")==chk.cod_esa){
						
						var num = jQuery(this).find("[type=checkbox]").attr("rownumber");
						
						if (_INFO_COLONNA == 'S'){
							if(jQuery(this).find("#txtInfoEsami"+num).val()==""){
								boolean=false;
								chk.checked=false;
							}
						}else{
							contatoreRiga--;
							boolean=false;
							chk.checked=false;
						}
					}
				});
			}

			if(!boolean){
				return false;
			}
			
			if (chk.checked){

				var old="tr"+chk.rownumber;
				jQuery("#tr"+chk.rownumber).attr("trOld",chk.cod_esa);
				jQuery("#tr"+chk.rownumber).attr("idOld",chk.id);
				jQuery("#tr"+chk.rownumber).attr("id","OLDTR");
				
				jQuery("#sceltaEsami").prepend(jQuery(riga));
				
				jQuery("#tr"+chk.rownumber).attr("id","tr"+RowNuovo);
				jQuery("#OLDTR").attr("id",old).find(".tdCheck").find("input").attr('checked','');;
				jQuery("#tr"+RowNuovo).addClass("selected");
				jQuery("#tr"+RowNuovo).attr("old",old);
				jQuery("#tr"+RowNuovo).find(".tdCheck").find("input").attr('checked','checked').attr("rownumber",RowNuovo);
				jQuery("#tr"+RowNuovo).find(".tdTempi").find("input").attr('id','txtInfoEsami'+RowNuovo).attr('name','txtInfoEsami'+RowNuovo);
			
			}else{
				
				var idOld=chk.cod_esa;
				jQuery(chk).parent().parent().remove();
				jQuery("[trOld="+idOld+"]").show().find(".tdCheck").find("input").attr('checked','');				
			}
			
			return true;			
		},
		
		caricaEsamiPagina:function(){
			
			var elencoEsami='';
			var noteEsami='';
			if(opener.document.getElementById('HelencoEsami').value != ""){
				
				var hid = opener.document.getElementById('HelencoEsami').value.split("#");
				
				if (_INFO_COLONNA == 'S')
					var hidNote = opener.document.getElementById('Hnote').value.split("#");
				
				for (var i = 0;i<hid.length; i++){

					if(elencoEsami !=''){elencoEsami += ',';}
					elencoEsami += hid[i];
					if (_INFO_COLONNA == 'S'){
						if (noteEsami !=''){
							noteEsami	+= ',';
						}
						noteEsami 	+= hidNote[i];
					}

				}
			}

			// alert(elencoEsami + '\n' + noteEsami);
			TABELLA.caricaEsami(elencoEsami, noteEsami);			
		},
		
		caricaEsami:function(StrarrayEsami,StrarrayNote){
			
			var statementFile 	= 'OE_Richiesta.xml';
			var statementName 	= 'getEsami';
			var resp='';
			var info='';
			if(StrarrayEsami != ''){
				var vResp=opener.top.executeQuery(statementFile, statementName, StrarrayEsami);
			}else{
				return;
			}
			
			while(vResp.next()){
				
				var split	= StrarrayNote.split(',');
				info		= '';			
				contatoreRiga++;
				
				for(var i=0;i<(split.length+1);i++){
					
					// alert('Stringa Esami: '+StrarrayEsami+'\nStringa Info: '+StrarrayNote+ '\nDescrizione: '+vResp.getString("DESCR") +'\nRiga'+vResp.getString("RIGA") +'\ni '+i);
					
					if(i==vResp.getString("RIGA")){						
						info=split[i-1];
					}
				}
				
				var info_esame	= info.replace(/@/,""); 				
				var input		= '<INPUT id='+vResp.getString("IDEN")+' onclick="javascript: valorizzaCampo(this);" value="" trOld="'+vResp.getString("COD_ESA")+'" type=checkbox name=chkEsami rownumber="'+contatoreRiga+'" cod_esa="'+vResp.getString("COD_ESA")+'" descr="'+vResp.getString("DESCR")+'" checked></INPUT>';
				
				riga = $('<tr></tr>').attr({'class' : 'selected', 'id' : 'tr'+contatoreRiga, 'id_esame' : vResp.getString("IDEN")})
				riga.append($('<td></td>').addClass('tdCheck').append(input));
				riga.append($('<td></td>').addClass('tdCodEsa').html(vResp.getString("COD_ESA")));
				riga.append($('<td></td>').addClass('tdDescr').html(vResp.getString("DESCR")));
				riga.append($('<td></td>').addClass('tdCod').html(vResp.getString("COD_MIN")));
				
				if (_INFO_COLONNA == 'S'){

					input	= '<INPUT class=tempi type=text name="txtInfoEsami'+contatoreRiga+'" id="txtInfoEsami'+contatoreRiga+'"  value="'+info_esame+'"> </INPUT>'; 
					riga.append($('<td></td>').addClass('tdTempi').append(input));
				}
				resp += vResp.getString("COD_ESA") + ',';
				
				jQuery("#sceltaEsami").prepend(riga);			
			}
			
			var split=StrarrayEsami.split(',');
			
		}
};

var NS_UTILITY = {
		
	getUrlParameter : function(name){
		var tmpURL = document.location.href;
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( tmpURL );
		
		if( results == null )
			return "";
		else
			return results[1];
	}
};
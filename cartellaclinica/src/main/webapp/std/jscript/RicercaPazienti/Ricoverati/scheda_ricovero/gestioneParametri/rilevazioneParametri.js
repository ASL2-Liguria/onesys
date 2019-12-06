/*alec 2012/03/02*/

$(function(){
	rilevaParametri.init();
});

var rilevaParametri = {

		init : function() {
			rilevaParametri.setDataOra();
			creaOrologio();
			rilevaParametri.initTab();
			rilevaParametri.setEvents();
			$('input:first').focus();
		},
		setDataOra: function(){
			var cDate = document.EXTERN.concatDate.value.split('|');
			var dOggi = new Date();
			for (var i=0; i<cDate.length; i++ ){
				$('#data'+i).val(cDate[i]);
				if (cDate[i]==clsDate.getData(dOggi,'YYYYMMDD')){
					$('#data'+i).attr('checked','checked');					
				}
				$("label[for='data"+i+"']").text(cDate[i].substring(6,8)+'/'+cDate[i].substring(4,6)+'/'+cDate[i].substring(0,4));
			}
			
			$('#txt_ora').val(clsDate.getOra(dOggi));
		},
		initTab: function(){
			if (document.EXTERN.rilevaDa.value!='undefined'){
				$('div#parametri').height('400px');
				var i = document.EXTERN.rilevaDa.value;
				if (i==3){
					$('#tab_menu').hide();
				}
				else{
					for (var j=0; j<=2; j++){
						if (parseInt(i)==j)
							$('#dividTab'+j).show();
						else
							$('#dividTab'+j).hide();
					}
				}				
			}
		},
		setEvents : function() {
			$('input#txt_ora').bind({
				'blur' : function(){oraControl_onblur();},
				'keyup' : function(){oraControl_onkeyup();}
			});
			$('.rilevazione input').keydown(function(event){
				if(event.keyCode==13){ // Enter
					window.focus();
					var errore = NS_CONTROLLO_PARAMETRI_VIT.controllo($(this));
					if (!errore) rilevaParametri.save();
					event.preventDefault();
				} else if(event.keyCode==27){ // Esc
					rilevaParametri.close();
					event.preventDefault();
				}
			});
			$('span#close').click(function(){rilevaParametri.close();});
			$('span#save').click(function(){rilevaParametri.save();});
			$('span.addRilevazione').live('click',function(){rilevaParametri.addRilevazione(this);});
			$('span.removeRilevazione').live('click',function(){rilevaParametri.removeRilevazione(this);});
			
			$('#tab_menu > li').each(function(i){
				$(this).click(function(){
					for (var j=0; j<=2; j++){
						if (j!=i){
							$('#idTab'+j).addClass("deselTab").removeClass("selTab");
							$('#dividTab'+j).hide();
						}
						else{
							$('#idTab'+j).addClass("selTab").removeClass("deselTab");
							$('#dividTab'+j).show();
						}
					};					
				});				
			});
		},

		addRilevazione : function(obj) { 
			var divRilevazione = $(obj).closest('div.parametro');
			var divRilevazioneNew = divRilevazione.clone();
			divRilevazioneNew.find('input,select').val('');
			divRilevazione.after(divRilevazioneNew).find('span.addRilevazione,span.removeRilevazione').hide();
			$('#fancybox-content',parent.document).height($(document).height());
			NS_CONTROLLO_PARAMETRI_VIT.event();
		},
		
		removeRilevazione : function(obj) {
			if ($('div.parametro').length>=2) {
				var divRilevazione = $(obj).closest('div.parametro');
				divRilevazione.prev().find('span.addRilevazione,span.removeRilevazione').show();
				divRilevazione.remove();
			} else {
				alert('Impossibile rimuovere tutte le rilevazioni');
			}
		},

		save : function() {
			var check = true;
			var msg='';
			var idenVisita = parent.document.EXTERN.iden_visita.value;
			var vData = $('input[name=data]:checked').val();
			var vOra = $('input#txt_ora').val();

			var arIdenParametro = new Array();
			var arIdenDettaglio = new Array();
			var arValore1 = new Array();
			var arValore2 = new Array();
			var arNote = new Array();
			var arCampiAgg = new Array();
			
                        

			// controlla data
			if ($('input[name=data]:checked').length!=1) {
				return alert("\t - Selezionare una data corretta\n");
			}
			// controllo presenza orario
			if ($('input#txt_ora').val()==''){
				return alert("\t - Immettere un orario corretto\n");
			}
                        
//                        var newDate = top.clsDate.str2date(vData,'YYYYMMDD',vOra);
//                        var actualDate = new Date();
//                        
//                        if (newDate - actualDate > 0) {
//                            return alert("Attenzione!!\n Data ed ora selezionate sono successive a quelle attuali!");
//                        }

			$('.valori').each(function(i){
				var parametro = $(this);
				var rilevazioni = parametro.find('div.rilevazione input,div.rilevazione select');

				var valore1 = rilevazioni.eq(0).is('input')==true ? rilevazioni.eq(0).val():rilevazioni.eq(0).find('option:selected').val();
				var valore2 = '';
				var nota = $(this).find('div.note input').val();

				if (rilevazioni.length==1) {
					if (valore1=='' && nota=='') {
						return;
					} else if (valore1!='' && !IsNumeric(valore1)) {
						msg += '- valore rilevato in formato non numerico per ' + parametro.attr('descr')+';\n';
						check = false;
					}
				} else {
					valore2 = rilevazioni.eq(1).is('input')==true?rilevazioni.eq(1).val():rilevazioni.eq(1).find('option:selected').val();
					if (valore1 == '' && valore2=='' && nota=='') {
						return;
					} else if (!IsNumeric(valore1) || !IsNumeric(valore2)) {
						msg += '- valore rilevato in formato non numerico per ' + parametro.attr('descr')+';\n';
						check = false;
					}
				}
				
				var campiAgg='';
				parametro.find('.campoAgg').each(function(i){
					if(campiAgg==''){campiAgg='<CAMPI>';}
					valAgg=$(this).find('input,select').is('input')==true ? $(this).find('input').val():$(this).find('select').find('option:selected').text();
					campiAgg+='<CAMPO name="'+$(this).find('input,select').attr('name')+'" descr="'+$(this).find('input,select').attr('descr')+'"';
					campiAgg+=$(this).find('input,select').is('select')==true ? ' value="'+$(this).find('select').find('option:selected').val()+'"':'';
					campiAgg+='>'+valAgg+'</CAMPO>';
				});
				if(campiAgg!=''){campiAgg+='</CAMPI>';}
				
				arValore1.push(valore1);
				arValore2.push(valore2);
				arIdenParametro.push($(this).closest('.parametro').attr('iden')); 
				arIdenDettaglio.push($('input#idenDettaglio').length==0?null:$('input#idenDettaglio').val());
				arNote.push(nota);
				arCampiAgg.push(campiAgg);
				/*var bodypart = $(this).find('td.bodypart input');
				arBodyPart.push(bodypart.length==0?null:bodypart.val());*/
			});

			if (check) {
				if (arIdenParametro.length>0) { 
					dwr.engine.setAsync(false);
					dwrTerapie.rilevaParametro(idenVisita,vData,vOra,arIdenParametro,arIdenDettaglio,arValore1, arValore2,arNote,arCampiAgg,callBack);
					dwr.engine.setAsync(true);
				} else {
					return alert('Impossibile salvare, rilevare almeno un parametro');
				}
			} else {
				return alert('Impossibile salvare:\n' + msg);
			}

			function callBack(resp){
				rilevaParametri.close();
				rilevaParametri.refreshInfoParametri();
				parent.refreshPiano(resp);
			}
		}, 

		refreshInfoParametri : function() {
			var frameParametri = $('iframe#frameParametri:visible',top.document);
			if (frameParametri.length>0) {
				frameParametri[0].contentWindow.location.reload();
			}
		},

		close : function () {
			parent.$.fancybox.close();
		}
};
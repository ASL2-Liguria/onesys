
var _WK_ORDINAMENTO      = '';
var codiciTipoDoc;

$(document).ready(function()
		{
	
	VISDOC_FILTRI.init();

		});

var VISDOC_FILTRI = {

		init:function()
		{	
			
			if (typeof (parent.EXTERN.PROV) !='undefined' && parent.EXTERN.PROV.value =='MMG'){
				$('body').addClass('bodyMMG');
			}
			
			VISDOC_FILTRI.setFiltriAttivi();
			parent.$("#frameFiltri").height(parent.$("#frameFiltri").contents().find("FORM[name=dati]").height()+4);
			//parent.$("#frameWkDoc").height(parent.$("#frameWkDoc").contents().find("FORM[name=dati]").height()+4);

			$('#txtDaData').val(VISDOC_FILTRI.getData(clsDate.dateAdd(new Date(),'D',-parent.confBase.GIORNI),'DD/MM/YYYY'));
			$('#txtAData').val(VISDOC_FILTRI.getData(new Date(),'DD/MM/YYYY'));


			if(parent.confFiltri.NOSOLOGICO=='S' && typeof(parent.EXTERN.nosologico)!='undefined'){
				$('#txtNosologico').val(parent.EXTERN.nosologico.value);
			}
			if(parent.confFiltri.TIPO_DOC=='S' || parent.confBase.TIPO_DOC_VAL!=''){
				VISDOC_FILTRI.setFiltroTipoDoc();
			}
			if(typeof (parent.EXTERN.reparto)!='undefined' && parent.confBase.REPARTO_IN=='S'){
				VISDOC_FILTRI.setFiltroReparto();				
			}

		
			//in apertura obbligare l'utente a scegliere i filtri e cliccare ricerca a meno che non venga passata la richiesta o il documento
			if ((typeof (parent.EXTERN.identificativoEsterno) !='undefined' && parent.EXTERN.identificativoEsterno.value!='') || (typeof (parent.EXTERN.idDocumento) !='undefined' && parent.EXTERN.idDocumento.value!='') || (typeof (parent.confFiltri.IN_APERTURA_TUTTE) !='undefined' && parent.confFiltri.IN_APERTURA_TUTTE=='S') || (typeof (parent.EXTERN.LETTERE)!='undefined' && parent.EXTERN.LETTERE.value=='S')){
				VISDOC_FILTRI.ricercaDoc(); 
			}
			else{	
				parent.$('#frameWkDoc').attr("src","selezionareFiltriWk.html");
				parent.$("#frameWkDoc").height(parent.document.body.offsetHeight - parent.$("#frameWkDoc").position().top-50);
				
			}
			
			
			try{
				top.utilMostraBoxAttesa(false);
			}catch(e)
			{/*catch nel caso non venga aperta dalla cartella*/}

			
		},

		ricercaDoc: function(){


			//	VISDOC_FILTRI.salvaFiltri();

			var whereWk=' where ';
			//per non fare inchiodare il db
			if((typeof (parent.EXTERN.idPatient)=='undefined' || parent.EXTERN.idPatient.value=='') && (typeof (parent.EXTERN.identificativoEsterno) =='undefined' || parent.EXTERN.identificativoEsterno.value=='') && (typeof (parent.EXTERN.idDocumento) =='undefined' || parent.EXTERN.idDocumento.value=='')){
				alert('Parametri di ricerca insufficenti');
				return;
			}	
			if (typeof (parent.EXTERN.idPatient)!='undefined' && parent.EXTERN.idPatient.value!=''){
				if(baseGlobal.SITO=='ASL5'){
					whereWk+=" patientid like '"+parent.EXTERN.idPatient.value+"^%'";
				}
				else
				{
					whereWk+=" patientid = '"+parent.EXTERN.idPatient.value+"^^^&CF&ISO'";
				}
			}
			
			

			//se viene passato in chiamata l'identificativo della richiesta filtro solo per questa (tanto i filtri non sono visibili)
			if (typeof (parent.EXTERN.identificativoEsterno) !='undefined' && parent.EXTERN.identificativoEsterno.value!=''){
				parent.$('#frameFiltri').hide();
				if(whereWk!=' where ') {whereWk+=' and ';}; 

				//	whereWk+=" IDENTIFICATIVOESTERNO='"+parent.EXTERN.identificativoEsterno.value+"'";	
				whereWk+="  id IN (SELECT DISTINCT(parent) FROM xdsregistry.obr47 WHERE obr47_2 ='identificativoEsterno' AND obr47_1 ='"+parent.EXTERN.identificativoEsterno.value+"')";

			}
			
			else if (typeof (parent.EXTERN.idDocumento) !='undefined' && parent.EXTERN.idDocumento.value!=''){
				parent.$('#frameFiltri').hide();
				if(whereWk!=' where ') {whereWk+=' and ';}; 
				whereWk+="  id='"+parent.EXTERN.idDocumento.value+"'";
			}

			else{
				if (parent.confFiltri.RICERCA_ANAGRAFICA=='S'){
					if(whereWk!=' where ') {whereWk+=' and ';};

					if ($('#txtCognome').val()!=''){
						whereWk+=" COGNOME='"+$('#txtCognome').val()+"'";	
					}
					if ($('#txtNome').val()!='')
						whereWk+=" AND NOME='"+$('#txtNome').val()+"'";	

					if ($('#txtDataNascita').val()!='')
						whereWk+=" AND DATA_NASC<='"+$('input[name=txtDataNascita]').val().substr(6,4)+$('input[name=txtDataNascita]').val().substr(3,2)+$('input[name=txtDataNascita]').val().substr(0,2)+"'";

					if($('#txtCognome').val()=='' || $('#txtNome').val()=='' || $('#txtDataNascita').val()==''){
						alert('E necessario compilare i filtri cognome, nome e data di  nascita');
						return;
					}
				}

				if (parent.confFiltri.REPARTO=='S'){
					if ($('#hRepartiElenco').val()!='')
						whereWk+=" AND PROVENIENZA IN ("+$('#hRepartiElenco').val()+")";
				}

				if ($('#txtNosologico').val()!=''){
					whereWk+=" AND NOSOLOGICO='"+$('#txtNosologico').val()+"'";
				}

				if (parent.confFiltri.TIPO_DOC=='S' || parent.confBase.TIPO_DOC_VAL!=''){

					//se non è attivo il filtro tipologia documento
					if(parent.confFiltri.TIPO_DOC=='N'){
						whereWk+=" AND TIPODOC IN ("+codiciTipoDoc+")";
					}
					else{
					codiciTipoDoc='';

					//controllo i fliltri delle tipologie documenti selezionati
					//se è selezionato TUTTE devo prendere tutti i valori 
					if ($('#metodica_TUTTE').hasClass('pulsanteLISelezionato')){
						$('UL[id="elenco_metodiche"] LI').each(function(){
							if ($(this).attr('id')!='metodica_TUTTE'){
								if (codiciTipoDoc==''){
									codiciTipoDoc=parent.confFiltri.TIPOLOGIE_DOC[$(this).attr('id').replace('metodica_','')];
								}
								else{
									codiciTipoDoc+=','+parent.confFiltri.TIPOLOGIE_DOC[$(this).attr('id').replace('metodica_','')];	
								}
							}
						});


					}
					else{
						$('UL[id="elenco_metodiche"]').find('.pulsanteLISelezionato').each(function(){
							if (codiciTipoDoc==''){
								codiciTipoDoc=parent.confFiltri.TIPOLOGIE_DOC[$(this).attr('id').replace('metodica_','')];
							}
							else{
								codiciTipoDoc+=','+parent.confFiltri.TIPOLOGIE_DOC[$(this).attr('id').replace('metodica_','')];	
							}
						});
					}
					
					if (codiciTipoDoc!=''){
						whereWk+=" AND TIPODOC IN ("+codiciTipoDoc+")";
					}
					else
						{
						alert('Selezionare almeno una tipologia di documento');
						return;
						}
					}
				}

				if ($('#txtDaData').val()!='')
					whereWk+=" AND creationtimestamp>='"+$('input[name=txtDaData]').val().substr(6,4)+$('input[name=txtDaData]').val().substr(3,2)+$('input[name=txtDaData]').val().substr(0,2)+"000000'";

				if ($('#txtAData').val()!='')
					whereWk+=" AND creationtimestamp<='"+$('input[name=txtAData]').val().substr(6,4)+$('input[name=txtAData]').val().substr(3,2)+$('input[name=txtAData]').val().substr(0,2)+"235959'";
			}
				whereWk+=" AND STATUS='Approved' ";
			
			//alert(whereWk);

			url="servletGenerator?KEY_LEGAME=WK_DOC_REPOSITORY&WHERE_WK="+escape(whereWk);

			url += "&COD_DEC="				+ VISDOC_FILTRI.getParameter($('#COD_DEC').val(),parent.$('#COD_DEC').val());
	        url += "&COD_FISC="				+ VISDOC_FILTRI.getParameter($('#COD_FISC').val(),parent.$('#COD_FISC').val());
	        url += "&PREDICATE_FACTORY=" 	+ VISDOC_FILTRI.getParameter($('#PREDICATE_FACTORY').val(),parent.$('#PREDICATE_FACTORY').val());
	        url += "&BUILDER=" 				+ VISDOC_FILTRI.getParameter($('#BUILDER').val(),parent.$('#BUILDER').val());
	        url += "&SET_EMERGENZA_MEDICA="	+ VISDOC_FILTRI.getParameter($('#SET_EMERGENZA_MEDICA').val(),parent.$('#SET_EMERGENZA_MEDICA').val());
	        url += "&ID_REMOTO="			+ VISDOC_FILTRI.getParameter($('#idPatient').val(),parent.$('#idPatient').val()); 
	        url += "&QUERY="				+ VISDOC_FILTRI.getParameter($('#QUERY').val(),parent.$('#QUERY').val());
	        url += "&TIPOLOGIA_ACCESSO="	+ VISDOC_FILTRI.getParameter($('#TIPOLOGIA_ACCESSO').val(),parent.$('#TIPOLOGIA_ACCESSO').val());	        
	        url += "&EVENTO_CORRENTE="		+ VISDOC_FILTRI.getParameter($('#EVENTO_CORRENTE').val(),parent.$('#EVENTO_CORRENTE').val());
	        //			alert(url)
			if (_WK_ORDINAMENTO !=''){
				url+="&ORDER_FIELD_CAMPO="+_WK_ORDINAMENTO;		
			}
			
			if(typeof parent.EXTERN.PROV =='undefined' || parent.EXTERN.PROV.value !='MMG'){
				parent.setVeloNero('frameWkDoc');
			}
			parent.$('#frameWkDoc').attr("src",url);

		},

		salvaFiltri: function(){
			var tipoFiltro;
			var hCampoFiltro;
			var pBinds = new Array();

			$('label[FILTRO_CAMPO_DB]').each(function(){
				tipoFiltro=$(this).attr('FILTRO_CAMPO_DB');
				hCampoFiltro=$(this).attr('FILTRO_CAMPO_VALORE');

				pBinds.push(tipoFiltro);
				pBinds.push($('#'+hCampoFiltro).val());
				pBinds.push(baseUser.LOGIN);

				top.dwr.engine.setAsync(false);
				top.dwrUtility.executeStatement('visualizzatore.xml','aggiornaFiltro',pBinds,0,callBack);
				top.dwr.engine.setAsync(true);

				function callBack(resp){
					if(resp[0]=='KO'){
						alert(resp[1]);
					}
				}


			});
		},

		scegliTipoDoc:function(value){

			var id = "metodica_"+value;
			
			var _this = document.getElementById(id);

			//se seleziono TUTTE le altre tipologie devono essere deselezionate; TUTTE non è deselezionabile da se stesso 
			if (id=='metodica_TUTTE'){
				if (!hasClass(_this,"pulsanteLISelezionato")){
					addClass(_this,"pulsanteLISelezionato");
				}	

				$('UL[id="elenco_metodiche"] LI').each(function(){
					if ($(this).attr('id')!='metodica_TUTTE'){
						$(this).removeClass('pulsanteLISelezionato');
					}
				});

			}
			else{
				if (!hasClass(_this,"pulsanteLISelezionato")){
					addClass(_this,"pulsanteLISelezionato");
					$('#metodica_TUTTE').removeClass('pulsanteLISelezionato');
				}else{
					removeClass(_this,"pulsanteLISelezionato");				
				}
			}

		},


		setFiltriAttivi : function () {
			//	alert('passa di qua');
			if (parent.confFiltri.NOSOLOGICO=='N'){
				$('#lblNosologico,#txtNosologico').parent().hide();	
			}
			if (parent.confFiltri.REPARTO=='N'){
				$('#lblReparti,#lblRepartiElenco').parent().hide();	
			}
			if (parent.confFiltri.TIPO_DOC=='N'){
				$('UL[id="elenco_metodiche"]').parent().hide();	
			}
			else
				{
				  //se viene aperto da wk accessi dh
					if(typeof (parent.EXTERN.LETTERE)!='undefined' && parent.EXTERN.LETTERE.value=='S'){
						VISDOC_FILTRI.scegliTipoDoc('LETTERE');	
					}				
					//in apertura seleziono TUTTE	
					else if(typeof (parent.confFiltri.IN_APERTURA_TUTTE) !='undefined' && parent.confFiltri.IN_APERTURA_TUTTE=='S')	{
					VISDOC_FILTRI.scegliTipoDoc('TUTTE');
					}
				}
			if (parent.confFiltri.RICERCA_ANAGRAFICA=='N'){
				$('#lblCognome').parent().parent().hide();	
			}


		},

		setFiltroReparto : function () {

			$('#hRepartiElenco').val("'"+parent.EXTERN.reparto.value+"'");

			top.dwr.engine.setAsync(false);
			top.dwrUtility.executeQuery("visualizzatore.xml","getDescrFiltroReparto",[ $('#hRepartiElenco').val().replace(/'/g,"")],callBackReparto);
			top.dwr.engine.setAsync(true);

			function	callBackReparto(resp){
				if(resp[0]=='KO'){
					alert(resp[1]);
				}
				else
				{
					document.getElementById("lblRepartiElenco").innerHTML=resp[2];
				}
			}

		},

		setFiltroTipoDoc : function () {

			//se non è abilitato il filtro di scelta della tipologia documento , controllo se è configurato il valore da db	
			if(parent.confFiltri.TIPO_DOC=='N'){
				if(parent.confBase.FILTRO_DOC_VAL!='')
				{
					codiciTipoDoc=parent.confBase.TIPO_DOC_VAL;
				}

			}
			/*	else
			{
			top.dwr.engine.setAsync(false);
			top.dwrUtility.executeQuery("visualizzatore.xml","getCodFiltroTipoDoc",[baseUser.LOGIN],callBackCod);
			top.dwr.engine.setAsync(true);

			function	callBackCod(resp){
				if(resp[0]=='KO'){
				}
				else
				{
					$('#hTipiElenco').val(resp[2]);
				}
			}

			if ( $('#hTipiElenco').val()!=''){
				top.dwr.engine.setAsync(false);
				top.dwrUtility.executeQuery("visualizzatore.xml","getDescrFiltroTipoDoc",[ $('#hTipiElenco').val().replace(/'/g,"").replace(/ /g,"")],callBackDescr);
				top.dwr.engine.setAsync(true);

			}		
			function	callBackDescr(resp){
				if(resp[0]=='KO'){
					alert(resp[1]);
				}
				else
				{
					document.getElementById("lblTipiElenco").innerHTML=resp[2];
				}
			}
			}*/

		},



		getData: function(pDate,format){
			anno = pDate.getFullYear();	
			mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
			giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
			switch(format){
			case 'YYYYMMDD':	return anno+mese+giorno;
			case 'DD/MM/YYYY':	return giorno+'/'+mese+'/'+anno;		
			}
		},
		
		getParameter:function(obj,objParent){
			if (typeof(obj) =='undefined'){
				return objParent;
			}else{
				return obj;
			}
		}


};
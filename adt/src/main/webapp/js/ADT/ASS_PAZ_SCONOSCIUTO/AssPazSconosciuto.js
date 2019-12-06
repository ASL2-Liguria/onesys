/**
 * User: matteo.pipitone
 * Date: 10/02/14
 * Time: 16.28
 * 
 * 20140731 - alessandro.arrighi - Rimozione riferimento a funzione deprecata ADT_CONTATTI.associaPazienteSconosciuto.
 * 20150203 - alessandro.arrighi - Ottimizzazione Visualizzazione Intestazione Pagina.
 */

jQuery(document).ready(function () {

    NS_ASS_PAZ_SCONO.init();
    NS_ASS_PAZ_SCONO.event();
    
});
var NS_ASS_PAZ_SCONO = {
	    
		wk_anagrafica : null,
		init:function(){
			var _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById($("#IDEN_CONTATTO").val());
	    	var _JSON_ANAGRAFICA = _JSON_CONTATTO.anagrafica; 
	    	$('#lblTitolo').html(_JSON_ANAGRAFICA.cognome + ' ' + _JSON_ANAGRAFICA.nome + ' - ' + _JSON_ANAGRAFICA.sesso + ' - ' + moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _JSON_ANAGRAFICA.codiceFiscale);
	    	$("#butApplica").css({"float":"right"}).on("click",function(){
	    		
	             document.getElementById("nome").value = document.getElementById("nome").value.toUpperCase();
	             document.getElementById("cognome").value = document.getElementById("cognome").value.toUpperCase();
	             document.getElementById("codicefiscale").value = document.getElementById("codicefiscale").value.toUpperCase();

	             NS_ASS_PAZ_SCONO.startWkAnagrafica();
	             $("#divWkAnagrafica").height("500px");
	             home.NS_ASS_PAZ_SCONO =$(this);
	        });
		},
		event: function () {
	        
	    	NS_FENIX_TAG_LIST.setEvents();
	        
	    	$("#cognome, #nome, #codicefiscale").keypress(function( event ) {
	            if(event.which == 13) {
	                $("#butApplica").trigger("click");
	            }
	        });

	    },
	    
	    startWkAnagrafica : function(){

	        var nome =  ($('#nome').val()=='')?'%25': $('#nome').val() + "%25";
	        var cognome =   ($('#cognome').val()=='')?'%25': $('#cognome').val() + "%25";
	        var codicefiscale = ($('#codicefiscale').val()=='')?null: $('#codicefiscale').val() ;
	        
	        NS_ASS_PAZ_SCONO.wk_anagrafica= new WK({
	            id : "ADT_WK_RIC_PAZ_ASS",
	            container : "divWkAnagrafica",
	            aBind : ["nome","cognome","codice_fiscale"],
	            aVal : [nome,cognome,codicefiscale]
	        });

	        NS_ASS_PAZ_SCONO.wk_anagrafica.loadWk();

	        $(".clsWkScroll, .clsWk").css({"height":"300px"});
	    },
	    
	    chiudiScheda : function () {

	        NS_FENIX_SCHEDA.chiudi();
	    },
	    
	    associa : function(IDEN_ANAG,idenContatto) {
	    	var _json_anagrafica = {id : IDEN_ANAG};     	
	    	var _json_contato = NS_CONTATTO_METHODS.getContattoById(idenContatto);
	    	//var p = {"contatto" : _json_contato, "anagrafica": _json_anagrafica, "hl7Event" : "A01", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Associazione Paziente Avvenuta con Successo", "errorMessage" : "Errore Durante Associazione Paziente"}, "cbkSuccess" : function(){NS_FENIX_SCHEDA.chiudi({'refresh':true});}};
	    	var p = {"contatto" : _json_contato, "anagrafica": _json_anagrafica, "hl7Event" : "A01", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Associazione Paziente Avvenuta con Successo", "errorMessage" : "Errore Durante Associazione Paziente"}, "cbkSuccess" : function(){NS_ASS_PAZ_SCONO.aggiornaMetadatiAnag(idenContatto,IDEN_ANAG);}};
			
			NS_CONTATTO_METHODS.moveVisit(p);
		},
		popolaMetadatiAnag:function(_json,IDEN_ANAG){
			var _JSON_ANAGRAFICA=NS_ANAGRAFICA.Getter.getAnagraficaById(IDEN_ANAG);
			logger.debug('NS_ASS_PAZ_SCONO.popolaMetadatiAnag : carico i dati da anagrafica');
			// carico i dati da _JSON_ANAGRAFICA
			_json.mapMetadatiString['ANAG_COGNOME'] = _JSON_ANAGRAFICA.cognome;
			_json.mapMetadatiString['ANAG_NOME'] =_JSON_ANAGRAFICA.nome;
			_json.mapMetadatiString['ANAG_SESSO'] =_JSON_ANAGRAFICA.sesso;
			_json.mapMetadatiString['ANAG_COD_FISC'] =_JSON_ANAGRAFICA.codiceFiscale;
			if (_JSON_ANAGRAFICA.comuneNascita.id!=null){
				_json.mapMetadatiString['ANAG_COMUNE_NASC'] =_JSON_ANAGRAFICA.comuneNascita.id;
			}			
			_json.mapMetadatiString['ANAG_DATA_NASCITA'] =_JSON_ANAGRAFICA.dataNascita.substr(0,8);
			if (_JSON_ANAGRAFICA.comuneResidenza.id!=null) {
            	_json.mapMetadatiString['ANAG_RES_CODICE_ISTAT'] =_JSON_ANAGRAFICA.comuneResidenza.id;
            }
			if (_JSON_ANAGRAFICA.comuneResidenza.regione.codice!=null){
				_json.mapMetadatiString['ANAG_RES_REGIONE']=_JSON_ANAGRAFICA.comuneResidenza.regione.codice;
			}
			if (_JSON_ANAGRAFICA.comuneResidenza.asl.codice!=null){
				_json.mapMetadatiString['ANAG_RES_ASL']	=_JSON_ANAGRAFICA.comuneResidenza.asl.codice;
			}
			if (_JSON_ANAGRAFICA.comuneResidenza.asl.codice!=null){
				_json.mapMetadatiString['ANAG_RES_CAP']	=_JSON_ANAGRAFICA.comuneResidenza.cap;
			}
			if (_JSON_ANAGRAFICA.comuneResidenza.provincia.codice!=null){
				_json.mapMetadatiString['ANAG_RES_PROV']	=_JSON_ANAGRAFICA.comuneResidenza.provincia.codice;
			}
			if (_JSON_ANAGRAFICA.comuneResidenza.indirizzo!=null){
				_json.mapMetadatiString['ANAG_RES_INDIRIZZO']=_JSON_ANAGRAFICA.comuneResidenza.indirizzo;	
			}
			
			if (_JSON_ANAGRAFICA.stp.codice!=null){
				_json.mapMetadatiString['STP']=_JSON_ANAGRAFICA.stp.codice;
				_json.mapMetadatiString['SCADENZA_STP'] =_JSON_ANAGRAFICA.stp.dataScadenza.substr(6,2)+'/'+_JSON_ANAGRAFICA.stp.dataScadenza.substr(4,2)+'/'+_JSON_ANAGRAFICA.stp.dataScadenza.substr(0,4);
			}
			else{
				_json.mapMetadatiString['STP'] = '';
				_json.mapMetadatiString['SCADENZA_STP'] = '';
			}
			if (_JSON_ANAGRAFICA.eni.codice!=null){
				_json.mapMetadatiString['ENI']=_JSON_ANAGRAFICA.eni.codice;
				_json.mapMetadatiString['SCADENZA_ENI'] =_JSON_ANAGRAFICA.eni.dataScadenza.substr(6,2)+'/'+_JSON_ANAGRAFICA.eni.dataScadenza.substr(4,2)+'/'+_JSON_ANAGRAFICA.eni.dataScadenza.substr(0,4);
			}
			else{
				_json.mapMetadatiString['ENI'] = '';
				_json.mapMetadatiString['SCADENZA_ENI'] = '';
			}
			if (_JSON_ANAGRAFICA.statoCivile.id!=null){
				_json.mapMetadatiCodifiche['ANAG_STATO_CIVILE']= {codice:null,id: _JSON_ANAGRAFICA.statoCivile.id};
				}
			
			if (_JSON_ANAGRAFICA.titoloStudio.id!=null){
				 _json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO']= {codice:null,id: _JSON_ANAGRAFICA.titoloStudio.id};
			}
			if (_JSON_ANAGRAFICA.tesseraSanitaria!=undefined){
				 _json.mapMetadatiString['ANAG_TESSERA_SANITARIA'] =_JSON_ANAGRAFICA.tesseraSanitaria;
			}
			if (_JSON_ANAGRAFICA.tesseraSanitariaScadenza!=undefined){
				_json.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'] =_JSON_ANAGRAFICA.tesseraSanitariaScadenza.substr(0,8);
			}
			// cittadinanza
			if (_JSON_ANAGRAFICA.cittadinanze.length>0){
				_json.mapMetadatiString['ANAG_CITTADINANZA_ID'] =_JSON_ANAGRAFICA.cittadinanze[0].id;
				
			}
			else{ // prendo la nazionalita'
				if (_JSON_ANAGRAFICA.nazionalita.id!=null && _JSON_ANAGRAFICA.nazionalita.id>0){
					_json.mapMetadatiString['ANAG_CITTADINANZA_ID'] =_JSON_ANAGRAFICA.nazionalita.id;
				}
			}			
			if (_JSON_ANAGRAFICA.telefono!=null){
				_json.mapMetadatiString['ANAG_TELEFONO']=_JSON_ANAGRAFICA.telefono
			}
		},
		aggiornaMetadatiAnag:function(idenContatto,IDEN_ANAG){
			var _json_contato = NS_CONTATTO_METHODS.getContattoById(idenContatto);
	    	NS_ASS_PAZ_SCONO.popolaMetadatiAnag(_json_contato,IDEN_ANAG);
	    	var p = {"contatto" :  _json_contato, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Modifica Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Modifica Ricovero"}, "cbkSuccess" : function(){NS_FENIX_SCHEDA.chiudi({'refresh':true});}};
	    	NS_CONTATTO_METHODS.updatePatientInformation(p);
		}
		
};
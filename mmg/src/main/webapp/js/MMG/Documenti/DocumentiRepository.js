$(document).ready(function() {
	$('#li-tabDocAllegati').hide();
    DOCUMENTI_PAZIENTE.init();
    DOCUMENTI_PAZIENTE.setEvents();
});

var DOCUMENTI_PAZIENTE = {
    LOGGER: 		null,
    IDEN_ANAG: 		null,
    ID_REMOTO:		null,
    
    init : function(){
    	
        home.NS_CONSOLEJS.addLogger( { name : "DOCUMENTI_PAZIENTE", console : 0  } );
        DOCUMENTI_PAZIENTE.LOGGER = home.NS_CONSOLEJS.loggers["DOCUMENTI_PAZIENTE"];

        this.IDEN_ANAG       	= $("input#IDEN_ANAG").val();
        this.ID_REMOTO    		= $("input#ID_REMOTO").val();
        
        if( ! LIB.isValid( this.IDEN_ANAG ) ) {
            DOCUMENTI_PAZIENTE.LOGGER.error("IDEN_ANAG non ricevuto in GET.");
            return;
        }
        
        $('#chkRicerca').data('CheckBox').selectByValue('Tutti');

		var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) - 20 ;
		$("#ElencoWork").height( h );
		$("#butUltimi5").hide();
		var da_data = moment().subtract('days', 90);
		$('#txtDaData').val(da_data.format('DD/MM/YYYY'));
		$('#h-txtDaData').val(da_data.format('YYYYMMDD'));
		DOCUMENTI_PAZIENTE.refreshWk();
        //DOCUMENTI_PAZIENTE.lastFive();
    },
    
    setEvents : function(){
       $("#butUltimi5").on("click", function(){ DOCUMENTI_PAZIENTE.lastFive(); });
	   $("#butCerca").on("click", function(){ 
		   $("#lblUltimi5").text("");
		   DOCUMENTI_PAZIENTE.refreshWk();
	   });
	   $('#chkRicerca').on("click",function(){ DOCUMENTI_PAZIENTE.refreshWk(); });
    },
	
	lastFive: function(){
		
        var strLbl = "Ultimi 5 documenti per il paziente " + home.ASSISTITO.NOME_COMPLETO;
        var codicelast = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_VISITE_SPECIALISTICHE + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LETTERE + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LABORATORIO + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ANATOMIA_PATOLOGICA + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_SALA_OPERATORIA + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_PS + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ESAMI_STRUMENTALI;
        
        home.$.NS_DB.getTool({_logger : home.logger}).select({
            id:'XDSREGISTRY.DOCUMENTI_LAST',
            datasource: 'PORTALE_PIC',
            parameter: {
            	idRepository	: { v : $("#ID_REMOTO").val(), t : 'V'},//in ufficio ci vuole 'PROVA07T54I754E' al posto di $("#ID_REMOTO").val(). 
            	codice			: { v : codicelast, t : 'V'},
            	number			: { v : 5, t : 'N'}
            }
		}).done( function(resp) {
			$("#txtDaData").val(resp.result[0].DATA_INIZIALE);
	        $("#h-txtDaData").val(resp.result[0].DATA_INIZIALE_ISO);
	        $("#lblUltimi5").text(strLbl);
	        DOCUMENTI_PAZIENTE.refreshWk();
		} );
	},
	
	
	//(lucas 02/02/2016 : aggiunta delle nuove tipologie di documenti nella ricerca dei documenti
	refreshWk: function(){
		var chkRicerca 		= $("#chkRicerca").data('CheckBox').val() != '' ? $("#chkRicerca").data('CheckBox').val() : '';
		var codiceFiscale	= $("#Cod_Fisc").val();
		var da_data 		= $("#h-txtDaData").val() != "" ? $('#h-txtDaData').val() : moment().subtract('days', 90).format('YYYYMMDD');
		var a_data 			= $("#h-txtAData").val();
		var codice          = "";
		
		switch(chkRicerca){
			case "Visite Specialistiche":
				if (LIB.isValid(home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_VISITE_SPECIALISTICHE)) {
					codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_VISITE_SPECIALISTICHE;
				}
				break;
			
			case "Lettere":
				if (LIB.isValid(home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LETTERE)) {
					codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LETTERE;
				}
				break;
				
			case "Laboratorio":
				if (LIB.isValid(home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LABORATORIO)) {
					codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LABORATORIO;
				}
				break;
				
			case "Esami Strumentali":
				if (LIB.isValid(home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ESAMI_STRUMENTALI)) {
					codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ESAMI_STRUMENTALI;
				}
				break;
			case "PS": //"Verbali PS":
				if (LIB.isValid(home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_PS)) {
					codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_PS;
				}
				break;
			case "AnaPatologica": //"Anatomia Patologica":
				if (LIB.isValid(home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ANATOMIA_PATOLOGICA)) {
					codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ANATOMIA_PATOLOGICA;
				}
				break;
			case "salaOperatoria"://"Sala operatoria":
				if (LIB.isValid(home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_SALA_OPERATORIA)) {
					codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_SALA_OPERATORIA;
				}
				break;
		
			default:
				codice = home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_VISITE_SPECIALISTICHE + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LETTERE + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_LABORATORIO + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ANATOMIA_PATOLOGICA + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_SALA_OPERATORIA + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_PS + "," +
						 home.baseGlobal.DOCUMENTI_PAZIENTE_FILTRO_ESAMI_STRUMENTALI/* +
						 "
						    /* tipologie documenti
						 	cc0002	Verbale di PS
							cc0003	Immagini diagnostiche
							cc0004	Richiesta Consulenza
							cc0005	SDO
							cc0006	Referto di Cardiologia
							cc0007	Lettera di Dimissione
							cc0008	Referto di Laboratorio
							cc0009	Referto di Medicina Nucleare
							cc0010	Lettera al Curante
							cc0011	Lettera Terapia primo ciclo
							cc0012	Referto Endoscopia
							cc0013	Referto Ambulatoriale / Referto Visita Specialistica
							cc0014	Lettera di Trasferimento
							cc0015	Lettera di Prosecuzione di Ricovero
							cc0016	Referto di Neuroradiologia
							cc0017	Referto di Emotrasfusionale
							cc0018	Documento di Sala Operatoria
							cc0019	Visita Anestesiologica
							cc0020	Anatomia Patologica
							cc0021	Segnalazione Decesso
						 
						 "*/;
				break;
		}
			
		this.objWk = new WK({
			"id"			:'WK_REPOSITORY',
			"aBind"			:[
				'idRepository',
				'codice',
				'da_data',
				'a_data',
				'assigningAuthority',
				'patientId',
				'nome',
				'cognome',
				'sesso',
				'dataNascita',
				'codiceFiscale',
				'user',
				'emergenzaMedica'
			],
			"aVal"			:[
				home.ASSISTITO.ID_REMOTO,
				codice,
				da_data,
				a_data,
				'', /*assigningAuthority*/
				home.ASSISTITO.ID_AAC,
				home.ASSISTITO.NOME,
				home.ASSISTITO.COGNOME,
				home.ASSISTITO.SESSO,
				home.ASSISTITO.DATA_NASCITA_ISO,
				home.ASSISTITO.COD_FISC,
				home.baseUser.CODICE_DECODIFICA,
				'N'
			], //al posto di PROVA07T54I754E ci dovra' essere id remoto del paziente 
			"container"		:'ElencoWork'
		});
		
		this.objWk.loadWk();
		this.activeWk = this.objWk;
		
	},
	
	apriDocRep: function(row) {
		var r;
		if (LIB.isValid(row[0])) {
			r=row[0];
		} else {
			r = row;
		}
		
		var Uri = r.URI;
		var id = r.ID;
		NS_MMG_UTILITY.trace('DOCUMENTO.REPOSITORY', this.IDEN_ANAG, null, 'V', id);
		home.NS_FENIX_PRINT.caricaDocumento({"URL":Uri});
	}

};

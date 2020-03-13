/* global home, CONSENSO_UNICO, moment, traduzione, LIB */

$(document).ready(function(){});

var RICERCA_ANAGRAFICA = {

		init:function(){},

		setEvents:function(){}
};

var WK_RICERCA_ANAGRAFICA = {

		tipoCaricamento: null,
		assigning_authority: home.baseGlobal.ASSIGNING_AUTHORITY,

		apriGestisciConsensi:function(rec) {

            var url = 'page?KEY_LEGAME=' 		+ 'GESTISCI_CONSENSI';
            url += '&SITO=PIC';
            url += '&ASSIGNING_AUTHORITY='		+ WK_RICERCA_ANAGRAFICA.assigning_authority;
            url += '&CODICE_FISCALE='			+ rec[0].CODICE_FISCALE;
            url += '&COGNOME='					+ rec[0].COGNOME;
            url += '&COM_NASC='					+ rec[0].COM_NASC;
            url += '&COMUNE_NASCITA='			+ encodeURIComponent(rec[0].COMUNE_NASCITA);
            url += '&DATA_NASCITA='				+ rec[0].DATA_NASCITA.substring(6,10)+rec[0].DATA_NASCITA.substring(3,5)+rec[0].DATA_NASCITA.substring(0,2);
            url += '&ID_REMOTO='				+ rec[0].ID_REMOTO;
            url += '&NOME='						+ rec[0].NOME;
            url += '&PATIENT_ID='				+ rec[0].IDEN_ANAGRAFICA;
            url += '&SESSO='					+ rec[0].SESSO;
            url += '&DATA_MORTE='				+ rec[0].DATA_MORTE;
            url += '&LOGOUT_ON_CLOSE=N';

            home.NS_FENIX_TOP.apriPagina({url: url, fullscreen: true});
        },

		apriDocumentiPaziente:function(rec) {

            var url = 'page?KEY_LEGAME=' 		+ 'DOCUMENTI_PAZIENTE';
            url += '&SITO=PIC';
            url += '&ASSIGNING_AUTHORITY='		+ WK_RICERCA_ANAGRAFICA.assigning_authority;
            url += '&CODICE_FISCALE='			+ rec[0].CODICE_FISCALE;
            url += '&COGNOME='					+ rec[0].COGNOME;
            url += '&COM_NASC='					+ rec[0].COM_NASC;
            url += '&COMUNE_NASCITA='			+ rec[0].COMUNE_NASCITA;
            url += '&DATA_NASCITA='				+ rec[0].DATA_NASCITA.substring(6,10)+rec[0].DATA_NASCITA.substring(3,5)+rec[0].DATA_NASCITA.substring(0,2);
            url += '&EMERGENZA_MEDICA=false';
            url += '&ID_REMOTO='				+ rec[0].ID_REMOTO;
            url += '&NOME='						+ rec[0].NOME;
            url += '&PATIENT_ID='				+ rec[0].IDEN_ANAGRAFICA;
            url += '&PATIENT_CONSENT='			+ true;
            url += '&SESSO='					+ rec[0].SESSO;
            url += '&LOGOUT_ON_CLOSE=N';

            home.NS_FENIX_TOP.apriPagina({url: url, fullscreen: true});
        },

		apriGestioneDSE:function(rec) {

            var url = 'page?KEY_LEGAME=' 		+ 'GESTIONE_DSE';
            url += '&SITO=PIC';
            url += '&ASSIGNING_AUTHORITY='		+ WK_RICERCA_ANAGRAFICA.assigning_authority;
            url += '&CODICE_FISCALE='			+ rec[0].CODICE_FISCALE;
            url += '&COGNOME='					+ rec[0].COGNOME;
            url += '&COM_NASC='					+ rec[0].COM_NASC;
            url += '&COMUNE_NASCITA='			+ rec[0].COMUNE_NASCITA;
            url += '&DATA_NASCITA='				+ rec[0].DATA_NASCITA.substring(6,10)+rec[0].DATA_NASCITA.substring(3,5)+rec[0].DATA_NASCITA.substring(0,2);
            url += '&ID_REMOTO='				+ rec[0].ID_REMOTO;
            url += '&NOME='						+ rec[0].NOME;
            url += '&PATIENT_ID='				+ rec[0].IDEN_ANAGRAFICA;
            url += '&SESSO='					+ rec[0].SESSO;
            url += '&LOGOUT_ON_CLOSE=N';

            home.NS_FENIX_TOP.apriPagina({url: url, fullscreen: true});
        },
        
        apriElencoAccessi:function(rec) {

            var url = 'page?KEY_LEGAME=' 		+ 'ELENCO_ACCESSI';
            url += '&SITO=PIC';
            url += '&ASSIGNING_AUTHORITY='		+ WK_RICERCA_ANAGRAFICA.assigning_authority;
            url += '&CODICE_FISCALE='			+ rec[0].CODICE_FISCALE;
            url += '&COGNOME='					+ rec[0].COGNOME;
            url += '&COM_NASC='					+ rec[0].COM_NASC;
            url += '&COMUNE_NASCITA='			+ rec[0].COMUNE_NASCITA;
            url += '&DATA_NASCITA='				+ rec[0].DATA_NASCITA.substring(6,10)+rec[0].DATA_NASCITA.substring(3,5)+rec[0].DATA_NASCITA.substring(0,2);
            url += '&ID_REMOTO='				+ rec[0].ID_REMOTO;
            url += '&NOME='						+ rec[0].NOME;
            url += '&PATIENT_ID='				+ rec[0].IDEN_ANAGRAFICA;
            url += '&SESSO='					+ rec[0].SESSO;
            url += '&LOGOUT_ON_CLOSE=N';

            home.NS_FENIX_TOP.apriPagina({url: url, fullscreen: true});
        },

		caregiver:{

            inserisciEVENTO:function(rec) {//...serve solo per i test

	            var data_nascita = rec[0].DATA_NASCITA;

                var url = 'page?KEY_LEGAME='	+ 'CONSENSI/CAREGIVER';
                url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
                url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
                url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
                url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;
                url += '&COGNOME='				+ rec[0].COGNOME;
                url += '&DATA_NASCITA='			+ data_nascita.substring(6,10)+data_nascita.substring(3,5)+data_nascita.substring(0,2);
                url += '&NOME='					+ rec[0].NOME;
                url += '&COM_NASC='				+ rec[0].COM_NASC;
                url += '&SESSO='				+ rec[0].SESSO;
	            url += '&LOGOUT_ON_CLOSE=N';
	            
	            url += '&NOSOLOGICO_PAZIENTE=8-2012-27104'; //--> Fra Schito

                home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
            },

	        inserisciPAZIENTE:function(rec) {

	            var data_nascita = rec[0].DATA_NASCITA;

	            var url = 'page?KEY_LEGAME='	+ 'CONSENSI/CAREGIVER';
	            url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
	            url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
	            url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
	            url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;
                url += '&COGNOME='				+ rec[0].COGNOME;
                url += '&DATA_NASCITA='			+ data_nascita.substring(6,10)+data_nascita.substring(3,5)+data_nascita.substring(0,2);
                url += '&NOME='					+ rec[0].NOME;
                url += '&COM_NASC='				+ rec[0].COM_NASC;
                url += '&SESSO='				+ rec[0].SESSO;
	            url += '&LOGOUT_ON_CLOSE=N';

	            home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
	        }
		},

		documenti:{

			esprimi:function(rec){

	            /*
	             * Parametri chiamata da DENTRO l'applicativo:
	             * - ACTION
	             * - PATIENT_ID
	             * - ASSIGNING_AUTHORITY
	             * - CODICE_FISCALE
	             * - KEY_LEGAME
	            */
				
	            var url = 'page?KEY_LEGAME='	+ 'CONSENSO_DOCUMENTI';
	            url += '&ACTION='				+ 'ESPRIMI';
	            url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
	            url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
	            url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;

	            home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
			},

			attiva:function(rec){

	            /*
	             * Parametri chiamata da DENTRO l'applicativo:
	             * - ACTION
	             * - PATIENT_ID
	             * - ASSIGNING_AUTHORITY
	             * - CODICE_FISCALE
	             * - KEY_LEGAME
	            */
				
	            var url = 'page?KEY_LEGAME='	+ 'CONSENSO_DOCUMENTI';
	            url += '&ACTION='				+ 'ATTIVA';
	            url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
	            url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
	            url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;

	            home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
			},

			oscura:function(rec) {

				/*
	             * Parametri chiamata da DENTRO l'applicativo:
	             * - ACTION
	             * - PATIENT_ID
	             * - ASSIGNING_AUTHORITY
	             * - CODICE_FISCALE
	             * - KEY_LEGAME
	            */

	            var url = 'page?KEY_LEGAME='	+ 'CONSENSO_DOCUMENTI';
	            url += '&ACTION='				+ 'OSCURA';
	            url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
	            url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
	            url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;

	            home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
	        },

            consenso:function(rec) {

	            var data_nascita = rec[0].DATA_NASCITA;

                var url = 'page?KEY_LEGAME='		+ 'CONSENSI/CONSENSO_DOCUMENTO';
                url += '&ASSIGNING_AUTHORITY='		+ WK_RICERCA_ANAGRAFICA.assigning_authority;
                url += '&PATIENT_ID='				+ rec[0].IDEN_ANAGRAFICA;
                url += '&CODICE_FISCALE='			+ rec[0].CODICE_FISCALE;
                url += '&NOME='						+ rec[0].NOME;
                url += '&COGNOME='					+ rec[0].COGNOME;
                url += '&DATA_NASCITA='				+ data_nascita.substring(6,10)+data_nascita.substring(3,5)+data_nascita.substring(0,2);
                url += '&COM_NASC='					+ rec[0].COM_NASC;
                url += '&SESSO='					+ rec[0].SESSO;
	            /*** url += '&SUPER_SENSIBILE_DEFAULT='	+ 'S'; ***/
	            url += '&LOGOUT_ON_CLOSE=N';

	            url += '&ID_DOCUMENTO=urn:uuid:493d3b66-0934-7206-2da2-1137a440e0f8'; //--> Fra Schito

                home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
            }
		},

		allegato:{

			allega:function(rec, idenConsenso, tipo_consenso){

				/*** var key_legame = 'DOCUMENTI_ALLEGATI';
				var resp = home.NS_FENIX_PIC.search.consensus(rec[0].IDEN_ANAGRAFICA, 'CONSENSO_UNICO');
				var iden_consenso =resp.IDEN;

				var url = 'page?KEY_LEGAME='+key_legame;
				url += '&SITO=PIC';
				url += '&PATIENT_ID='+anagrafica;
				url += '&IDEN_CONSENSO='+iden_consenso;

	            home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
				return; ***/

				var buttonA = $("<button></button>").attr("id","butFile");
				buttonA.html("File");
				buttonA.on("click",function(e){
					e.preventDefault();
		    		e.stopImmediatePropagation();
		    		WK_RICERCA_ANAGRAFICA.popupAllega.showHide($(this).attr("id"));
				});

				var buttonB = $("<button></button>").attr("id","butScanner");
				buttonB.html("Scanner");
				buttonB.on("click",function(e){
					e.preventDefault();
		    		e.stopImmediatePropagation();
		    		WK_RICERCA_ANAGRAFICA.popupAllega.showHide($(this).attr("id"));
				});


				var $fr = $("<form>").attr("id","AllegaDOC");
		        $fr.append(
		        			$(document.createElement('p')).append(
		        			buttonA, /* buttonB, */
	       					$("<input name='AllegaFile' type='file' class='' id='AllegaFile'>")),
							$(document.createElement('p')).append(
					            $(document.createElement('label')).attr({ "id": "lblCmbScanner"}).text("Scanner"),
								$("<select type='multipe' id='cmbScanner'>")),
							$(document.createElement('p')).append(
				                $(document.createElement('label')).attr({"id": "lbltxtNomeAllegato"}).text("Nome allegato"),
				                $(document.createElement('input')).attr({"id": "txtNomeAllegato", "name": "txtNomeAllegato", "type": "text"})),
				            $(document.createElement('p')).append(
				                $(document.createElement('label')).attr({ "id": "lbltxtNote"}).text("Note"),
				                $(document.createElement('textarea')).attr({"id": "txtNote", "name": "txtNote", 'maxLength' : 1000}).css({ 'width' : '100%', 'height': 50 })
				                )
				            );

		    	$.dialog($fr,{"width":"400px",
		            "title":'Allega documento al consenso in vigore',
					"showBtnClose" : false,
					"modal" : true,
		            "buttons": [
			            {"label": "Annulla", "action": function (){
			                    $.dialog.hide();
			                }
			            },
		                {"label": "Salva", "action": function (){
			                	WK_RICERCA_ANAGRAFICA.popupAllega.salva(rec, idenConsenso, tipo_consenso);
			                }
			            }
		            ]
		        });

		    	WK_RICERCA_ANAGRAFICA.popupAllega.init();
		    	DOCUMENTI_ALLEGATI.init();
			},

			visualizza:function(rec, tipo_consenso){
				var resp = home.NS_FENIX_PIC.search.consensus(rec[0].IDEN_ANAGRAFICA, tipo_consenso);
				var iden = resp.IDEN;
				window.open("showDocumentoAllegato?IDEN="+iden);
			}

		},

        eventi:{

        	esprimi:function(rec) {

    			/*
                 * Parametri chiamata da DENTRO l'applicativo:
                 * - ACTION
                 * - PATIENT_ID
                 * - ASSIGNING_AUTHORITY
                 * - CODICE_FISCALE
                 * - KEY_LEGAME
                */

                var url = 'page?KEY_LEGAME='	+ 'CONSENSO_EVENTI';
                url += '&ACTION='				+ 'ESPRIMI';
                url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
                url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
                url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;

                home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
            },

        	attiva:function(rec) {

    			/*
                 * Parametri chiamata da DENTRO l'applicativo:
                 * - ACTION
                 * - PATIENT_ID
                 * - ASSIGNING_AUTHORITY
                 * - CODICE_FISCALE
                 * - KEY_LEGAME
                */

                var url = 'page?KEY_LEGAME='	+ 'CONSENSO_EVENTI';
                url += '&ACTION='				+ 'ATTIVA';
                url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
                url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
                url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;

                home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
            },

        	oscura:function(rec) {
                /*
                 * Parametri chiamata da DENTRO l'applicativo:
                 * - ACTION
                 * - PATIENT_ID
                 * - ASSIGNING_AUTHORITY
                 * - CODICE_FISCALE
                 * - KEY_LEGAME
                */

                var url = 'page?KEY_LEGAME='	+ 'CONSENSO_EVENTI';
                url += '&ACTION='				+ 'OSCURA';
                url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
                url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
                url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;

                home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
            },

            consenso:function(rec) {
                /*
                 * Parametri chiamata da DENTRO l'applicativo:
                 * - ACTION
                 * - PATIENT_ID
                 * - ASSIGNING_AUTHORITY
                 * - CODICE_FISCALE
                 * - KEY_LEGAME
                */
	            var data_nascita = rec[0].DATA_NASCITA;

                var url = 'page?KEY_LEGAME='		+ 'CONSENSI/CONSENSO_EVENTO';
                url += '&ASSIGNING_AUTHORITY='		+ WK_RICERCA_ANAGRAFICA.assigning_authority;
                url += '&PATIENT_ID='				+ rec[0].IDEN_ANAGRAFICA;
                url += '&CODICE_FISCALE='			+ rec[0].CODICE_FISCALE;                
	            url += '&COGNOME='					+ rec[0].COGNOME;
	            url += '&DATA_NASCITA='				+ data_nascita.substring(6,10)+data_nascita.substring(3,5)+data_nascita.substring(0,2);
	            url += '&NOME='						+ rec[0].NOME;
	            url += '&COM_NASC='					+ rec[0].COM_NASC;
	            url += '&SESSO='					+ rec[0].SESSO;
	            url += '&SUPER_SENSIBILE_DEFAULT='	+ 'S';
	            url += '&LOGOUT_ON_CLOSE=N';

	            url += '&NOSOLOGICO_PAZIENTE=8-2012-27104'; //--> Fra Schito

                home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
            }
        },

		inserisciModifica:function(rec){

	            /*
	             * Parametri chiamata da DENTRO l'applicativo:
	             * - ACTION
	             * - PATIENT_ID
	             * - ASSIGNING_AUTHORITY
	             * - CODICE_FISCALE
	             * - COGNOME
	             * - COMUNE_NASCITA
	             * - COMUNE_RESIDENZA
	             * - DATA_NASCITA
	             * - KEY_LEGAME
	             * - NOME
	            */

	            var data_nascita = rec[0].DATA_NASCITA;

	            var url = 'page?KEY_LEGAME='	+ 'CONSENSI/CONSENSO_UNICO';
	            url += '&TIPO_CONSENSO='		+ 'CONSENSO_UNICO';
	            url += '&ACTION='				+ 'INSERISCI';
	            url += '&ASSIGNING_AUTHORITY='	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
	            url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
	            url += '&PATIENT_ID='			+ rec[0].IDEN_ANAGRAFICA;
	            url += '&TESSERA_SANITARIA='	+ rec[0].TESSERA_SANITARIA;
	            url += '&CODICE_FISCALE='		+ rec[0].CODICE_FISCALE;
	            url += '&COGNOME='				+ rec[0].COGNOME;
	            url += '&COMUNE_NASCITA='		+ rec[0].COMUNE_NASCITA;
	            url += '&COMUNE_RESIDENZA='		+ rec[0].COMUNE_RESIDENZA;
				url += '&INDIRIZZO='			+ rec[0].INDIR;
	            url += '&DATA_NASCITA='			+ data_nascita.substring(6,10)+data_nascita.substring(3,5)+data_nascita.substring(0,2);
	            url += '&NOME='					+ rec[0].NOME;
	            url += '&COM_NASC='				+ rec[0].COM_NASC;
	            url += '&SESSO='				+ rec[0].SESSO;
	            url += '&LOGOUT_ON_CLOSE=N';

	            home.NS_FENIX_TOP.apriPagina({url:encodeURI(url),fullscreen:true});
		},

		inserisciModificaMMG:function(rec){

            var data_nascita = rec[0].DATA_NASCITA;

            var url = 'page?KEY_LEGAME=' 	+ 'CONSENSI/CONSENSO_CANALE_VISIBILITA_MMG';
            url += '&TIPO_CONSENSO=' 		+ 'CONSENSO_CANALE_VISIBILITA_MMG';
            url += '&ACTION=' 				+ 'INSERISCI';
            url += '&ASSIGNING_AUTHORITY=' 	+ WK_RICERCA_ANAGRAFICA.assigning_authority;
            url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
            url += '&PATIENT_ID=' 			+ rec[0].IDEN_ANAGRAFICA;
            url += '&TESSERA_SANITARIA=' 	+ rec[0].TESSERA_SANITARIA;
            url += '&CODICE_FISCALE=' 		+ rec[0].CODICE_FISCALE;
            url += '&COGNOME=' 				+ rec[0].COGNOME;
            url += '&COMUNE_NASCITA=' 		+ rec[0].COMUNE_NASCITA;
            url += '&COMUNE_RESIDENZA=' 	+ rec[0].COMUNE_RESIDENZA;
			url += '&INDIRIZZO=' 			+ rec[0].INDIR;
            url += '&DATA_NASCITA=' 		+ data_nascita.substring(6,10)+data_nascita.substring(3,5)+data_nascita.substring(0,2);
            url += '&NOME=' 				+ rec[0].NOME;
            url += '&COM_NASC=' 			+ rec[0].COM_NASC;
            url += '&SESSO=' 				+ rec[0].SESSO;
            url += '&LOGOUT_ON_CLOSE=N';

            home.NS_FENIX_TOP.apriPagina({url:encodeURI(url),fullscreen:true});
		},

		popupAllega:{

			init:function(){
				$("#AllegaFile, #lblCmbScanner, #cmbScanner").hide();
		    	$("#cmbScanner").append($("</option>"));
			},

			salva:function(rec, idenConsenso, tipo_consenso){

				if($("#AllegaFile").val() !== ''){
            		var file 		= $("#AllegaFile").val();
            		var nome 		= $("#txtNomeAllegato").val();
            		var note 		= $("#txtNote").val();
            		var percorso 	= $("#AllegaFile").val();
            		var resp 		= (idenConsenso === null) ? home.NS_FENIX_PIC.search.consensus(rec[0].IDEN_ANAGRAFICA, tipo_consenso/*'CONSENSO_UNICO'*/) : idenConsenso;
                	var allegato	= home.NS_FENIX_PIC.search.allegato(resp.IDEN);
                	if(allegato.IDEN === undefined){
                		DOCUMENTI_ALLEGATI.allegaDocumento(resp.IDEN, file, nome, percorso, note);
                		$.dialog.hide();
                	}else{

        				var params = {
        			            "title"	: "Attenzione",
        			            "msg"	: "E' gia' presente un documento allegato al consenso. Il nuovo allegato sostituira' il precedente. Proseguire?",
        			            "cbkSi"	: function(){
			        	                		DOCUMENTI_ALLEGATI.allegaDocumento(resp.IDEN, file, nome, percorso, note);
			        	                		$.dialog.hide();
		        	                		}
        			        };
        				home.DIALOG.si_no(params);
                	}
                }else{
        			home.NOTIFICA.warning({
        				'title'		: "Attenzione",
        				'message'	: "Scegliere un file da allegare",
        				'timeout'	: 10
        			});
                }
			},

			showHide:function(id){

				switch(id){

					case 'butFile':
							WK_RICERCA_ANAGRAFICA.tipoCaricamento = 'file';
							$("#AllegaFile").show();
							$("#lblCmbScanner, #cmbScanner").hide();
							break;

					case 'butScanner':
							WK_RICERCA_ANAGRAFICA.tipoCaricamento = 'scanner';
							$("#AllegaFile").hide();
							$("#lblCmbScanner, #cmbScanner").show();
							break;

					default:
							break;
				}
			}
		},

		stampa:{

			vuoto:function(rec, key_legame){
            	home.NS_FENIX_PIC.print.stampa('1', null, null, key_legame, true);
			},

			datiAnagrafici:function(rec, key_legame){
				home.NS_FENIX_PIC.print.stampa("1", null, rec[0].IDEN_ANAGRAFICA, key_legame, false);
			},

			consensoCompleto:function(rec, key_legame){
				
				/* Ricerco il consenso del paziente selezionato */
				var resp = home.NS_FENIX_PIC.search.consensus(rec[0].IDEN_ANAGRAFICA, key_legame);
				
                if (resp === '') {

                    var $fr = $("<form>").attr("id","noConsensoSaved");
			        $fr.append("<label style='display:block; text-align:center'>" + "Nessun consenso salvato per il paziente selezionato!" + "</label>");
			    	$.dialog($fr,{"width":"400px",
			            "title":'ATTENZIONE',
			            "buttons": [
			                {"label": "OK", "action": function ()
				                {
				                    $.dialog.hide();
				                }
				            }
			            ]
			        });

                } else {

                    if(key_legame === 'CONSENSO_UNICO' && !NS_FUNCTIONS.checkvalueConsensoUnico(rec[0].IDEN_ANAGRAFICA)){
                        /*** NON SERVE FARE NULLA ***/
                        return;
                    }
                	home.NS_FENIX_PIC.print.stampa("1", resp.IDEN, null, key_legame, false);
                }
			}
		},

		versioniConsenso:function(rec){

            var url = 'page?KEY_LEGAME=' 	+ 'VERSIONI_CONSENSO_UNICO';
            url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
            url += '&PATIENT_ID=' 			+ rec[0].IDEN_ANAGRAFICA;
            url += '&LOGOUT_ON_CLOSE=N';

            home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
		},

		visualizzaConsenso:function(rec, tipo_consenso){

			/* Ricerco il consenso del paziente selezionato */
            var resp = home.NS_FENIX_PIC.search.consensus(rec[0].IDEN_ANAGRAFICA, tipo_consenso);

            if (resp === '') {

                var $fr = $("<form>").attr("id","noConsensoSaved");
		        $fr.append("<label style='display:block; text-align:center'>" + "Nessun consenso salvato per il paziente selezionato!" + "</label>");
		    	$.dialog($fr,{"width":"400px",
		            "title":'ATTENZIONE',
		            "buttons": [
		                {"label": "OK", "action": function ()
			                {

		                	 	home.NS_FENIX_PIC.print.preview("1", null, rec[0].IDEN_ANAGRAFICA, tipo_consenso, null);
			                    $.dialog.hide();
			                }
			            }
		            ]
		        });

            } else {
        	 	home.NS_FENIX_PIC.print.preview("1", resp.IDEN, null, tipo_consenso, null);
            }
		}
};


var DOCUMENTI_ALLEGATI = {

	extensions: 	[ 'pdf', 'xls', 'xlsx', 'png', 'jpeg', 'jpg', 'gif', 'doc', 'bmp', 'docx', 'avi', 'txt' ],
//	fileServerPath: 'DocumentoAllegato',
	fileServerPath: 'DocumentoAllegato;jsessionid=' + home.$("#AppStampa param[name=session_id]").val(),

	init: function() {

		DOCUMENTI_ALLEGATI.file			= $('#AllegaFile');
		DOCUMENTI_ALLEGATI.nomeAllegato	= $('#txtNomeAllegato');
		DOCUMENTI_ALLEGATI.comboScanner = $("#cmbScanner");

		DOCUMENTI_ALLEGATI.setEvents();
	},

	setEvents: function() {

		DOCUMENTI_ALLEGATI.file.on('change', function() {
			DOCUMENTI_ALLEGATI.nomeAllegato.val( ( $(this).val().split('\\') )[ $(this).val().split('\\').length - 1 ].toString() );
		});
		/*if (DOCUMENTI_ALLEGATI.comboScanner.find("option").length === 0) {

			var scanner = JSON.parse(home.AppStampa.getScannerList(DOCUMENTI_ALLEGATI.scannerDllPath))["scanners"];
			var s;
			for (s=0; s < scanner.length; s++) {
				var selected = '';
				//var selected = localStorage["fenixMMG_SCANNER"] == scanner[s] ? " selected='selected'" : "";
				$("<option" + selected + ">" + scanner[s] + "</option>").appendTo(DOCUMENTI_ALLEGATI.comboScanner);
			}
			if (s===0) {
				home.NOTIFICA.warning({
					message: 'Nessuno scanner rilevato',
					title: 'Attenzione'
				});
				//$("#radTipoCaricamentoFile_daFile").trigger("click");
			}
		}*/
	},

	allegaDocumento: function(iden_consenso, file_allegato, nome_allegato, percorso_allegato, note_allegato){
		/*** funzione cui viene passato l'iden del consenso cui allegare il documento selezionato ***/
		/*** chiamo la procedura SP_ALLEGA_CONSENSO ***/

		$.support.cors = true;

		var obj =  { 'enctype' : 'multipart/form-data', 'action' : DOCUMENTI_ALLEGATI.getActionForm(iden_consenso, file_allegato, nome_allegato, percorso_allegato, note_allegato), 'method' : 'POST'};

		$('form#AllegaDOC').attr( obj );

		$('form#AllegaDOC').ajaxForm({
			url:			DOCUMENTI_ALLEGATI.fileServerPath,
			crossDomain:	true ,
			dataType:		'json',
			type:			'POST'
		}).ajaxSubmit({
			 success : function( response ) {
				 var status = response.split('$')[0];
				 var message = response.split('$')[1];

				 if( status.indexOf('OK') >= 0 )  {
					 home.NOTIFICA.success({ 'title': 'Successo', 'message': "File allegato con successo" });
					 /*** Se mi trovo nella pagina dello storico dei consensi refresho la wk ***/
					 if ($('#wkVersioniConsensoUnico').is(':visible')){
						 CONSENSO_UNICO.objWk.refresh();
					 }
					 
					 if(LIB.isValid(home.NS_GESTISCI_CONSENSI)){
				        	home.NS_GESTISCI_CONSENSI.getConsensiEsistenti();
				     }
				 } else {
					 home.NOTIFICA.error({ 'title': 'Errore', 'message': message });
				 }

			  },
			  error: function( response ) {
				  home.NOTIFICA.error({ 'title': 'Errore', 'message': response });
			  }
		});
	},

	beforeSave : function(){

			if(!DOCUMENTI_ALLEGATI.daScanner() && DOCUMENTI_ALLEGATI.checkExtension( $('#AllegaFile').val() ) === -1 ) {
				home.NOTIFICA.warning({
					message: 'L\'estensione del file che si sta tentando di caricare non e\' supportata! <br>Le estensioni ammesse sono:<br> ' + DOCUMENTI_ALLEGATI.extensions.join(', '),
					title: 'Attenzione'
				});

				return false;
			} else {
				$('input#IDEN_ANAG').clone().appendTo('form#dati');
				return true;
			}
	},

	checkExtension : function( file ){
		var ext		 = file.split('.');
		ext			 = ext[ ext.length -1 ].toString().toLowerCase();
		return $.inArray( ext, this.extensions );
	},

	daScanner: function() {
		return WK_RICERCA_ANAGRAFICA.tipoCaricamento === "scanner";
	},

	save : function() {
		if (DOCUMENTI_ALLEGATI.daScanner()) {
			DOCUMENTI_ALLEGATI.saveFileScanner();
		} else {
			DOCUMENTI_ALLEGATI.saveFile();
		}
	},

	getDescrizioneFileScanner: function() {
		return "Scansione-" + moment().format("YYYY-MM-DD_HHmm");
	},

	scannerFormat: "jpg",

	scannerDllPath: "${APPDATA}/fenix/AspriseJTwain.dll",

	saveFileScanner: function() {

		if (DOCUMENTI_ALLEGATI.nomeAllegato.val().trim().length === 0) {
			DOCUMENTI_ALLEGATI.nomeAllegato.val(DOCUMENTI_ALLEGATI.getDescrizioneFileScanner());
		}

		var scanner_selezionato = DOCUMENTI_ALLEGATI.comboScanner.val();
		//localStorage["fenixMMG_SCANNER"]=scanner_selezionato;
		var response = home.AppStampa.scanGeneric(
				scanner_selezionato,
				DOCUMENTI_ALLEGATI.scannerDllPath,
				home.NS_FENIX_TOP.getAbsolutePathServer() + DOCUMENTI_ALLEGATI.getActionForm(),
				"{'fileParameterName':'file'}",
				'{"methodsSource":[' +
					'{"setAutoScan": [true]},' +
					'{"setAutoFeed": [true]},' +
					'{"setUIEnabled": [false]},' +
					'{"setAuthor": [' + home.baseUser.USERNAME + ']},' +
					'{"setXResolution": [150.0]},' +
					'{"setYResolution": [150.0]}' +
				'],' +
				'"output":"' + DOCUMENTI_ALLEGATI.scannerFormat + '"},' +
				'"methodsImageWriteParam":{"setCompressionMode":[2]},' +
				'{"setCompressionQuality":[0.8f]}'
		); /*setCompression: 6 JPEG, 9 PNG */

		var status = response.split('$')[0];
		var message = response.split('$')[1];
		if (status === "OK") {
			home.NOTIFICA.success({ 'title': 'Successo', 'message': traduzione.fileCaricato });
		} else {
			home.NOTIFICA.error({ 'title': 'Errore', 'message': message });
		}
	},

	getActionForm: function(iden_consenso, file_allegato, nome_allegato, percorso_allegato, note_allegato) {

		var url	= DOCUMENTI_ALLEGATI.fileServerPath + '?';

		var mimetype;

		if (DOCUMENTI_ALLEGATI.daScanner()) {
			mimetype = LIB.getMymeType(DOCUMENTI_ALLEGATI.scannerFormat);
		} else {
			var nome_file = $('#AllegaFile').val();
			mimetype = LIB.getMymeType( ( nome_file.split('.') )[ nome_file.split('.').length -1 ].toString().toLowerCase() );
		}

		url += '&IDEN_CONSENSO='		+ iden_consenso;
		url += '&MIME_TYPE=' 			+ mimetype;
		url += '&PERCORSO_ALLEGATO='	+ encodeURIComponent(percorso_allegato);
		url += '&IDEN_PER='				+ home.baseUser.IDEN_PER;
		url += '&NOME_FILE_ALLEGATO='	+ encodeURIComponent(nome_allegato);
		url += '&NOTE_ALLEGATO=' 		+ encodeURIComponent(note_allegato);

		return url;
	}
};
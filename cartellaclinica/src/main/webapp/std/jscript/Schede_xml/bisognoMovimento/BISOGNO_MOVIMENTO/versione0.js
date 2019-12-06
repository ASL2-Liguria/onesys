var WindowCartella = null;

$(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }


    if(document.EXTERN.KEY_LEGAME.value.match(/BISOGNO_MOVIMENTO.*/)){
		BISOGNI.disableStampa();
		BISOGNI.checkReadOnly();
		BISOGNO_MOVIMENTO.setEvents();
		BISOGNO_MOVIMENTO.init();
		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
	}

});

var BISOGNO_MOVIMENTO = {

		init : function(){

			$('label#lblLegendaBraden').css({"width":"1000px"});


			setRadioResettable('BISOGNO_MOVIMENTO',[
			                                        {radio:"chkAllettato"},
			                                        {radio:"chkLimitazione"},
			                                        {radio:"chkLesioni"}
			                                        ]);

			BISOGNI.caricaWkObiettivi('BISOGNO_MOVIMENTO');
			BISOGNO_MOVIMENTO.caricaWkProcedure();
			BISOGNO_MOVIMENTO.gestOpzioni.CamminaAiuto();
			BISOGNO_MOVIMENTO.gestOpzioni.CamminaAusili();
			BISOGNO_MOVIMENTO.gestOpzioni.SpostAiuto();
			BISOGNO_MOVIMENTO.gestOpzioni.SpostAusili();
			BISOGNI.input.setDisables('BISOGNO_MOVIMENTO',["txtEsitoBraden","txtDataBraden"],true);

			BISOGNI.initChkPrincipale("BISOGNO_MOVIMENTO");
            $('#lblAttivita').click(function(){BISOGNO_MOVIMENTO.inserisciAttivita()});
       },

		setEvents : function(){

			$('form[name="BISOGNO_MOVIMENTO"] input[name="chkCamAiuto"]').click(BISOGNO_MOVIMENTO.gestOpzioni.CamminaAiuto);	
			$('form[name="BISOGNO_MOVIMENTO"] input[name="chkCamAusili"]').click(BISOGNO_MOVIMENTO.gestOpzioni.CamminaAusili);	
			$('form[name="BISOGNO_MOVIMENTO"] input[name="chkSpostAiuto"]').click(BISOGNO_MOVIMENTO.gestOpzioni.SpostAiuto);	
			$('form[name="BISOGNO_MOVIMENTO"] input[name="chkSpostAusili"]').click(BISOGNO_MOVIMENTO.gestOpzioni.SpostAusili);	

			$('form[name="BISOGNO_MOVIMENTO"] label#lblBraden').click(BISOGNO_MOVIMENTO.apriBraden);
			
			//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
			$('form[name="BISOGNO_MOVIMENTO"]').click(function(){
				$(this).attr("edited","edited");			
			});					
		},

		apriBraden : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_BRADEN&FUNZIONE=SCALA_BRADEN&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaBraden : function(){
            WindowCartella.stampaScalaBraden();
		},

        apriBarthel : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_BARTHEL&FUNZIONE=SCALA_BARTHEL&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaBarthel : function(){
            WindowCartella.stampaScalaBarthel();
		},
        
		apriBBS : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_BBS&FUNZIONE=SCALA_BBS&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaBBS : function(){
            WindowCartella.stampaScalaBSS();
		},  
        
		apriDGI : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_DGI&FUNZIONE=SCALA_DGI&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
        
		stampaDGI : function(){
            WindowCartella.stampaScalaDGI();
		}, 
        
		apriTIS : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_TIS&FUNZIONE=SCALA_TIS&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaTIS : function(){
            WindowCartella.stampaScalaTIS();
		}, 
        
		apriFM : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_FM&FUNZIONE=SCALA_FM&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaFM : function(){
            WindowCartella.stampaScalaFM();
		}, 
        
		apriHPT : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_HPT&FUNZIONE=SCALA_HPT&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaHPT : function(){
            WindowCartella.stampaScalaHPT();
		},   
        
		apriFAC : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_FAC&FUNZIONE=SCALA_FAC&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaFAC : function(){
            WindowCartella.stampaScalaFAC();
		},
        
		apriTUG : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_TUG&FUNZIONE=SCALA_TUG&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampaTUG : function(){
            WindowCartella.stampaScalaTUG();
		}, 
        
		apri10MWT : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_10MWT&FUNZIONE=SCALA_10MWT&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampa10MWT : function(){
            WindowCartella.stampaScala10MWT();
		}, 
        
		apri6MWT : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_6MWT&FUNZIONE=SCALA_6MWT&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		stampa6MWT : function(){
            WindowCartella.stampaScala6MWT();
		},         
		
		gestOpzioni:{

			CamminaAiuto : function (){
				BISOGNI.gestOpzioni.set("BISOGNO_MOVIMENTO","chkCamAiuto","",
						["lblAccompagna1","lblAccompagna2"],
						["chkAccompagna1","chkAccompagna2"]);
			},

			CamminaAusili : function (){
				BISOGNI.gestOpzioni.set("BISOGNO_MOVIMENTO","chkCamAusili","",
						["lblCollare","lblBusto","lblBastone","lblTrepiedi","lblGirello","lblTavoletta","lblSollevatore","lblPancera","lblCalze","lblCarrozzina"],
						["chkCollare","chkBusto","chkBastone","chkTrepiedi","chkGirello","chkTavoletta","chkSollevatore","chkPancera","chkCalze","chkCarrozzina"]);
			},

			SpostAiuto : function (){
				BISOGNI.gestOpzioni.set("BISOGNO_MOVIMENTO","chkSpostAiuto","",
						["lblSpostAccompagna1","lblSpostAccompagna2"],
						["chkSpostAccompagna1","chkSpostAccompagna2"]);
			},		

			SpostAusili : function (){
				BISOGNI.gestOpzioni.set("BISOGNO_MOVIMENTO","chkSpostAusili","",
						["lblSpostCollare","lblSpostBusto","lblSpostBastone","lblSpostTrepiedi","lblSpostGirello","lblSpostTavoletta","lblSpostSollevatore","lblSpostPancera","lblSpostCalze","lblSpostCarrozzina"],
						["chkSpostCollare","chkSpostBusto","chkSpostBastone","chkSpostTrepiedi","chkSpostGirello","chkSpostTavoletta","chkSpostSollevatore","chkSpostPancera","chkSpostCalze","chkSpostCarrozzina"]);
			}				
		},

		caricaWkProcedure : function(){	
			var _frame = $('form[name="BISOGNO_MOVIMENTO"] iframe#idWkProcedure');

			if(_frame.length>0){
                            var url = "WorklistEngine?template=HTML.ftl&statement=WK_PROCEDURE_INSERITE&bind={\"list\":["+ document.EXTERN.IDEN_VISITA.value +",\"PT_LESDECUBITO\",\"Prima\"]}&array=IDEN_PROCEDURA,array_iden_procedure";
//                            var url = "servletGenerator?KEY_LEGAME=WK_PROCEDURE_INSERITE&WHERE_WK=where iden_visita = " 
//					+ document.EXTERN.IDEN_VISITA.value + " AND KEY_LEGAME =&#39PT_LESDECUBITO&#39 AND INSORGENZA = &#39Prima&#39";
//				if(WindowCartella.ModalitaCartella.isReadonly(document))
//					url+="&CONTEXT_MENU=WK_PROCEDURE_INSERITE_LETTURA";			

				_frame[0].contentWindow.location.replace(url);
			}
		},
		
		checkPreSalvataggio :function(){
			
			if($("#oTable", $('form[name="BISOGNO_MOVIMENTO"] #idWkProcedure').contents())[0].rows.length==0 && $('form[name="BISOGNO_MOVIMENTO"] input[name="chkLesioni"]:checked').index('form[name="BISOGNO_MOVIMENTO"] input[name="chkLesioni"]')==1){
			 	return{status:false,message:"Attenzione, inserire le lesioni da decubito presenti"};
			}
			else if($("#oTable", $('form[name="BISOGNO_MOVIMENTO"] #idWkProcedure').contents())[0].rows.length>0 && $('form[name="BISOGNO_MOVIMENTO"] input[name="chkLesioni"]:checked').index('form[name="BISOGNO_MOVIMENTO"] input[name="chkLesioni"]')==0){
				return{status:false,message:"Attenzione, selezionato 'Lesioni presenti: nessuna' ma ci sono lesioni nella worklist dedicata."};
			}
			return {status:true};			
		},
        
        inserisciAttivita:function(){
            var pBinds = new Array();
            pBinds.push($('#FUNZIONE').val());
            var rs = WindowCartella.executeQuery('bisogni.xml','returnIdenBisogno',pBinds);
            while (rs.next()) {
                var url = "servletGeneric?class=cartellaclinica.pianoGiornaliero.pianificaAttivita";
                url+= typeof $('#FUNZIONE').val()=='undefined'?"":"&iden_bisogno_selezionato=" + rs.getString("iden");
                url+= "&cod_cdc=" + WindowCartella.getForm().reparto;
                $.fancybox({
                    'padding' : 3,
                    'width' : 800,
                    'height' : 540,
                    'href' : url,
                    'type' : 'iframe'
                });
            }
        }

};
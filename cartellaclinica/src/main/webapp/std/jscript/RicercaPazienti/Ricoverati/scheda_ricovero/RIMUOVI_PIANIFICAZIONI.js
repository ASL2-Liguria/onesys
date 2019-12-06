$(document).ready(function(){	
	RIMUOVI_PIANIFICAZIONI.init();
	RIMUOVI_PIANIFICAZIONI.setEvents();
});


var RIMUOVI_PIANIFICAZIONI = {
	
	iden_anag:null,	
	iden_ricovero:null,
	reparto:null,
	
	init:function(){
		RIMUOVI_PIANIFICAZIONI.iden_anag = document.EXTERN.IDEN_ANAG.value;
		RIMUOVI_PIANIFICAZIONI.iden_ricovero = document.EXTERN.IDEN_RICOVERO.value;
		RIMUOVI_PIANIFICAZIONI.reparto = document.EXTERN.COD_CDC.value;		

		$('div#groupWk table').remove();
		eval('var Configurazioni =' + top.baseReparti.getValue(RIMUOVI_PIANIFICAZIONI.reparto,"RIMOZIONE_PIANIFICAZIONI"));

		for (var i in Configurazioni){
			if(typeof Configurazioni[i]!='undefined' && Configurazioni[i]){
				switch(i){
					case 'APPUNTAMENTI':	RIMUOVI_PIANIFICAZIONI.loadWkAppuntamenti();
						break;
					case 'RICHIESTE':		RIMUOVI_PIANIFICAZIONI.loadWkRichieste();
						break;
                    case 'ACCESSI'  :     RIMUOVI_PIANIFICAZIONI.loadWkAccessi();
                        break;
					default:
						break;									
				}
			}
		}
	},
	
	setEvents:function(){
		$('#lblRimuovi').click(RIMUOVI_PIANIFICAZIONI.rimuovi);
	},
	
	rimuovi:function(){
		
		var Parametri = {
			iden_appuntamenti:[],
			iden_richieste:[],
            iden_accesso:[]
		};
		
		$('iframe').each(function(){
			var _frame = this;		
			$('table#oTable tr',this.contentWindow.document).each(function(idx){
				
				if($(this).hasClass("sel")){
					switch(_frame.id){	
						case 'frmAppuntamenti':	Parametri.iden_appuntamenti.push(_frame.contentWindow.array_iden[idx]);
							break;
						case 'frmRichieste':	Parametri.iden_richieste.push(_frame.contentWindow.array_iden[idx])
							break;
                        case 'frmAccessi':  Parametri.iden_accesso.push(_frame.contentWindow.array_iden[idx])
						default:
							break;														
					}
				}
			});
			
			
		});

        if(Parametri.iden_appuntamenti != null){
            var vRespAppuntamenti = top.executeStatement("DatiPrecedenti.xml","rimuoviAppuntamento",[RIMUOVI_PIANIFICAZIONI.iden_ricovero,''+Parametri.iden_appuntamenti+'']);
            gestException(vRespAppuntamenti);
        }
        if(Parametri.iden_richieste != null){
            var vRepRichieste = top.executeStatement("DatiPrecedenti.xml","rimuoviRichieste",[RIMUOVI_PIANIFICAZIONI.iden_ricovero,''+Parametri.iden_richieste+'',parent.top.baseUser.IDEN_PER]);
            gestException(vRepRichieste);
        }
        if(Parametri.iden_accesso != null){
            var vRepAccessi = top.executeStatement("DatiPrecedenti.xml","rimuoviAccesso",[RIMUOVI_PIANIFICAZIONI.iden_ricovero,''+Parametri.iden_accesso+'',parent.top.baseUser.IDEN_PER]);
            gestException(vRepAccessi);
        }

        function gestException(vResponse){
            if (vResponse[0]=='KO'){
                return alert(vResponse[0] +'\n'+ vResponse[1]);
            }
        }

        RIMUOVI_PIANIFICAZIONI.chiudi();
	},
	
	chiudi:function(){
		parent.$.fancybox.close();
	},
	
	loadWkAppuntamenti:function(){

		RIMUOVI_PIANIFICAZIONI.createFieldSet('Appuntamenti','Appuntamenti','ALL');

		$('#frmAppuntamenti')[0].src = RIMUOVI_PIANIFICAZIONI.getUrlWk(
			"WK_APPUNTAMENTI_FUTURI",
			" where IDEN_RICOVERO="+RIMUOVI_PIANIFICAZIONI.iden_ricovero,
			true);		
	},	
	
	loadWkRichieste:function(){

		RIMUOVI_PIANIFICAZIONI.createFieldSet('Richieste','Richieste','ALL');

		$('#frmRichieste')[0].src = RIMUOVI_PIANIFICAZIONI.getUrlWk(
			"WK_RICHIESTE_FUTURE",
			" where IDEN_RICOVERO="+RIMUOVI_PIANIFICAZIONI.iden_ricovero,
			true);	
	},
    loadWkAccessi:function(){

        RIMUOVI_PIANIFICAZIONI.createFieldSet('Accessi','Accessi','ALL');

        $('#frmAccessi')[0].src = RIMUOVI_PIANIFICAZIONI.getUrlWk(
            "WK_ACCESSI_FUTURI",
            " where IDEN_RICOVERO="+RIMUOVI_PIANIFICAZIONI.iden_ricovero,
            true);
    },
	
	getUrlWk:function(pTipoWk,pWhereWk,pIlluminaMultiplo){
		var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK="+pTipoWk+"&WHERE_WK="+pWhereWk;
		url += "&ILLUMINA="+(pIlluminaMultiplo?"illumina_multiplo(this.sectionRowIndex,0);":"illuminaSelDesel(this.sectionRowIndex);");
		return url;
	},
	
	createFieldSet:function(pId,pLegend,pSelezioneDefault){		
		if($('#frm'+pId).length>0)return; 
		var vFS = $('<fieldset id="'+pId+'"></fieldset>')
					.append($('<legend>'+pLegend+'</legend>'))
					.append($('<iframe id="frm'+pId+'" width="100%"></iframe>').load(function(){RIMUOVI_PIANIFICAZIONI.initFrame(this,pSelezioneDefault);}));					

		$('div#groupWk').append(vFS);

	},
	
	initFrame:function(pFrame,pSelezioneDefault){
		$(pFrame).height($('form',pFrame.contentWindow.document).height()+5);

		switch (pSelezioneDefault){
			case 'ALL': //pre seleziona tutto
				$('table#oTable tr',pFrame.contentWindow.document).addClass("sel");
				break;
			case 'UNIQUE': //pre seleziona solo se dato unico
				var vTRs = $('table#oTable tr',pFrame.contentWindow.document);
				if(vTRs.length==1)
					vTRs.addClass("sel");
				break;
			default:
				break;
		}
	}
};
$(document).ready(function(){	
	ASSOCIA_PRECEDENTI.init();
	ASSOCIA_PRECEDENTI.setEvents();
});


var ASSOCIA_PRECEDENTI = {
	
	iden_anag:null,	
	iden_ricovero:null,
	data_ricovero:null,
	reparto:null,
	tipo_ricovero:null,
	
	init:function(){
		ASSOCIA_PRECEDENTI.iden_anag = document.EXTERN.IDEN_ANAG.value;
		ASSOCIA_PRECEDENTI.iden_ricovero = document.EXTERN.IDEN_RICOVERO.value;
		ASSOCIA_PRECEDENTI.data_ricovero = document.EXTERN.DATA_RICOVERO.value;
		ASSOCIA_PRECEDENTI.reparto = document.EXTERN.COD_CDC.value;
		ASSOCIA_PRECEDENTI.tipo_ricovero = document.EXTERN.TIPO_RICOVERO.value;

		$('div#groupWk table').remove();
		eval('var Configurazioni =' + top.baseReparti.getValue(ASSOCIA_PRECEDENTI.reparto,"ASSOCIAZIONE_PREGRESSO"));

		for (var i in Configurazioni){
			if(typeof Configurazioni[i]!='undefined' && Configurazioni[i]){
				switch(i){
					case 'PRERICOVERI':		ASSOCIA_PRECEDENTI.loadWkPrericoveri();
						break;
					case 'APPUNTAMENTI':	ASSOCIA_PRECEDENTI.loadWkAppuntamenti();
						break;					
					case 'RICHIESTE':		ASSOCIA_PRECEDENTI.loadWkRichieste();
						break;
                    case 'ACCESSI' :        ASSOCIA_PRECEDENTI.loadWkAccessi();
                        break;
                    case 'OBI':				ASSOCIA_PRECEDENTI.loadWkObi();
                        break;
					default:
						break;									
				}
			}
		}
	},
	
	setEvents:function(){
		$('#lblAssocia').click(ASSOCIA_PRECEDENTI.associa);
	},
	
	associa:function(){
		
		var Parametri = {
			iden_prericovero:null,
			iden_appuntamenti:[],
			iden_richieste:[],
            iden_accesso:[],
            cod_cdc:null
		};
		
		$('iframe').each(function(){
			var _frame = this;		
			$('table#oTable tr',this.contentWindow.document).each(function(idx){
				
				if($(this).hasClass("sel")){
					switch(_frame.id){
						case 'frmPrericoveri' : Parametri.iden_prericovero=_frame.contentWindow.array_iden[idx];
												Parametri.cod_cdc=_frame.contentWindow.array_cod_cdc[idx];
							break;
						case 'frmAppuntamenti':	Parametri.iden_appuntamenti.push(_frame.contentWindow.array_iden[idx]);
							break;
						case 'frmRichieste'   :	Parametri.iden_richieste.push(_frame.contentWindow.array_iden[idx]);
							break;
                        case 'frmAccessi'     :	Parametri.iden_accesso.push(_frame.contentWindow.array_iden[idx]);
                            break;
                        case 'frmRicoveriOBI' :	Parametri.iden_prericovero=_frame.contentWindow.array_iden[idx];
                        break;
                            
                            
                        default:
							break;														
					}
				}
			});
			
		});

        //if (top.baseUser.LOGIN  == 'matteopi'){alert(Parametri.iden_appuntamenti +'\n' + ASSOCIA_PRECEDENTI.iden_ricovero+'\n \n'+ Parametri.iden_prericovero +'\n \n'+Parametri.iden_richieste)};

        if(Parametri.iden_appuntamenti != null && Parametri.iden_appuntamenti != '' ){
            var vRespAppuntamenti = top.executeStatement("DatiPrecedenti.xml","AssociaAppuntamenti",[ASSOCIA_PRECEDENTI.iden_ricovero,''+Parametri.iden_appuntamenti+'',top.baseUser.IDEN_PER]);
            gestException(vRespAppuntamenti);
        }
        if (Parametri.iden_prericovero!= null && Parametri.iden_prericovero!= ''){

        	if (Parametri.cod_cdc!=null && Parametri.cod_cdc!=ASSOCIA_PRECEDENTI.reparto){
        		if(!confirm('Attenzione: il pre-ricovero selezionato � di un reparto differente rispetto a quello del ricovero corrente. Continuare?')){
        			return;
        	}
        	}

            var vRepPrericoveri = top.executeStatement("DatiPrecedenti.xml","AssociaPrericovero",[ASSOCIA_PRECEDENTI.iden_ricovero, ''+Parametri.iden_prericovero+'',top.baseUser.IDEN_PER]);
            gestException(vRepPrericoveri);
        }
        if(Parametri.iden_richieste != null && Parametri.iden_richieste!= '' ){

            var vRepRichieste = top.executeStatement("DatiPrecedenti.xml","AssociaRichieste",[ASSOCIA_PRECEDENTI.iden_ricovero,''+Parametri.iden_richieste+'',top.baseUser.IDEN_PER]);
            gestException(vRepRichieste);
        }
//        if(Parametri.iden_accesso != null && Parametri.iden_accesso != ''){
//            var vRepAccessi = top.executeStatement("DatiPrecedenti.xml","AssociaAccesso",[ASSOCIA_PRECEDENTI.iden_ricovero,''+Parametri.iden_accesso+'',parent.top.baseUser.IDEN_PER]);
//            gestException(vRepAccessi);
//        }
           
        var vImportaSchede = top.executeStatement("DatiPrecedenti.xml", "getSchedePrericoveroDS", [document.EXTERN.IDEN_RICOVERO.value, 'QUESTIONARIO_ANAMNESTICO#ESAME_OBIETTIVO_DS', document.EXTERN.USER_ID.value, document.EXTERN.PC_ID.value, document.EXTERN.USER_LOGIN.value]);
        gestException(vImportaSchede);
        
        function gestException(vResponse){
            if (vResponse[0]=='KO'){
                return alert(vResponse[0] +'\n'+ vResponse[1]);
            }
        }


        if(typeof top.CartellaPaziente != 'undefined' && Parametri.iden_prericovero!=null){
            top.CartellaPaziente.getRicovero()["IDEN_PRERICOVERO"] = Parametri.iden_prericovero;
            top.DatiCartella.loadPrericovero(Parametri.iden_prericovero);
        }
        ASSOCIA_PRECEDENTI.chiudi();

	},
	
	chiudi:function(){
		parent.$.fancybox.close();
	},
	
	loadWkPrericoveri:function(){
		
		if(document.EXTERN.IDEN_PRERICOVERO.value != '')return;//già associato
		
		ASSOCIA_PRECEDENTI.createFieldSet('Prericoveri','Prericoveri','UNIQUE');
		
		$('#frmPrericoveri')[0].src = ASSOCIA_PRECEDENTI.getUrlWk(
			"WK_PRERICOVERI",
			" where IDEN_ANAG="+ASSOCIA_PRECEDENTI.iden_anag + " and IDEN_VISITA<>"+ASSOCIA_PRECEDENTI.iden_ricovero + " and cod_cdc=(select cod_cdc from nosologici_paziente where iden="+ASSOCIA_PRECEDENTI.iden_ricovero+") and DATA_RICOVERO_FILTRO<='" + ASSOCIA_PRECEDENTI.data_ricovero + "' AND CODICE  IN ('PRE','PRE-DS','PRE-DH','PRE-VPO') ",
			false
		);
	},
	
	loadWkObi:function(){
		
		if(document.EXTERN.IDEN_PRERICOVERO.value != '')return;//già associato
		
		ASSOCIA_PRECEDENTI.createFieldSet('RicoveriOBI','Ricoveri OBI','UNIQUE');
		
		$('#frmRicoveriOBI')[0].src = ASSOCIA_PRECEDENTI.getUrlWk(
			"WK_PRERICOVERI",
			" where IDEN_ANAG="+ASSOCIA_PRECEDENTI.iden_anag + " and IDEN_VISITA<>"+ASSOCIA_PRECEDENTI.iden_ricovero + " and DATA_RICOVERO_FILTRO<='" + ASSOCIA_PRECEDENTI.data_ricovero + "' and DATA_RICOVERO_FILTRO>='" + ASSOCIA_PRECEDENTI.data_ricovero + "'-1 and CODICE='OBI' ",
			false
		);
	},
	
	loadWkAppuntamenti:function(){

		ASSOCIA_PRECEDENTI.createFieldSet('Appuntamenti','Appuntamenti','ALL');

		$('#frmAppuntamenti')[0].src = ASSOCIA_PRECEDENTI.getUrlWk(
			"WK_APPUNTAMENTI_PRECEDENTI",
			" where IDEN_RICOVERO="+ASSOCIA_PRECEDENTI.iden_ricovero + " AND (COD_CDC = '"+ASSOCIA_PRECEDENTI.reparto+"' or COD_SPECIALITA=(select cod_specialita from view_cdc_specialita where cod_cdc='"+ASSOCIA_PRECEDENTI.reparto+"'))",
			true);		
	},
	
	loadWkRichieste:function(){

		ASSOCIA_PRECEDENTI.createFieldSet('Richieste','Richieste','ALL');

		$('#frmRichieste')[0].src = ASSOCIA_PRECEDENTI.getUrlWk(
			"WK_RICHIESTE_PRECEDENTI",
			" where IDEN_RICOVERO="+ASSOCIA_PRECEDENTI.iden_ricovero+" and CODICE in ('DH','PRE-DH')  and (COD_CDC = '"+ASSOCIA_PRECEDENTI.reparto+"' or COD_SPECIALITA=(select cod_specialita from view_cdc_specialita where cod_cdc='"+ASSOCIA_PRECEDENTI.reparto+"'))",
			true);	
	},
    loadWkAccessi :function(){

        ASSOCIA_PRECEDENTI.createFieldSet('Accessi','Accessi','ALL');

		var where_condition = " where IDEN_RICOVERO="+ASSOCIA_PRECEDENTI.iden_ricovero+" and (COD_CDC = '"+ASSOCIA_PRECEDENTI.reparto+"' or COD_SPECIALITA=(select cod_specialita from view_cdc_specialita where cod_cdc='"+ASSOCIA_PRECEDENTI.reparto+"'))";

		switch (ASSOCIA_PRECEDENTI.tipo_ricovero){
			case 'DH':	where_condition += " and CODICE in ('DH','PRE-DH')"
				break;
			default:
				break;
		}

        $('#frmAccessi')[0].src = ASSOCIA_PRECEDENTI.getUrlWk(
            "WK_ACCESSI_PRECEDENTI",
            where_condition,
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
					.append($('<iframe id="frm'+pId+'" width="100%"></iframe>').load(function(){ASSOCIA_PRECEDENTI.initFrame(this,pSelezioneDefault);}));					

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
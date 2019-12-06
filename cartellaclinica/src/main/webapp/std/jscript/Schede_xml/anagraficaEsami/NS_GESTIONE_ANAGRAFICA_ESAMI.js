/**
 * @author linob
 * @data 11-02-2015
 * @page filtro wk anagrafica degli esami
 *	
CODIFICA TIPOLOGIA_RICHIESTE 
0	-> LABORATORIO
1	-> RADIOLOGIA
2	-> MEDICINA NUCLEARE
3	-> MEDICINA NUCLEARE RIA
4	-> CARDIOLOGIA
5	-> CONSULENZE
9	-> AMBULATORIO
10	-> ENDOSCOPIA
12	-> ANATOMIA PATOLOGICA
13	-> MICROBIOLOGIA
 */

var WindowCartella = null;

jQuery(document).ready(function() {
	var topname = opener.top.window.name;
    window.WindowHome = window.opener;
    while (window.WindowHome.name != topname && window.WindowHome.parent != window.WindowHome) {
        window.WindowHome = window.WindowHome.parent;
    }
    window.baseReparti = WindowHome.baseReparti;
    window.baseGlobal = WindowHome.baseGlobal;
    window.basePC = WindowHome.basePC;
    window.baseUser = WindowHome.baseUser;

    try {
    	WindowHome.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

    try {
    	NS_GESTIONE_ANAGRAFICA_ESAMI.init();
    	NS_GESTIONE_ANAGRAFICA_ESAMI.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }

});


var NS_GESTIONE_ANAGRAFICA_ESAMI = {
	operazione:'',
	iden:'',
	esame:'',
	_filtro_materiali_micro:'',
	arrMateriali:[],
	
    init: function() {
    	NS_GESTIONE_ANAGRAFICA_ESAMI.operazione = $('form[name="EXTERN"] input#operazione').val();
    	NS_GESTIONE_ANAGRAFICA_ESAMI.iden 		= $('form[name="EXTERN"] #iden').val();
    	
    	switch(NS_GESTIONE_ANAGRAFICA_ESAMI.operazione){
    	case 'MOD':
    		NS_GESTIONE_ANAGRAFICA_ESAMI.creaOggettoEsame();
    		NS_GESTIONE_ANAGRAFICA_ESAMI.caricaDati();
    		NS_GESTIONE_ANAGRAFICA_ESAMI.checkControlliCaricamento();
    		break;
    	case 'DEL':
    		NS_GESTIONE_ANAGRAFICA_ESAMI.creaOggettoEsame();
    		NS_GESTIONE_ANAGRAFICA_ESAMI.caricaDati();
    		NS_GESTIONE_ANAGRAFICA_ESAMI.checkControlliCaricamento();
    		break;
    	case 'INS':
    		break;
    	default:
    		break;
    	}
    },
    
    creaOggettoEsame:function(){
		NS_GESTIONE_ANAGRAFICA_ESAMI.esame = new esame(
        		$('form[name="EXTERN"] input#iden').val(),	
        		$('form[name="EXTERN"] input#cod_dec').val(),            	
        		$('form[name="EXTERN"] input#cod_esa').val(),            	
        		$('form[name="EXTERN"] input#metodica_radiologica').val(),
        		$('form[name="EXTERN"] input#tipologia_richiesta').val(),
        		$('form[name="EXTERN"] input#attivo').val(),
        		$('form[name="EXTERN"] input#cod_min').val(),
        		$('form[name="EXTERN"] input#descrizione').val(),
        		$('form[name="EXTERN"] input#parti_corpo').val(),
        		$('form[name="EXTERN"] input#desc_sirm').val()
        	);
    },

    checkControlliCaricamento:function(operazione){
    	switch(NS_GESTIONE_ANAGRAFICA_ESAMI.operazione){
    	case 'MOD':
    		/*Blocco la modifica sui campi per la gestione del cod_esa/cod_dec/scelta fra profilo/esame laboratorio*/
    		$('#txtCodiceEsameInterno').attr('disabled',true);
    		$('#txtCodiceEsame').attr('disabled',true);
    		$('#input[name=radProfiloEsame]').attr('disabled',true);    		
    		break;
    	case 'DEL':
			HideLayer('groupRadiologia');
			HideLayer('groupLaboratorio');
			HideLayer('groupMicrobiologia')
	    	$('#txtDescrizioneEsame').attr('disabled',true);
	    	$('#txtCodiceEsame').attr('disabled',true);
	    	$('#txtCodiceMinisteriale').attr('disabled',true);
	    	$('#txtCodiceEsameInterno').attr('disabled',true);
	    	$('#txtDescrizioneDatiStrutturati').attr('disabled',true);
	    	$('select[name=cmbTipologiaEsame]').attr('disabled',true);
	    	$('select[name=cmbMetodicaRadiologica]').attr('disabled',true);			
    		break;
    	case 'INS':
    		break;
    	default:
    		break;
    	}
    },
    
    caricaDati:function(){
    	$('#txtDescrizioneEsame').val(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getDescrizione());
    	$('#txtCodiceEsame').val(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getCodDec());
    	$('#txtCodiceMinisteriale').val(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getCodMin());
    	$('#txtCodiceEsameInterno').val(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getCodEsa());
    	
    	$('#txtDescrizioneDatiStrutturati').val(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getDescSirm());
    	$('select[name=cmbTipologiaEsame]').val(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getTipologiaRichiesta())
    	$('select[name=cmbMetodicaRadiologica]').val(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getMetodicaRadiologica())
    	$('input[name=radAttivo][value="' + NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getAttivo() + '"]').attr('checked', true);
    	if ((NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getTipologiaRichiesta()=='0') && NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getTipoEsameLabo()!=''){
        	$('input[name=radProfiloEsame][value="' + NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getTipoEsameLabo() + '"]').attr('checked', true);    		
    	}else{
        	$('input[name=radProfiloEsame]').attr('disabled', true);     		
    	}
    	
    	if (typeof (NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo())!='undefined'){
        	$('input#chkTesta').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getTesta());
        	$('input#chkCollo').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getCollo());
        	$('input#chkTorace').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getTorace());    	
        	$('input#chkAddomInf').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getAddome('INF'));    	
        	$('input#chkAddomSup').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getAddome('SUP'));
        	$('input#chkSpallaSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getSpalla('SX'));
        	$('input#chkSpallaDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getSpalla('DX'));
        	$('input#chkAvambraccioSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getAvambraccio('SX'));
        	$('input#chkAvambraccioDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getAvambraccio('DX'));
        	$('input#chkGomitoSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getGomito('SX'));    	
        	$('input#chkGomitoDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getGomito('DX'));    	
        	$('input#chkBraccioSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getBraccio('SX'));
        	$('input#chkBraccioDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getBraccio('DX'));
        	$('input#chkPolsoManoSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getPolso('SX'));
        	$('input#chkPolsoManoDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getPolso('DX'));
        	$('input#chkCosciaSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getCoscia('SX'));
        	$('input#chkCosciaDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getCoscia('DX'));    	
        	$('input#chkGinocchioSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getGinocchio('SX'));    	
        	$('input#chkGinocchioDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getGinocchio('DX'));
        	$('input#chkGambaSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getGamba('SX'));
        	$('input#chkGambaDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getGamba('DX'));
        	$('input#chkCavigliaPiedeSX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getCaviglia('SX'));
        	$('input#chkCavigliaPiedeDX').attr('checked',NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getPartiDelCorpo().getCaviglia('DX'));    		
    	}
    	
    	NS_GESTIONE_ANAGRAFICA_ESAMI.visualizzaSezioni(NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getTipologiaRichiesta());	
		$('input[name=radMicrobiologiaStruttura]').change(function(){
			var objFilter = {
				"iden" : NS_GESTIONE_ANAGRAFICA_ESAMI.esame.getIden(),
				"origine" : $('input[name=radMicrobiologiaStruttura]:checked').val()
			}
			NS_GESTIONE_ANAGRAFICA_ESAMI.caricaMaterialiAssociati(objFilter);

		});

	},
    
    setEvents: function() {	
         	
    	$('select[name=cmbTipologiaEsame]').change(function() {
			NS_GESTIONE_ANAGRAFICA_ESAMI.visualizzaSezioni($('select[name=cmbTipologiaEsame] option:selected').val());
		});


		
		
		$('#groupMicrobiologia').find('table').find('select[name=elencoMateriali]').css('width','300px');
		$('#groupMicrobiologia').find('table').find('select[name=elencoMaterialiScelti]').css('width','300px');		
		$('#groupMicrobiologia').find('table').find('select[name=elencoSedi]').css('width','300px');
		$('#groupMicrobiologia').find('table').find('select[name=elencoSediScelte]').css('width','300px');		
		
		/*Gestione scelta materiali di laboratorio per il caricamento delle sedi configurate*/
		$('div#groupMicrobiologia').find('table.classDataEntryTable').delegate("select[name=elencoMaterialiScelti]", "change", function() {
			var objFilter = {
				"iden" : $('select[name=elencoMaterialiScelti] option:selected').val(),
				"origine" : $('input[name=radMicrobiologiaStruttura]:checked').val()
			}
			NS_GESTIONE_ANAGRAFICA_ESAMI.caricaSediAssociate(objFilter);		
		});		
    	
    },
	
    salva:function(){
		var arMateriali = [];
		$('select[name=elencoMaterialiScelti] option').each(function(){
			arMateriali.push($(this).val());
		})
		$('#hMaterialiScelti').val(arMateriali.join(","));
		
    	var controllo = NS_GESTIONE_ANAGRAFICA_ESAMI.checkControlliSalvataggio(); 

    	if (controllo.check){
    		registra();
    	}else{
    		alert('Controllo PreSalvataggio: '+controllo.msg)
    	}
    	
	},
	checkControlliSalvataggio:function(){
		var pControllo=true;
		var pMessaggio='';
    	switch(NS_GESTIONE_ANAGRAFICA_ESAMI.operazione){
    	case 'MOD':
    		/*Blocco la modifica sui campi per la gestione del cod_esa/cod_dec/scelta fra profilo/esame laboratorio*/
    		break;
    	case 'DEL':
    		break;
    	case 'INS':
    		var pBinds = new Array();
    		pBinds.push($('#txtCodiceEsame').val());
    		var rs = WindowHome.executeQuery('gestioneAnagraficaEsami.xml','getCodDec',pBinds);
    		if (rs.next()){
    			if (typeof (rs.getString("iden"))!=='undefined' && rs.getString("iden")!==''){
    				pControllo=false;
    				pMessaggio='Codice Interno Duplicato: '+rs.getString("cod_dec")+'\nPer l\'esame '+rs.getString("descr")
    			}
    		}
        	if ($('select[name=cmbTipologiaEsame] option:selected').val()!='0' || $('select[name=cmbTipologiaEsame] option:selected').val()!='3'){
            	$('#txtCodiceEsameInterno').val($('#txtCodiceEsame').val());	
        	}

    		break;
    	default:
    		break;
    	}
    	
    	return {'check':pControllo,'msg':pMessaggio};
	},
	
	chiudi:function(){
		opener.parent.NS_FILTRO_ANAGRAFICA_ESAMI.applica_filtro();
		self.close();
	},
	
	caricaMaterialiAssociati:function(obj){
		var param = {
			"id"		: "elencoMaterialiScelti",	
			"valore"	: "MG.IDEN",
			"campo"  	: "MG.DESCR",
			"tabella"	: "RADSQL.COD_EST_TABELLA CET,RADSQL.MG_ART MG",
			"where"  	: "MG.IDEN = CET.CODICE and CET.ORIGINE = '"+obj.origine+"' and CET.IDEN_TABELLA = '"+obj.iden+"' and CET.TABELLA = 'TAB_ESA'",
			"order"	 	: "MG.DESCR ASC"			
		}

		NS_GESTIONE_ANAGRAFICA_ESAMI.generaFiltro(NS_GESTIONE_ANAGRAFICA_ESAMI._filtro_materiali_micro,param);
	},

	caricaSediAssociate:function(obj){
		var param = {
			"id"		: "elencoSediScelte",	
			"valore"	: "CET.CODICE",
			"campo"  	: "COR.DESCRIZIONE",
			"tabella"	: "RADSQL.LABO_SEDI_CORPO COR, RADSQL.COD_EST_TABELLA CET",
			"where"  	: "COR.IDEN = CET.CODICE and CET.ORIGINE = '"+obj.origine+"' and CET.IDEN_TABELLA ='"+obj.iden+"' and CET.TABELLA = 'MG_ART'",
			"order"	 	: "DESCRIZIONE ASC"			
		}

		NS_GESTIONE_ANAGRAFICA_ESAMI.generaFiltro(NS_GESTIONE_ANAGRAFICA_ESAMI._filtro_materiali_micro,param);		
	},

	
	generaFiltro:function(obj,param){
		obj = new FILTRO_QUERY(param["id"], null);
		obj.setEnableWait('S');
		obj.setValueFieldQuery(param["valore"]);
		obj.setDescrFieldQuery(param["campo"]);
		obj.setFromFieldQuery(param["tabella"]);
		obj.setWhereBaseQuery(param["where"]);
		obj.setOrderQuery(param["order"]);
		obj.searchListRefresh();		
	},
	
	visualizzaSezioni:function(valore){
		switch(valore){
			case '1':
			case '2':
				ShowLayer('groupRadiologia');
				HideLayer('groupLaboratorio');
				HideLayer('groupMicrobiologia');					
				break;
			case '0':
			case '3':
				ShowLayer('groupLaboratorio');
				HideLayer('groupRadiologia');
				HideLayer('groupMicrobiologia');
				break;
			case '13':
				ShowLayer('groupLaboratorio');
				HideLayer('groupRadiologia');
				ShowLayer('groupMicrobiologia');
				break;
			default:
				HideLayer('groupMicrobiologia');
				HideLayer('groupRadiologia');
				HideLayer('groupLaboratorio');
				break;
		}
	},
	
	aggiungiMateriale:function(){
		if ($('select[name=elencoMateriali] option:selected').length==0){
			return alert('Selezionare almeno un materiale da aggiungere');
		}
		
		NS_GESTIONE_ANAGRAFICA_ESAMI.aggiungi('elencoMateriali','elencoMaterialiScelti',false);
		
	},
	
	aggiungiSede:function(){
		if ($('select[name=elencoSedi] option:selected').length==0){
			return alert('Selezionare almeno una sede del corpo da aggiungere');
		}		

		NS_GESTIONE_ANAGRAFICA_ESAMI.aggiungi('elencoSedi','elencoSediScelte',false);
	},
	
	rimuoviMateriale:function(){
		if ($('select[name=elencoMaterialiScelti] option:selected').length==0){
			return alert('Selezionare almeno un materiale da rimuovere');
		}

		NS_GESTIONE_ANAGRAFICA_ESAMI.rimuovi('elencoMaterialiScelti');
	},
	
	rimuoviSede:function(){
		if ($('select[name=elencoSediScelte] option:selected').length==0){
			return alert('Selezionare almeno una sede da rimuovere');
		}		
		NS_GESTIONE_ANAGRAFICA_ESAMI.rimuovi('elencoSediScelte');
	},

	aggiungi:function(sorgente,destinatario,rimuoviDaSorgente){
		add_selected_elements( sorgente, destinatario,rimuoviDaSorgente)
	},
	
	rimuovi:function(contenitore){
		remove_elem_by_sel(contenitore);	
	},
	
	salvaSedeMateriale:function(){
		$('select[name=elencoMaterialiScelti] option:selected').each(function(indexMat,valueMat){
			var arSedi   = new Array();
			$('select[name=elencoMaterialiScelti] option:selected').each(function(indexSedi,valueSedi){
				arSedi.push(valueSedi);
			});
			
			var matEsame = new materiale(valueMat,arSedi);
			NS_GESTIONE_ANAGRAFICA_ESAMI.arrMateriali.push(matEsame);
		});
	},
	
	salvaMaterialiOnDB:function(){
		/*delete su cod_est_tabella*/
		for (var item in NS_GESTIONE_ANAGRAFICA_ESAMI.arrMateriali){
			var pBindsDel = new Array();
			pBindsDel.push(item.getIden());
			
			var resRep = WindowHome.executeStatement('gestioneAnagraficaEsami.xml','tab_esa.materiale-sede.delete',pBindsDel);
			if (resRep[0]=="OK"){
				alert("Esame "+item.getDescrEsa()+" inserito correttamente per il sito con urgenza " + item["urgenze_descr"][indexUrg]);
			} else{
				alert("Esame "+item.getDescrEsa()+" errore durante la fase di inserimento" + resRep[1]);
			}


			for (var key in item.getArraySedi()){
				var pBindsIns = new Array();
				pBindsIns.push(item.getIden());
				pBindsIns.push(item.getArraySedi()[key]);
				var resRep = WindowHome.executeStatement('gestioneAnagraficaEsami.xml','tab_esa.materiale-sede.insert',pBindsDel);
				if (resRep[0]=="OK"){
					alert("Esame "+item.getDescrEsa()+" inserito correttamente per il sito con urgenza " + item["urgenze_descr"][indexUrg]);
				} else{
					alert("Esame "+item.getDescrEsa()+" errore durante la fase di inserimento" + resRep[1]);
				}
				
			}
			
		}
		/*insert su cod_est_tabella*/
	}

};



var esame = function(iden,cod_dec,cod_esa,metodica_radiologica,tipologia_richiesta,attivo,cod_min,descrizione,corpo,desc_sirm) { 
	this._iden=iden;	
	this._cod_dec=cod_dec;
	this._cod_esa=cod_esa;
	this._metodica_radiologica=metodica_radiologica;
	this._tipologia_richiesta=tipologia_richiesta;
	this._attivo=attivo;
	this._cod_min=cod_min;
	this._tipoEsameLabo = tipologia_richiesta=='0'?cod_esa.substr(0, 1):'';
	this._descrizione =descrizione;
	if (corpo!=''){
		this._partiCorpo = new partiDelCorpo(corpo);		
	}
	this._desc_sirm = desc_sirm;

}
esame.prototype = {
	getIden:function(){
		return this._iden;
	},
	getCodDec:function(){
		return this._cod_dec;		
	},
	getCodEsa:function(){
		return this._cod_esa;		
	},
	getMetodicaRadiologica:function(){
		return this._metodica_radiologica;		
	},
	getTipologiaRichiesta:function(){
		return this._tipologia_richiesta;		
	},
	getAttivo:function(){
		return this._attivo;		
	},
	getCodMin:function(){
		return this._cod_min;		
	},
	getTipoEsameLabo:function(){
		return this._tipoEsameLabo;
	},
	getDescrizione:function(){
		return this._descrizione;
	},
	getPartiDelCorpo:function(){
		return this._partiCorpo;
	},
	getDescSirm:function(){
		return this._desc_sirm;
	}
}


var partiDelCorpo = function(corpo){
	this._testa = corpo.indexOf("A") > -1?true:false;
	this._collo = corpo.indexOf("B") > -1?true:false;
	this._torace = corpo.indexOf("C") > -1?true:false;
	this._add_inf = corpo.indexOf("D") > -1?true:false;
	this._add_sup = corpo.indexOf("E") > -1?true:false;
	this._spalla_dx = corpo.indexOf("F") > -1?true:false;
	this._spalla_sx = corpo.indexOf("G") > -1?true:false;
	this._avambr_dx = corpo.indexOf("H") > -1?true:false;
	this._avambr_sx = corpo.indexOf("I") > -1?true:false;
	this._gomito_dx = corpo.indexOf("L") > -1?true:false;
	this._gomito_sx = corpo.indexOf("M") > -1?true:false;
	this._braccio_dx = corpo.indexOf("N") > -1?true:false;
	this._braccio_sx = corpo.indexOf("O") > -1?true:false;
	this._polso_dx = corpo.indexOf("P") > -1?true:false;
	this._polso_sx = corpo.indexOf("Q") > -1?true:false;
	this._coscia_sx = corpo.indexOf("R") > -1?true:false;
	this._coscia_dx = corpo.indexOf("S") > -1?true:false;
	this._ginocc_dx = corpo.indexOf("T") > -1?true:false;
	this._ginocc_sx = corpo.indexOf("U") > -1?true:false;
	this._gamba_dx = corpo.indexOf("V") > -1?true:false;
	this._gamba_sx = corpo.indexOf("W") > -1?true:false;
	this._caviglia_dx = corpo.indexOf("X") > -1?true:false;
	this._caviglia_sx = corpo.indexOf("Y") > -1?true:false;
}
partiDelCorpo.prototype = {
	getTesta:function(){
		return this._testa;
	},
	getCollo:function(){
		return this._collo;		
	},
	getTorace:function(){
		return this._torace;				
	},
	getAddome:function(lato){
		return lato=='INF'?this._add_inf:this._add_sup;
	},
	getSpalla:function(lato){
		return lato=='SX'?this._spalla_sx:this._spalla_dx;		
	},
	getAvambraccio:function(lato){
		return lato=='SX'?this._avambr_sx:this._avambr_dx;	
	},
	getGomito:function(lato){
		return lato=='SX'?this._gomito_sx:this._gomito_dx;	
	},
	getBraccio:function(lato){
		return lato=='SX'?this._braccio_sx:this._braccio_dx;	
	},
	getPolso:function(lato){
		return lato=='SX'?this._polso_sx:this._polso_dx;	
	},
	getCoscia:function(lato){
		return lato=='SX'?this._coscia_sx:this._coscia_dx;	
	},
	getGinocchio:function(lato){
		return lato=='SX'?this._ginocc_sx:this._ginocc_dx;	
	},
	getGamba:function(lato){
		return lato=='SX'?this._gamba_sx:this._gamba_dx;	
	},
	getCaviglia:function(lato){
		return lato=='SX'?this._caviglia_sx:this._caviglia_dx;	
	}
};

var materiale = function(idenMateriale,arraySedi,origine) { 
	this._idenMateriale      = idenMateriale;	
	this._arraySedi = arraySedi;
	this._stringSedi = this._arraySedi.join(",");
	this._origine=origine;
}
materiale.prototype = {
	getIdenMateriale:function(){
		return this._iden;
	},
	
	getArraySedi:function(){
		return this._arraySedi;
	},
	
	getStringSedi:function(){
		return this._stringSedi;
	},
	
	getOrigine:function(){
		
	}
}

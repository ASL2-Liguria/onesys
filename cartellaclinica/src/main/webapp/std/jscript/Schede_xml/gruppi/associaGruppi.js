jQuery(document).ready(function(){
	ASSOCIA_GRUPPI.init();
	ASSOCIA_GRUPPI.setEvents();
	
});
var _filtro_list_elenco = null;


var ASSOCIA_GRUPPI = {
		
	init : function(){
		arAssociatiIniziali = null;
		idenGruppo = 	parent.config_gruppi.idenGruppo;
		idenMembro1=	parent.config_gruppi.idenMembro1;
		idenMembro2=	parent.config_gruppi.idenMembro2;
		tabellaMembro1=	parent.config_gruppi.tabellaMembro1;
		tabellaMembro2=	parent.config_gruppi.tabellaMembro2;
		tipoGruppoList=	parent.config_gruppi.tipoGruppoList;
		tipoGruppo=		parent.config_gruppi.tipoGruppo;
		ASSOCIA_GRUPPI.loadAssociati();
		ASSOCIA_GRUPPI.ricerca("", "", true);
		if (parent.config_gruppi.groupGruppi=="F") {
			$("div#groupGruppo").hide().prev().hide();
		} else {
			var groupFind = $("div#groupFind");
			groupFind.hide(); groupFind.next().hide();groupFind.prev().hide();
			$("a#lblNuovo").parent().hide();
			$("a#lblEdit").parent().hide();
			$("a#lblDelete").parent().hide();
		};
		$("input[name=dteInizio]").val(top.clsDate.getData(new Date(),'DD/MM/YYYY'));

		if (idenGruppo!=''){
			ASSOCIA_GRUPPI.loadGruppo(idenGruppo);
		}
		config_gruppi = parent.config_gruppi.inner_config;
		
	},
	setEvents: function() {
		
		document.getElementById("Elenco").ondblclick=function(){
			add_selected_elements('Elenco', 'Selezionate',true);sortSelect('Selezionate');
		};
		
		document.getElementById("Selezionate").ondblclick=function(){
			add_selected_elements( 'Selezionate', 'Elenco',true);sortSelect('Elenco');
		};
		
		$('#txtRicerca,#txtRicercaCodice').bind('keypress', function(e) {
	        if(e.keyCode==13){
	        	ASSOCIA_GRUPPI.ricerca(document.dati.txtRicerca.value,document.dati.txtRicercaCodice.value,false);
	        }
		});
		
	},
	ricerca: function(txtDescr,txtCodice,flgTutte){
		var arAssociati = new Array(); 
		$("select[name=Selezionate] option").each(function() {arAssociati.push($(this).val());});
		var profondita=2;
		var select = $("select[name=Elenco]");
		select.empty();
		var vRs = top.executeQuery("gruppi.xml","getGruppi",[idenMembro1,tabellaMembro1,tipoGruppoList,profondita,"%"+txtDescr+"%","%"+txtCodice+"%"]);
		while(vRs.next()) {
			var iden=vRs.getString("IDEN");
			if ($.inArray(iden,arAssociati)==-1) {
				var validita_fine=vRs.getString("VALIDITA_FINE");
				var descrizione = validita_fine==''?vRs.getString("DESCRIZIONE"):vRs.getString("DESCRIZIONE") + " (gruppo chiuso il "+validita_fine+")" ;
				select.append("<option value="+iden+">"
						+"["+vRs.getString("CODICE")+"] "
						+descrizione
						+"</option>");
			};
		}

	},
	loadAssociati: function(){
		arAssociatiIniziali = new Array();
		var select = $("select[name=Selezionate]");
		select.empty();
		var vRs = top.executeQuery("gruppi.xml","getGruppi",[idenMembro2,tabellaMembro2,tipoGruppoList,1,"%%","%%"]);
		while(vRs.next()) {
			var iden=vRs.getString("IDEN");
			arAssociatiIniziali.push(iden);
			select.append("<option value="+iden+">"
					+"["+vRs.getString("CODICE")+"] "
					+vRs.getString("DESCRIZIONE")
					+"</option>");
		}

		
	},
	loadGruppo : function(pIdenGruppo) {
		var vRs=top.executeQuery("gruppi.xml","getGruppoByIden",[pIdenGruppo]);
		if (vRs.next()) {
			$("input[name=txtCodice]").val(vRs.getString("CODICE"));
			$("textarea[name=txtareaDescrizione]").val(vRs.getString("DESCRIZIONE"));
			$("input[name=dteInizio]").val(vRs.getString("VALIDITA_INIZIO"));
			$("input[name=dteFine]").val(vRs.getString("VALIDITA_FINE"));
		}
	},
    action: function() {
        var pBinds = new Array();
        pBinds.push(idenMembro2);
   /*     if(WindowHome.home.checkPrivacy('GRUPPI_STUDIO')){
        var rs = top.executeQuery("consensi.xml", "getConsensoUnicoStudio", pBinds);
        if (rs.next()) {
            if (rs.getString("C1") == 0) {
                alert("ATTENZIONE: Il paziente non ha dato il consenso");
                return;
            }
        }
         else {
            alert("ATTENZIONE: Paziente non trovato");
            return;
        }	
       }    */
        
        try {
          
                    switch (parent.config_gruppi.action) {
                        case 'createGroup' :
                            ASSOCIA_GRUPPI.createGroup();
                            break;
                        case 'editGroup' :
                            ASSOCIA_GRUPPI.editGroup();
                            break;
                        case 'addTheseMembersToThatGroup' :
                            ASSOCIA_GRUPPI.addTheseMembersToThatGroup();
                            break;
                        case 'addThatMemberToTheseGroups' :
                            ASSOCIA_GRUPPI.addThatMemberToTheseGroups();
                    }
                
            ASSOCIA_GRUPPI.chiudiScheda();
        } catch (e) {
            alert(e);
            ASSOCIA_GRUPPI.init();
        }
    },
	editGroup : function() {
		var codice = $("input[name=txtCodice]").val();
		if (codice=='') {throw "Inserire un codice per il gruppo";}
		var descrizione=$("textarea[name=txtareaDescrizione]").val();
		if (descrizione=='') {throw "Inserire una descrizione per il gruppo";}
		var validita_inizio = $("input[name=dteInizio]").val();
		var validita_fine = $("input[name=dteFine]").val();
		if ($("select[name=Selezionate] option").length==0) {throw "Impossibile creare un gruppo senza associazioni";		}
		
		var resp = top.executeStatement("gruppi.xml","editGruppo",[codice,descrizione,tipoGruppo,validita_inizio,validita_fine,idenGruppo]);
		if (resp[0]=='OK') {
			ASSOCIA_GRUPPI.addTheseMembersToThatGroup();
		} else {
			throw resp[1];
		}
	},
	createGroup : function() { 
		var codice = $("input[name=txtCodice]").val();
		if (codice=='') {throw "Inserire un codice per il gruppo";}
		var descrizione=$("textarea[name=txtareaDescrizione]").val();
		if (descrizione=='') {throw "Inserire una descrizione per il gruppo";}
		var validita_inizio = $("input[name=dteInizio]").val();
		if ($("select[name=Selezionate] option").length==0) {throw "Impossibile creare un gruppo senza associazioni";		}

		var resp = top.executeStatement("gruppi.xml","createGruppo",[codice,descrizione,tipoGruppo,validita_inizio,baseUser.IDEN_PER],1);
		if (resp[0]=='OK') {
			idenGruppo = resp[2];
			ASSOCIA_GRUPPI.addTheseMembersToThatGroup();
		} else {
			throw resp[1];
		}
	},
	deleteGroup : function() {
		var group = $("select[name=Elenco] option:selected");
		if (group.length!=1){
			return alert("Selezionare un gruppo dall'elenco a sinistra");
		}
		if (!confirm("Si desidera procedere alla chiusura del gruppo?")) {return;}
		var resp = top.executeStatement("gruppi.xml","deleteGruppo",[group.val()]);
		if (resp[0]=='OK') {
			ASSOCIA_GRUPPI.ricerca(document.dati.txtRicerca.value,document.dati.txtRicercaCodice.value,false);
		} else {
			throw resp[1];
		}
	},
	getAddedAndRemovedOptions : function() {
		var arIniziali = arAssociatiIniziali.slice();
		var arFinali = new Array();
		$("select[name=Selezionate] option").each(function() {arFinali.push($(this).val());});
		
		for (var i = 0; i<arIniziali.length; i++) {
			for (var j = 0; j<arFinali.length; j++) {
				if (arIniziali[i]==arFinali[j]) {
					arIniziali.splice(i,1);
					arFinali.splice(j,1);
					j--; i--;	
				}
			}
		}
		return {
			"arAdded" : arFinali,
			"arRemoved" : arIniziali
		};
	},
	addTheseMembersToThatGroup : function() {
		
		var arAddAndRemove = ASSOCIA_GRUPPI.getAddedAndRemovedOptions();
		var arAdded=arAddAndRemove.arAdded;
		var arRemoved=arAddAndRemove.arRemoved;
		var busGruppiToAddStm = [];
		var busGruppiToRemoveStm = [];
		for (var i = 0; i<arAdded.length; i++) {
			busGruppiToAddStm.push([arAdded[i],tabellaMembro2,idenGruppo,baseUser.IDEN_PER,'S']);
		}
		for (var i = 0; i<arRemoved.length; i++) {
			busGruppiToRemoveStm.push([arRemoved[i],tabellaMembro2,idenGruppo,baseUser.IDEN_PER]);
		}
		if (busGruppiToAddStm.length>0) {
			var resp = top.executeBatchStatement("gruppi.xml","addMembro",busGruppiToAddStm,0);
			if (resp[0][0]!='OK') { throw resp[0][1];}
		}
		if (busGruppiToRemoveStm.length>0) {
			var resp = top.executeBatchStatement("gruppi.xml","removeMembro",busGruppiToRemoveStm,0);
			if (resp[0][0]!='OK') { throw resp[0][1];}
		}
	},
	addThatMemberToTheseGroups: function(){		
		var arAddAndRemove = ASSOCIA_GRUPPI.getAddedAndRemovedOptions();
		var arAdded=arAddAndRemove.arAdded;
		var arRemoved=arAddAndRemove.arRemoved;
		
		var busGruppiToAddStm = [];
		var busGruppiToRemoveStm = [];
		for (var i = 0; i<arAdded.length; i++) {
			busGruppiToAddStm.push([idenMembro2,tabellaMembro2,arAdded[i],baseUser.IDEN_PER,'N']);
		}
		for (var i = 0; i<arRemoved.length; i++) {
			busGruppiToRemoveStm.push([idenMembro2,tabellaMembro2,arRemoved[i],baseUser.IDEN_PER]);
		}
		if (busGruppiToAddStm.length>0) {
			var resp = top.executeBatchStatement("gruppi.xml","addMembro",busGruppiToAddStm,0);
			if (resp[0][0]!='OK') { throw resp[0][1];}
		}
		if (busGruppiToRemoveStm.length>0) {
			var resp = top.executeBatchStatement("gruppi.xml","removeMembro",busGruppiToRemoveStm,0);
			if (resp[0][0]!='OK') { throw resp[0][1];}
		}
	},
	chiudiScheda: function(){
		if (typeof parent.ASSOCIA_GRUPPI!="undefined") {
			parent.ASSOCIA_GRUPPI.ricerca("", "", true);
		}
		parent.$.fancybox.close(); 
	},
	openGroupEdit : function()  {
		var group = $("select[name=Elenco] option:selected");
		if (group.length!=1){
			return alert("Selezionare un gruppo dall'elenco a sinistra");
		}
		config_gruppi.idenGruppo=group.val();
		config_gruppi.idenMembro2=group.val();
		config_gruppi.action="editGroup";
		config_gruppi.groupGruppi="T";
		
		var url = 'servletGenerator?KEY_LEGAME=ASSOCIA_GRUPPI&D='+ASSOCIA_GRUPPI.getAlea(); //random necessario per variare la url, altrimenti il beowser ne impedisce l'apertura

		$.fancybox({
			'padding' : 3,
			'width' : 800,
			'height' : 480,
			'href' : url,
			'type' : 'iframe'
		});
	},
	openGroup : function() {
		config_gruppi.idenGruppo="";
		config_gruppi.idenMembro2="";
		config_gruppi.action="createGroup";
		config_gruppi.groupGruppi="T";
		var url = 'servletGenerator?KEY_LEGAME=ASSOCIA_GRUPPI&D='+ASSOCIA_GRUPPI.getAlea(); //random necessario per variare la url, altrimenti il beowser ne impedisce l'apertura

		$.fancybox({
			'padding' : 3,
			'width' : 800,
			'height' : 480,
			'href' : url,
			'type' : 'iframe'
		});
	},
	getAlea : function() {
		var a = new Date();
		return String(a.getTime()).substring(9);
	}
};

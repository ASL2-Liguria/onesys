$(document).ready(function(){
	window.WindowHome = window;
	
	while((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome ){	
		window.WindowHome = window.WindowHome.parent;
    }
	if (window.WindowHome.name == 'consulenza'){
		window.WindowHome = window.WindowHome.opener.top;
		while((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome ){	
			window.WindowHome = window.WindowHome.parent;
	    }
	}else{
		window.baseReparti 	= WindowHome.baseReparti;
		window.baseGlobal 	= WindowHome.baseGlobal;
		window.basePC 		= WindowHome.basePC;
		window.baseUser 	= WindowHome.baseUser;		
	}
	
	
    NS_GESTIONE_CONSENSO.init();
    NS_GESTIONE_CONSENSO.setEvents();    
});

var NS_GESTIONE_CONSENSO ={
    evento:{
        /*tabella:'',
        tipologia_documento:'',
        iden:'',
        statement_to_load:'',
        iden_anag:'',
        num_nosologico:'',
        consenso_espresso:'',
        volonta_cittadino:'',
        per_legge:'',*/
        set:function(name,value){
            NS_GESTIONE_CONSENSO.evento[name] = value;
        }
    },
    
    saveObject:{
        oscuramento:'',
        volereCittadino:'',
        perLegge:'',
        motivazionePerLegge:'',
        set:function(name,value){
            NS_GESTIONE_CONSENSO.saveObject[name] = "["+name+":"+value+"]";
        },
        getTagToSave:function(){
            return  NS_GESTIONE_CONSENSO.saveObject.oscuramento + 
                   NS_GESTIONE_CONSENSO.saveObject.volereCittadino +
                   NS_GESTIONE_CONSENSO.saveObject.perLegge +
                   NS_GESTIONE_CONSENSO.saveObject.motivazionePerLegge;
        }
    },
    
    init:function(){

        NS_GESTIONE_CONSENSO.getParams();
        NS_GESTIONE_CONSENSO.loadInitValue(NS_GESTIONE_CONSENSO.evento);
        $("#btSetOscuramento").buttonset();
    },
    
    loadInitValue:function(param){
        /*Query che v� a recuperare i dati di salvataggio*/
        var pBinds = new Array();
        var consenso_espresso = "";
        var volonta_cittadino = "";
        var per_legge = ""; 
        /*
         * evento = RICOVERO -> param.iden=NOSOLOGICI_PAZIENTE.IDEN | param.tipologia_documento=funzione della lettera
         * evento = RICHIESTA -> param.iden=TESTATA_RICHIESTE.IDEN  | param.tipologia_documento=funzione della refertazione delle consulenze
         */
        pBinds.push(param.iden);
        pBinds.push(param.tipologia_documento);
        var vResp = WindowHome.executeStatement('consensi.xml',param.statement_to_load,pBinds,3);
        if (vResp[0]=='OK'){
            consenso_espresso = vResp[2];
            volonta_cittadino = vResp[3];
            per_legge = vResp[4];
        }else{
            alert(vResp[0]+' '+vResp[1]);
        }
/*        while(rsInit.next()){
            consenso_espresso = rsInit.getString("consenso_espresso");
            volonta_cittadino = rsInit.getString("volonta_cittadino");
            per_legge = rsInit.getString("per_legge");            
        }*/
        if (consenso_espresso==''  || consenso_espresso==null || typeof consenso_espresso=='undefined'){
            NS_GESTIONE_CONSENSO.setComportamento(false);
        }
        else if (consenso_espresso=='N'){
            //$('input[name="' + name+ '"][value="' + SelectdValue + '"]').prop('checked', true);
            $('input:radio[name="rdOscuramento"][value="'+consenso_espresso+'"]').prop('checked', true);
            NS_GESTIONE_CONSENSO.setComportamento(false);
        }
        else{
            $('input:radio[name="rdOscuramento"][value="'+consenso_espresso+'"]').prop('checked', true);
            NS_GESTIONE_CONSENSO.setComportamento(true);
            if (volonta_cittadino =="001"){
                $("#idVolereCittadino").prop('checked',true);
            }
            if (per_legge !=null){
                $("#idPerLegge").prop('checked',true);
                $('#cmbOscuramentoPerLegge').val(per_legge).prop('selected', true);
            }
                
        }
            
    },   
    setEvents:function(){
        /*Rimosso in quanto il salvataggio non è più singolo ma è globale con la consulenza
         * 
         * $('#registra').click(function(){
            NS_GESTIONE_CONSENSO.save(NS_GESTIONE_CONSENSO.evento);
        });

        $('#chiudi').click(function(){
            NS_GESTIONE_CONSENSO.chiudi();
        });*/ 
        
        /*Setto gli eventi da interfaccia*/
        $('input:radio[name="rdOscuramento"]').click(function(){
            $('input:radio[name="rdOscuramento"]:checked').val()=='N'?NS_GESTIONE_CONSENSO.setComportamento(false):NS_GESTIONE_CONSENSO.setComportamento(true);
        });
        
    },
    
    setComportamento:function(bool){
        if (!bool){
            $("#idVolereCittadino").prop('disabled',true).prop('checked',false).parent().parent();
            $("#idPerLegge").prop('disabled',true).prop('checked',false);
            $("#cmbOscuramentoPerLegge").val('').prop('disabled',true);
            $('#idVolereCittadino,#idPerLegge').parent().parent().hide();
        }else{    
            $("#idVolereCittadino").prop('disabled')==true?$("#idVolereCittadino").prop('disabled',false):null;
            $("#idPerLegge").prop('disabled')==true?$("#idPerLegge").prop('disabled',false):null;
            $("#cmbOscuramentoPerLegge").prop('disabled')==true?$("#cmbOscuramentoPerLegge").prop('disabled',false):null; 
            
            $('#idVolereCittadino,#idPerLegge').parent().parent().show();
        }        
    },        
            
            
    getParams:function(){
        try {
            var idx = document.URL.indexOf('?');
            if (idx != -1) {
                var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
                for (var i = 0; i < pairs.length; i++) {
                    nameVal = pairs[i].split('=');
                    NS_GESTIONE_CONSENSO.evento.set(nameVal[0], nameVal[1]);
                }
            }
        }
        catch (e) {
            alert("getParams - Error:  " + e.description);
        }
    },
    
    save:function(){
    	var param = NS_GESTIONE_CONSENSO.evento;
    	var ret = {
    		esito:'',
    		motivo:''
    	};
        /*alert(  'RADIO: '+$('input:radio[name="rdOscuramento"]:checked').val()+'\n'+
                'chkCittadino: '+$("#idVolereCittadino").is(':checked')+'\n'+
                'chkLegge: '+$('#idPerLegge').is(':checked')+'\n'+
                'selectVal: '+$('#cmbOscuramentoPerLegge option:selected').val()+'\n'+
                'selectKey: '+$('#cmbOscuramentoPerLegge option:selected').attr("key"));*/
        NS_GESTIONE_CONSENSO.saveObject.set('oscuramento',$('input:radio[name="rdOscuramento"]:checked').val());
        NS_GESTIONE_CONSENSO.saveObject.set('volereCittadino',$("#idVolereCittadino").is(':checked')==true?$("#idVolereCittadino").attr('key'):'N');
        NS_GESTIONE_CONSENSO.saveObject.set('perLegge',$("#idPerLegge").is(':checked')==true?'S':'N');
        NS_GESTIONE_CONSENSO.saveObject.set('motivazionePerLegge',$('#cmbOscuramentoPerLegge option:selected').val());
        if (NS_GESTIONE_CONSENSO.check()){
        	ret.esito = false;
        	ret.motivo = 'Scegliere una motivazione'
        	return ret;        	
        }else{
            var vArrayToSave = new Array();
            vArrayToSave.push(NS_GESTIONE_CONSENSO.checkParameter(param.iden));
            vArrayToSave.push(NS_GESTIONE_CONSENSO.checkParameter(param.iden_anag));
            vArrayToSave.push(NS_GESTIONE_CONSENSO.checkParameter(param.tabella));
            vArrayToSave.push(NS_GESTIONE_CONSENSO.checkParameter(param.tipologia_documento));
            vArrayToSave.push(NS_GESTIONE_CONSENSO.checkParameter(NS_GESTIONE_CONSENSO.saveObject.getTagToSave()));
            vArrayToSave.push(NS_GESTIONE_CONSENSO.checkParameter(WindowHome.baseUser.IDEN_PER));

            var resp = WindowHome.executeStatement('consensi.xml','saveConsensoEspresso',vArrayToSave);
            if (resp[0]=='OK'){
//            	alert('Consenso Registrato Correttamente');
            	ret.esito = true;
            	ret.motivo = '';//'Consenso Registrato Correttamente'
            	return ret;  
//                NS_GESTIONE_CONSENSO.chiudi();
            }
            else{
            	ret.esito = false;
            	ret.motivo = 'Errore durante la fase di registrazione del consenso del paziente: '+resp[1];//Consenso Registrato Correttamente
            	return ret; 
            }
        	
        }                 
    },
    
    check:function(value,label){
        if ($("#idPerLegge").is(':checked'))
            if ($('#cmbOscuramentoPerLegge option:selected').val()==''){
                $('#cmbOscuramentoPerLegge').focus();
                return true;
            }
    },
    
    checkParameter:function(param){
        return typeof param=='undefined'?'':param;
    }
    
    /*Rimosso non è più inserito in un fancybox
     *
 	chiudi:function(){
            
        parent.jQuery.fancybox.close();
    },
     */   
    
    
};



 /*          var jsonPrivacy = {"COD_OSCURAMENTO": "", "VOLERE_CITTADINO": "", "PRIVACY_PER_LEGGE": ""};
            ObjDomArray = ['#lblOscuramentoPerVolereCittadino', '#lblOscuramentoPerLegge'];
            // variabile pubblica per ricevere dei parametri in ingresso
            var params;
            var valoreDefaultOscuramento = "N";

            function getParams() {
                try {
                    var idx = document.URL.indexOf('?');
                    if (idx != -1) {
                        var tempParams = new Hashtable();
                        var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
                        for (var i = 0; i < pairs.length; i++) {
                            nameVal = pairs[i].split('=');
                            tempParams.put(nameVal[0], nameVal[1]);
                        }
                        return tempParams;
                    }
                }
                catch (e) {
                    alert("getParams - Error:  " + e.description);
                }
            }

            function init() {
                var sorgente = "";
                params = getParams();
                try {
                    sorgente = params.get("sorgente");
                }
                catch (e) {
                    alert("Nessun parametro sorgente in ingresso");
                    sorgente = "worklist";
                }

                loadInitValue();

                if (jsonPrivacy.COD_OSCURAMENTO == "") {
                    // nuovo
                    $('input:radio[name="rdOscuramento"]').filter('[value=' + valoreDefaultOscuramento + ']').attr('checked', true);
                }
                else {
                    $("input[name=rdOscuramento][value=" + jsonPrivacy.COD_OSCURAMENTO + "]").attr('checked', 'checked');
                    selectOptionByValue("cmbOscuramentoPerLegge", jsonPrivacy.PRIVACY_PER_LEGGE);
                    if (jsonPrivacy.VOLERE_CITTADINO == "S") {
                        $("#idVolereCittadino").attr('checked', 'checked');
                    }
                }

                //			nascondiMostraRiga(ObjDomArray,'hide');

            }

            function setEvents() {

                return;
                // faccio il bind se e solo se provengo dalla console
                if (params.get("sorgente") != "worklist") {
                    $.each($("[name='rdOscuramento']"), function() {
                        var obj = $(this);
                        obj.click(function() {
                            obj.val() != 'N' ? nascondiMostraRiga(ObjDomArray, 'show') : nascondiMostraRiga(ObjDomArray, 'hide')
                        });
                    });
                }

            }

            function salvaOscuramento() {


                //chiudi();

                var lista = new Array();
                var valoreXML = getXMLtoSave();
                if (valoreXML == "") {
                    alert("Errore: xml nullo. Contattare amministratore di sistema");
                    return;
                }
                lista.push(valoreXML);
                lista.push(params.get("iden_esame"));
                if (params.get("sorgente") == "worklist") {
                    // usare updatePrivacyEsameByAccettazione
                    var out = getHomeFrame().executeStatement('privacy.xml', 'updatePrivacyEsameByAccettazione', lista, 0);
                    if (out[0] == 'OK') {
                        parent.aggiorna();
                    }
                    else {
                        // errore
                        alert("Errore registrazione modulo privacy. Contattare amministratore di sistema");
                        return;
                    }
                }
                else if (params.get("sorgente") == "consolle") {
                    // usare updatePrivacyEsameByIden
                    var out = getHomeFrame().executeStatement('privacy.xml', 'updatePrivacyEsameByIden', lista, 0);
                    if (out[0] == 'OK') {
                        alert("Oscuramento cittadino registrato");
                        chiudi();
                    }
                    else {
                        // errore
                        alert("Errore registrazione modulo privacy. Contattare amministratore di sistema");
                        return;
                    }

                }
                else {
                    alert("errore");
                    return;
                    //@TODO
                }
            }


            function chiudi() {
                parent.jQuery.fancybox.close();
            }

            function getXMLtoSave() {
                var strOutput = "";
                var headXml = "<?xml version = '1.0' encoding = 'UTF-8'?><consenso>";
                var tailXml = "</consenso>";
                // esempio
                // 		var xmlConsensoCittadino = "<?xml version = '1.0' encoding = 'UTF-8'?><consenso><condidentiality-code>V</condidentiality-code><confidentialy-descriptors><descriptor key='006'>Dipendenza da sostanze psicotrope</descriptor><descriptor key='001'>Volonta' del cittadino</descriptor>   </confidentialy-descriptors></consenso>";
                try {

                    var DescriptorVal = getValue("cmbOscuramentoPerLegge");
                    var DescriptorDescr = getText("cmbOscuramentoPerLegge");

                    strOutput = "<condidentiality-code>" + CodeValue + "</condidentiality-code>";
                    strOutput += "<confidentialy-descriptors>";
                    if (privacyCittadino == "S") {
                        strOutput += "<descriptor key='001'>Volonta' del cittadino</descriptor>";
                    }
                    if (DescriptorVal != "") {
                        strOutput += "<descriptor key='" + DescriptorVal + "'>" + DescriptorDescr + "</descriptor>";
                    }
                    strOutput += "</confidentialy-descriptors>";
                    strOutput = headXml + strOutput + tailXml;

                }
                catch (e) {
                    alert("getXMLtoSave - Error: " + e.description);
                }
                return strOutput;
            }



            function nascondiMostraRiga(pObjDom, pAzione) {
                $.each(pObjDom, function(index, value) {
                    eval("$('" + pObjDom[index] + "').parent().parent()." + pAzione + "()");
                })
            }
            function getStringaParametri() {

                var CodeValue = $('input:radio[name="rdOscuramento"]:checked').val();
                var DescriptorVal = $('select[name="cmbOscuramentoPerLegge"] option:selected').val();
                var DescriptorDescr = $('select[name="cmbOscuramentoPerLegge"] option:selected').attr("key");


                param = 'radsql.sp_save_oscuramento';
                param += '@V#001$Dipendenza da sostanze psicotrope*006$Interruzione di gravidanza,1157843';
                param += '@TRUE';//indica se la procedura ha un output
                param += '@STRING';//type_return_value
                alert(param);

                return param;
            }

            function loadInitValue() {
                // usare VIEW_OSCURAMENTO_ESAME
                // getPrivacyEsame
                // passare iden con , separatrice

                var myLista = new Array();
                var idenEsami = "";

                try {
                    idenEsami = params.get("iden_esame");
                }
                catch (e) {
                    alert("Error iden_esame is null");
                    return;
                }

                try {
                    myLista.push(idenEsami);

                    rs = getHomeFrame().executeQuery('privacy.xml', 'getPrivacyEsame', myLista);
                    if (rs.next()) {
                        jsonPrivacy.COD_OSCURAMENTO = rs.getString("COD_OSCURAMENTO");
                        jsonPrivacy.VOLERE_CITTADINO = rs.getString("VOLERE_CITTADINO");
                        jsonPrivacy.PRIVACY_PER_LEGGE = rs.getString("PRIVACY_PER_LEGGE");
                    }
                    else {
                        // nuovo 
                        //@TODO
                    }
                    //				alert(jsonPrivacy.COD_OSCURAMENTO +" " + jsonPrivacy.VOLERE_CITTADINO  +" " + jsonPrivacy.PRIVACY_PER_LEGGE);
                }
                catch (e) {
                    alert("loadInitValue - Error: " + e.description);
                }
            }


            function getHomeFrame() {
                var objHomeFrame;

                try {
                    if (params.get("sorgente") == "worklist") {
                        objHomeFrame = top;
                    }
                    else {
                        objHomeFrame = parent.top.opener.top;
                    }
                }
                catch (e) {
                    alert(e.description);
                }
                return objHomeFrame;
            }


        <script>
            $(function() {

                init();
                setEvents();
                $("#btSetOscuramento").buttonset();
                //$( "#idVolereCittadino" ).button();

                // bind click event on save bt
                $("#btSave").click(function(event) {
                    event.preventDefault();
                    setCallbackValue();
                });

                // loadInitValue


            });*/

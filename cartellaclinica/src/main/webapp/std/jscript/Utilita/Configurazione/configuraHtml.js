var versione = 1;
var versioneSintesi = 1;
var pagina = '';
var paginaOrig = '';
var groupLayer='';
var form = '';
var formOrig = '';
var tabella = '';
var tabellaOrig = '';

$(function(){
	$("input[name=txtTabForm],input[name=txtKeyFormOrig]").attr("disabled",true);
	$("input[name=txtKeyLegame]").keyup(function(){
		if ($(this).val().length>3) {
			var sql = "select wm_concat(pagina) from CONFIGURAZIONE_SCHEDE.HTML_PAGINA where PAGINA like '%"+$(this).val()+"%'";
			caricaCombo($('select[name="cmbPagina"]'),sql);
		}
	});
	$("input[name=txtKeyLegameOrig]").keyup(function(){
		if ($(this).val().length>3) {
			var sql = "select wm_concat(pagina) from CONFIGURAZIONE_SCHEDE.HTML_PAGINA where PAGINA like '%"+$(this).val()+"%'";
			caricaCombo($('select[name="cmbPaginaOrig"]'),sql);
		}
	});
	$("input[name=txtPaginaSintesiFrom]").keyup(function(){
		if ($(this).val().length>3) {
			var sql = "select wm_concat(pagina) from CONFIGURAZIONE_SCHEDE.HTML_PAGINA where PAGINA like '%"+$(this).val()+"%'";
			caricaCombo($('select[name="cmbPaginaSintesiFrom"]'),sql);
		}
	});
	var sql = "select string_agg(distinct KEY_ID) from CONFIGURAZIONE_SCHEDE.HTML_ATTRIBUTI_ENGINE where KEY_ID LIKE 'GROUP_LAYER.%'";
	caricaCombo($('select[name="cmbTipoForm"]'),sql);
	var sql = "select string_agg(distinct KEY_ID) from CONFIGURAZIONE_SCHEDE.HTML_ATTRIBUTI_ENGINE where KEY_ID LIKE 'TABELLA.%'";
	caricaCombo($('select[name="cmbTipoTabella"]'),sql);
	var sql = "select string_agg(distinct KEY_ID) from CONFIGURAZIONE_SCHEDE.HTML_ATTRIBUTI_ENGINE where KEY_ID LIKE 'CAMPO.%'";
	caricaCombo($('select[name="cmbTipoCampo"]'),sql);

	$('label#lblCrea').addClass('pulsante').click(function() {
		creaPagina();
	});
	$('label#lblCreaForm').addClass('pulsante').click(function() {
		creaForm();
	});
	$('label#lblCreaTabella').addClass('pulsante').click(function() {
		creaTabella();
	});
	$('label#lblCreaCampo').addClass('pulsante').click(function() {
		creaCampo();
	});
	$('label#lblCreaCampoSintesi').addClass('pulsante').click(function() {
		creaCampoSintesi();
	});
	$('label#lblCreaSintesi').addClass('pulsante').click(function() {
		creaSintesi();
	});
	$('select[name="cmbPagina"]').change(function(){
		pagina = $('select[name="cmbPagina"] option:selected').val();
		var sql = "Select STRING_AGG(KEY_ID) from CONFIGURAZIONE_SCHEDE.HTML_ATTRIBUTI where KEY_LEGAME like '" + pagina + ".%' and TIPO_ID='GROUP_LAYER'";
		caricaCombo($('select[name="cmbForm"]'), sql);
		sql = "select key_form from CONFIGURAZIONE_SCHEDE.HTML_PAGINA where PAGINA = '"+pagina+"'";
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(sql, callback);
		dwr.engine.setAsync(true);
		function callback(res) {
			form = res;
			$("input[name=txtTabForm]").val(res);
		}
	});
	$('select[name="cmbPaginaOrig"]').change(function(){
		paginaOrig = $('select[name="cmbPaginaOrig"] option:selected').val();
		var sql = "Select STRING_AGG(KEY_TABELLA) from CONFIGURAZIONE_SCHEDE.HTML_FORM where KEY_LEGAME like '"+paginaOrig+".%'";
		caricaCombo($('select[name="cmbTabellaOrig"]'), sql);
		sql = "select key_form from CONFIGURAZIONE_SCHEDE.HTML_PAGINA where PAGINA = '"+paginaOrig+"'";
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(sql, callback);
		dwr.engine.setAsync(true);
		function callback(res) {
			formOrig = res;
			$("input[name=txtKeyFormOrig]").val(res);
		}
	});
	$('select[name="cmbForm"]').change(function(){
		groupLayer = $('select[name="cmbForm"] option:selected').val();
		var sql = "Select STRING_AGG(KEY_TABELLA) from CONFIGURAZIONE_SCHEDE.HTML_FORM where KEY_LEGAME like '"+pagina+".%' and KEY_GROUP_LAYER = '" + groupLayer + "' order by ORDINE";
		caricaCombo($('select[name="cmbTabella"]'), sql);
	});
//	$('select[name="cmbFormOrig"]').change(function(){
//	formOrig = $('select[name="cmbFormOrig"] option:selected').val();
//	var sql = "Select STRING_AGG(KEY_TABELLA) from CONFIGURAZIONE_SCHEDE.HTML_FORM where KEY_GROUP_LAYER = '" + formOrig + "' order by ORDINE";
//	caricaCombo($('select[name="cmbTabellaOrig"]'), sql);
//	});
	$('select[name="cmbTabella"]').change(function(){
//		var sql = "Select STRING_AGG(KEY_CAMPO) from CONFIGURAZIONE_SCHEDE.HTML_CAMPI where KEY_LEGAME = '"+$('select[name="cmbPaginaOrig"] option:selected').val()+".dati."+$('select[name="cmbTabellaOrig"] option:selected').val()+"' order by KEY_CAMPO";
//		caricaCombo($('select[name="cmbCampoOrig"]'), sql);
		tabella = $('select[name="cmbTabella"] option:selected').val();
	});
	$('select[name="cmbTabellaOrig"]').change(function(){
		tabellaOrig = $('select[name="cmbTabellaOrig"] option:selected').val();
		var sql = "Select STRING_AGG(KEY_CAMPO) from CONFIGURAZIONE_SCHEDE.HTML_CAMPI where KEY_LEGAME like '"+paginaOrig+"."+formOrig+"."+tabellaOrig+"' order by KEY_CAMPO";
		alert(sql);
		caricaCombo($('select[name="cmbCampoOrig"]'), sql);
	});
});

function creaPagina() {
	pagina = $("input[name=txtNomePagina]").val(); 
	key_form = $("input[name=txtKeyForm]").val(); 
	if (pagina==''||key_form==''){
		return alert('assenza del key_legame o key_form per creare una nuova pagina');
	}
	var sql = "BEGIN insert into CONFIGURAZIONE_SCHEDE.HTML_PAGINA (pagina, key_form, versione) values ('" +
	pagina + "', '"+ key_form +"', " + versione + "); " +
	"insert into CONFIGURAZIONE_SCHEDE.HTML_ATTRIBUTI(key_legame, key_id, tipo_id, attributo, valore, gruppo, versione) values ('" +
	pagina + "', '" +
	pagina + "', '" +
	"PAGINA"  + "', '" +
	"INCLUDE_FILE"  + "', '" +
	"DEFAULT_CSS," + pagina + "#" + pagina  + "', '" +
	"HEAD"  + "', " +
	versione  + "); END;"; 
	alert(sql);
	eseguiInsertUpdate(sql);
	$("select[name=cmbPagina]").append("<option value='"+pagina+"'>"+pagina+"</option>");
}

function creaForm() {
	var key_Group_Layer = $('input[name="txtNomeForm"]').val();
	if (key_Group_Layer=='') return alert('assenza nome key_group_layer');
	var attributiAttributo = $('select[name="cmbTipoForm"] option:selected').val();
	if (attributiAttributo=='') return alert('seleziona tipo form');
	var sql = "insert into CONFIGURAZIONE_SCHEDE.html_attributi (key_id, tipo_id, attributo, valore, key_legame, versione) values ('"
		+ key_Group_Layer + "', '"
		+ "GROUP_LAYER" + "', '"
		+ attributiAttributo + "', '"
		+ "title" + key_Group_Layer + "#title" + key_Group_Layer + "', '"	// attributi_valore
		+ pagina + "." + form + "',"
		+ versione + ")";
	eseguiInsertUpdate(sql);
	$("select[name=cmbForm]").append("<option value='"+key_Group_Layer+"'>"+key_Group_Layer+"</option>");
}

function creaTabella() {
	var key_Group_Layer = $("select[name=cmbForm] option:selected").val();
	if (key_Group_Layer=='') return alert('assenza key_group_layer');
	var key_Tabella = $('input[name="txtNomeTabella"]').val();
	if (key_Tabella=='') return alert('assenza nome key_tabella');
	var ordine = $('input[name="txtOrdineTabella"]').val();
	if (ordine=='') return alert('assenza ordine tabella');
	var sql = "BEGIN insert into CONFIGURAZIONE_SCHEDE.HTML_FORM (key_group_layer, key_tabella, key_legame, ordine, versione) values('"
		+ key_Group_Layer + "', '"
		+ key_Tabella + "', '"
		+ pagina + "." + form + "',"
		+ ordine + ", "
		+ versione + ");";

	var attributiAttributo = $('select[name="cmbTipoTabella"] option:selected').val();
	if (attributiAttributo!='') {
		var title =  $('input[name="txtTitleTabella"]').val();
		if (title=='') return alert('assenza titolo tabella');
		sql += 
			"insert into CONFIGURAZIONE_SCHEDE.html_attributi (key_id, tipo_id, attributo, valore, key_legame, versione) values ('"
			+ key_Tabella + "', '"
			+ "TABELLA" + "', '"
			+ attributiAttributo + "', '"
			+ "id" + key_Tabella + "#lbl" + key_Tabella + "##" + title + "', '"	// attributi_valore
			+ pagina + "." + form + "',"
			+ versione + ");";
	}
	sql += "END;";
	eseguiInsertUpdate(sql);
	$("select[name=cmbTabella]").append("<option value='"+key_Tabella+"'>"+key_Tabella+"</option>");
}

function creaCampo() {
	var campi_Key_Legame = pagina + "." + form + "." + tabella;
	var campi_Key_Campo = $('input[name="txtNomeCampo"]').val();
	if (campi_Key_Campo=='') return alert('assenza nome campo');
	var campi_Riga = $('input[name="txtRiga"]').val();
	if (campi_Riga=='') return alert('assenza riga');
	var campi_Colonna = $('input[name="txtColonna"]').val();
	if (campi_Colonna=='') return alert('assenza colonna');
	var sql = "BEGIN insert into CONFIGURAZIONE_SCHEDE.HTML_CAMPI (key_legame, key_campo, riga, colonna, versione) values ('" 
		+ campi_Key_Legame + "', '"
		+ campi_Key_Campo  + "', "
		+ campi_Riga  + ", "
		+ campi_Colonna  + ", "
		+ versione  + ");";

	var attributi_Key_Id = campi_Key_Campo;
	var attributi_Tipo_Id = "CAMPO";
	var attributi_Gruppo = "COLONNA";
	var attributi_Key_Legame = campi_Key_Legame;
	var attributi_Attributo = $('select[name="cmbTipoCampo"] option:selected').val();
	var attributi_Valore = campi_Key_Campo;
	sql += "insert into CONFIGURAZIONE_SCHEDE.html_attributi (key_id, tipo_id, attributo, valore, gruppo, key_legame, versione) values ('"
		+ attributi_Key_Id + "', '"
		+ attributi_Tipo_Id + "', '"
		+ attributi_Attributo + "', '"
		+ attributi_Valore + "', '"
		+ attributi_Gruppo  + "', '"
		+ attributi_Key_Legame + "', "
		+ versione + "); END;";
	eseguiInsertUpdate(sql);
}

function creaCampoSintesi() {
	var campi_Riga = $('input[name="txtRiga"]').val();
	if (campi_Riga=='') return alert('assenza riga');
	var campi_Colonna = $('input[name="txtColonna"]').val();
	if (campi_Colonna=='') return alert('assenza colonna');
	var campoOrig = $("select[name=cmbCampoOrig] option:selected").val();
	if (campoOrig=='') return alert('assenza campo origine');
	var sql = "insert into CONFIGURAZIONE_SCHEDE.html_campi_sintesi(KEY_LEGAME_SINTESI,VERSIONE_SINTESI,KEY_LEGAME,KEY_CAMPO,RIGA,COLONNA,VERSIONE) values('" +
	pagina + "." + form + "." + tabella + "'," +
	versioneSintesi +",'" +
	paginaOrig + "."+ formOrig + "." + tabellaOrig + "','" +
	campoOrig +"'," +
	campi_Riga +"," +
	campi_Colonna + "," +
	versione +")";

	eseguiInsertUpdate(sql);
}

function creaSintesi() {
	pagina=$("input[name=txtPaginaSintesiTo]").val();
	paginaOrig=$("select[name=cmbPaginaSintesiFrom] option:selected").val();
	var sql = "call configurazione_schede.genera_sintesi('"+paginaOrig+"','"+pagina+"')";
	eseguiInsertUpdate(sql);
}

function caricaCombo(combo, sql) {
	dwr.engine.setAsync(false);
	toolKitDB.getResultData(sql, callback);
	dwr.engine.setAsync(true);
	function callback(res) {
		combo.html('').append('<option value="">---</option>');
		var options = res.toString().split(',');
		for (var i=0; i<options.length; i++) {
			var option = options[i].split('.');
			combo.append('<option value="'+option[option.length-1]+'">'+option[option.length-1]+'</option>');
		}
	}
}

function eseguiInsertUpdate(sql) {
	dwr.engine.setAsync(false);
	toolKitDB.executeQueryData(sql, callback);
	dwr.engine.setAsync(true);
	function callback(res) {
		if (res==1) {
			alert('comando eseguito correttamente');
			return true;
		} else {
			alert (res);
			return false;
		}
	}
}

function apriPagina() {
	var url = "servletGenerator?KEY_LEGAME="+pagina;
	window.open(url);
}
function apriSintesi() {
//	var url = "servletSynthesis?KEY_LEGAME="+pagina;
//	window.open(url);
	var param = {
			title:"Finestra di Dialogo",
			width:300,
			height:300,
			elements:	[{ tag:"input",label:"Data inizio: ",datepicker:true,attributes:{id:"data1"}},
			         	 { tag:"input",label:"Ora inizio: ",style:"width:40px",attributes:{}},
			         	 { tag:"input",label:"Data fine: ",datepicker:true,attributes:{id:"data2"}},
			         	 { tag:"input",label:"Ora fine: ",style:"width:40px",attributes:{}},
			         	 { tag:"textarea",label:"Motivo",style:"width:90%;",attributes:{id:"test2"}}
			         	 ],
			 buttons: [{label:"ok", id:'registra'}],
		     setFunctions: function(){ 
		    	 $('#test').click(function(){
		    		 alert("test");
		    	 });
		    	 $('#registra').click(function(){
		    		 alert("registra");
		    		 $("#txtNote").val($("#test2").val());
		    	 });
		     }
	};
	 getCustomDialog(param,window);
}

function getCustomDialog(param,scope) {

	var dialogHtml = document.createElement('div');
	dialogHtml.id = "customDialog";
	dialogHtml.style.heigth=param.height;
	dialogHtml.style.width=param.width;
	var header =  document.createElement('div');
	header.className = "header";
	header.innerText=param.title;
	dialogHtml.appendChild(header);
	for (var i in param.elements) {
		var element = param.elements[i];
		var divContainer = document.createElement("div");
		divContainer.className="containerElement";
		divContainer.style.width="100%";
		var el = document.createElement(element.tag);
		if (typeof element.label!="undefined"){
			var label = document.createElement("label");
			label.innerText=element.label;
			divContainer.appendChild(label);
		}
		divContainer.appendChild(el);
		if (typeof element.datepicker!="undefined") {
			setCampoData(el,scope);
		}
		if (typeof element.style!="undefined") {
			el.style.cssText=element.style;
		}
		for (var key in element.attributes) {
					var value = element.attributes[key];
					el.setAttribute(key,value);
		}
		dialogHtml.appendChild(divContainer);
		dialogHtml.appendChild(document.createElement("br"));
	}
	var footer =  document.createElement('div');
	footer.className = "footer";
	if (typeof param.buttons != "undefined") {
		for (var i in param.buttons) {
			var button = document.createElement("div");
			button.innerText=param.buttons[i].label;
			button.id=param.buttons[i].id;
			button.className="btn";
			footer.appendChild(button);
		}
	}
	dialogHtml.appendChild(footer);
	scope.$.fancybox({
	'padding'	: 3,
	 autoDimensions: false,
	 autoScale: false,
	'content': dialogHtml
	});
	scope.$('div#fancybox-outer,div#fancybox-content').width(param.width);
	param.setFunctions();

	function setCampoData(obj,scope) {
		scope.$(obj).datepick(
				{
					showOnFocus: false,  
					showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
				}
		);
	}
}

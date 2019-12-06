var _MSG_ERROR = '';

function FormDataSend()
{
	this._a_dati = new Object();
	
	this.append = function (nome, valore)
	{
		if(typeof nome == 'string' && nome != '')
		{
			eval('this._a_dati.' + nome + '="' + (typeof valore == 'undefined' ? "":valore.replace(/\"/g, '\\"').replace(/\r\n|\n|\r/g, "\\n")) + '";'); 
		}
	};
	
	this.get = function()
	{
		return this._a_dati;
	};
}

function registra(attiva_controllo,callBackOK,callBackKO)
{	
	//alert('registra');
	if(typeof attiva_controllo != 'boolean')
	{
		attiva_controllo = true;
	}
	
	_MSG_ERROR = '';
	
	if(check_dati(attiva_controllo) == '')
	{
		if(document.richiediUtentePassword.getRichiediPwdRegistra())
		{
			
			document.richiediUtentePassword.view('registra(false);', 'S')
		}
		else
		{
			
			document.apriAttesaSalvataggio();
			
			set_operazione();
			if(document.forms.length<=2){
				send_dati();
			}else{
				send_forms();
			}
		}
		if(typeof callBackOK=='function')
			callBackOK();
	}else{
		if(typeof callBackKO=='function')
		callBackKO();		
		
	}
}

function set_operazione(idx_principale, tipo)
{
	var cField = null;
	
	if(idx_principale == null)
	{
		idx_principale = 0;
	}
	
	if(tipo == null)
	{
		tipo = 'SAVE';
	}
	
	cField = document.createElement('input');
	
	cField.setAttribute('type','hidden');
	cField.setAttribute('name', 'OPERAZIONE');
	cField.setAttribute('value', tipo);
	
	document.forms[idx_principale].appendChild(cField);

}

function unisci_form(idx_principale)
{
	var idx_form;
	var idx_field;
	var idx_check;
	var value_radio;
	var a_label;
	var cField 		 = null;
	var frmDati 	 = new FormDataSend();
	var nome_campo 	 = '';
	var valore_campo = '';	
	
	if(idx_principale == null)
	{
		idx_principale = 0;
	}
	
	for(idx_form = idx_principale + 1; idx_form < document.forms.length; idx_form++)
	{
		if(document.forms[idx_form])
		{
			//alert(document.forms[idx_principale].name);
			for(idx_field = 0; idx_field < document.forms[idx_form].length; idx_field++)
			{
				if(document.getElementsByName(document.forms[idx_form][idx_field].name).length <2)
				{

					cField = document.createElement('input');
					
					cField.setAttribute('type','hidden');
					cField.setAttribute('name', document.forms[idx_form][idx_field].name);
					cField.setAttribute('value', document.forms[idx_form][idx_field].value);
					
					document.forms[idx_principale].appendChild(cField);
				}
			}
		}
	}

	for(idx_field = 0; idx_field < document.forms[idx_principale].length; idx_field++)
	{
		nome_campo = document.forms[idx_principale][idx_field].name;
		valore_campo = ''; // inizializzo per sicurezza!!!
		
		if(document.forms[idx_principale][idx_field].type == 'radio')
		{
			for(idx_check = 0; idx_check < document.getElementsByName(document.forms[idx_principale][idx_field].name).length; idx_check++)
			{
				if(document.getElementsByName(document.forms[idx_principale][idx_field].name)[idx_check].checked)
				{
					value_radio = document.getElementsByName(document.forms[idx_principale][idx_field].name)[idx_check].value;
					idx_check = document.forms[idx_principale][idx_field].length + 1;
				}
				else
					value_radio = '';
			}
			
			valore_campo = value_radio;
		}
		else
		{
			if(document.forms[idx_principale][idx_field].type == 'select')
			{
				valore_campo = document.forms[idx_principale][idx_field].options[document.forms[idx_principale][idx_field].selectedIndex].value;
			}
			else
			{
				if(document.forms[idx_principale][idx_field].type != 'checkbox')
				{
					valore_campo = document.forms[idx_principale][idx_field].value;
				}
				else
				{
					if(document.forms[idx_principale][idx_field].value == '' || document.forms[idx_principale][idx_field].value == 'N' || document.forms[idx_principale][idx_field].value == 'S')
					{
						valore_campo = document.forms[idx_principale][idx_field].checked ? 'S':'N';
					}
					else
					{
						valore_campo = document.forms[idx_principale][idx_field].checked ? document.forms[idx_principale][idx_field].value:'';
					}
				}
			}
		}		
		frmDati.append(nome_campo, valore_campo);
	}

	/*a_label = document.getElementsByTagName('label');
	
	for(idx_field = 0; idx_field < a_label.length; idx_field++)
	{
		
		if(a_label[idx_field].id != '' && (typeof a_label[idx_field].id != 'undefined'))
		{
			frmDati.append(a_label[idx_field].id, a_label[idx_field].innerHTML);
		}
		else
		{
			if(a_label[idx_field].name != '' && (typeof a_label[idx_field].name != 'undefined'))
			{				
				frmDati.append(a_label[idx_field].name, a_label[idx_field].innerHTML);
			}
		}
	}*/
	
	return frmDati;
}

function send_dati(idx_principale)
{
	var dati = unisci_form(idx_principale);
	jQuery.post('servletRegisters', dati.get(), rispostaServer);	
}

function send_forms(){
	Salvataggio.init();
	var vForms = document.forms;
	for(var j = 0 ; j<vForms .length ; j++){
		Salvataggio.form.init(vForms[j]);
	}
	//for(i in Salvataggio.data)
	var idx = 0;
	submitForm(idx);
		
	function submitForm(){
		if(vForms[idx].getAttribute("edited") == null || vForms[idx].name == 'EXTERN' || vForms[idx].name == 'FOOTER'){
			//alert('NoSave :' + vForms[idx].name);
			callBack("","success");
		}else{			
			//alert('Save :' + vForms[idx].name);
			jQuery.post('servletRegisters', Salvataggio.data[vForms[idx].name], callBack);	
		}
	}
	
	function callBack(valore, stato){
		if(stato == 'success')
		{
			idx++;
			

			if(idx>= vForms.length){
				document.chiudiAttesaSalvataggio();
				richiama_conclusione(valore);				
			}else{
				submitForm(idx);
			}
		}
		else
		{
			alert('Errore durante la risposta del server!\nMessaggio: ' + stato);
			document.chiudiAttesaSalvataggio();
		}		
	}
}

function rispostaServer(valore, stato)
{
	if(stato == 'success')
	{
		document.chiudiAttesaSalvataggio();
 
		richiama_conclusione(valore);

		
	}
	else
	{
		alert('Errore durante la risposta del server!\nMessaggio: ' + stato);
	}
}

function check_dati(avviso)
{
	var aCampi  = new Array();
	var result  = true;
	var msg     = '';
	var msg_tmp = '';
	var aObj    = document.getElementsByAttribute('*', 'STATO_CAMPO', 'O');
	var chkTmp;
	var idx;
	var idxChk;
	
	if(avviso == null)
	{
		avviso = true;
	}
	
	for(idx = 0; idx < aObj.length; idx++)
	{
		msg_tmp = '';
		
		if(aCampi[aObj[idx].name] != 1)
		{
			aCampi[aObj[idx].name] = 1; // Flaggo "processato"
			
			if(aObj[idx].type == 'radio')
			{
				chkTmp = false;
				
				for(idxChk = 0; !chkTmp && idxChk < document.all[aObj[idx].name].length; idxChk++)
				{
					chkTmp = document.all[aObj[idx].name](idxChk).checked;
				}
				
				try // PROVVISORIO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
				{
					if(typeof document.all[aObj[idx].name](0).STATO_CAMPO_LABEL != 'undefined')
					{
						if(!chkTmp && document.all[aObj[idx].name](0).STATO_CAMPO_LABEL != 'undefined')
						{
							if(trim(document.all[aObj[idx].name](0).STATO_CAMPO_LABEL) != '')
							{
								msg_tmp = ritornaJsMsg(document.all[aObj[idx].name](0).STATO_CAMPO_LABEL);
							}
						}
					}
				}
				catch(ex)
				{
				}
			}
			else
			{
				if(typeof aObj[idx] != 'undefined' && typeof aObj[idx].name != 'undefined')
				{
					if(typeof document.all[aObj[idx].name].STATO_CAMPO_LABEL != 'undefined')
					{
						if(trim(aObj[idx].value) == '' && document.all[aObj[idx].name].STATO_CAMPO_LABEL != 'undefined')
						{
							if(trim(document.all[aObj[idx].name].STATO_CAMPO_LABEL) != '')
							{
								msg_tmp = ritornaJsMsg(document.all[aObj[idx].name].STATO_CAMPO_LABEL);
							}
						}
					}
				}
			}
		}
		
		if(msg_tmp != '')
		{
			msg += '\n\t- ' + msg_tmp;
		}
	}
	
	if(msg != '' && avviso)
	{
		alert('Prego compilare i seguenti campi prima di effettuare \nla registrazione:' + msg);
	}
	
	return msg;
}

function chiudi()
{
	if(typeof opener != 'undefined')
	{
		try
		{
			opener.aggiorna();
		}
		catch(ex)
		{
		}
	}
	
	//self.close();
}

function richiama_conclusione(altro)
{
	try
	{	
           
	
		document.all['body'].ok_registra();

	

	}
	catch(ex)
	{
		try
		{
			
			document.all['body'].ko_registra();
		}
		catch(ex)
		{
			
			eval(altro);
		}
	}
}

function errori()
{
	return _MSG_ERROR;
}
/*
function aggiorna()
{
	document.all.oIFWk.contentWindow.location.replace("servletGenerator?KEY_LEGAME=CARTELLA_CLIN_VIEW_WK_BISOGNI&WHERE_WK=where DAT_ESA >= '20080910'");
	//document.all.oIFWk.src = "servletGenerator?KEY_LEGAME=CARTELLA_CLIN_VIEW_WK_BISOGNI&WHERE_WK=DAT_ESA >= '20080101'";
}*/

var Salvataggio =  {
	data: null,
	
	init : function(){
		Salvataggio.data = new Object();
	},
	
	form : {
		
		init : function(pForm){//cicla i dati del form e li prepara per il salvataggio		
			
			if(pForm.name == 'EXTERN' || pForm.name=='FOOTER')return;
			
			eval('Salvataggio.data.' + pForm.name + ' = new Object();');
			
			for (var i = 0; i< pForm.length; i++){				
				Salvataggio.form.append(pForm,pForm[i]);
			}
			Salvataggio.form.completa(pForm);
			Salvataggio.data[pForm.name].KEY_LEGAME = pForm.name;
		},
		
		completa : function(pForm){//prende i dati in extern e li mette nel form indicato
			var vExtern = document.forms['EXTERN'];
			for (var z = 0 ; z < vExtern.length ; z ++){
				Salvataggio.form.append(pForm,vExtern[z]);
			}
		},
		
		append : function(pForm,pInput){//aggiunge un input al form indicato
			try{
				var val = '';
				//alert(pInput.type);
				switch (pInput.type){
					case 'text':
					case 'hidden':   val = pInput.value;
						break;
					case 'checkbox': val = pInput.checked?'S':'N';
						break;
					case 'select-one':   val = pInput[pInput.selectedIndex].value;
						break;
					case 'textarea': val = pInput.innerText;
						break;
					case 'radio':    val = $('form[name="' + pForm.name + '"] input[name="' + pInput.name + '"]:checked').val();
						break;
				}				
				eval('Salvataggio.data.' + pForm.name + '.' + pInput.name + ' = "' + (val==undefined?'':val) + '";');
			}catch(e){
				alert(pInput.name + ' : ' + e.description);
			}
		}
		
	}
};
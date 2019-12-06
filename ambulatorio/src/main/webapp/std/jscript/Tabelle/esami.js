var reg = false;

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}


function chiudi_ins_mod()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_esa.descr.value;
    else
		campo_descr = document.form_esa.cod_esa.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}
	
function apri_codmin()
{
	doc=document.form_esa; 
    if (document.form_esa.cod_min.value == '')
	{
    	alert(ritornaJsMsg('el1')); //alert('Prego prima inserire codice ministeriale')
        document.form_esa.cod_min.focus();
        return; 
    } 
        // Metto i codici min già inseriti
    document.form_cod_min.cod_min1.value = doc.cod_min.value;
    document.form_cod_min.cod_min2.value=doc.hcod_min2.value; 
    document.form_cod_min.cod_min3.value=doc.hcod_min3.value; 
    document.form_cod_min.cod_min4.value=doc.hcod_min4.value; 
    document.form_cod_min.cod_min5.value=doc.hcod_min5.value; 
    document.form_cod_min.cod_min6.value=doc.hcod_min6.value; 
    document.form_cod_min.cod_min7.value=doc.hcod_min7.value; 
    document.form_cod_min.cod_min8.value=doc.hcod_min8.value; 
    document.form_cod_min.cod_min9.value=doc.hcod_min9.value; 
    document.form_esa.cod_min.value = document.form_cod_min.cod_min1.value;
    varWinCodMin = window.open('','winCodMin','width = 787, height = 185, status=yes, top=35,left=0, resizable=yes');
    document.form_cod_min.submit();
}
		
		
function aggiungi_elemento(valore)
{
	if (valore=='M')
	{
    	num_esa=document.all.oEsa_In.options.length;
        for (i=0;i<num_esa;i++)
		{
        	if (document.all.oEsa_In[i].selected)
			{
            	valore_iden = document.all.oEsa_In.options(i).value;
                valore_descr = document.all.oEsa_In.options(i).text;
                var oOption = document.createElement('Option');
                oOption.text = valore_descr;
                oOption.value = valore_iden;
                document.all.oEsa_Out.add(oOption);
             }
        }
        for (i=num_esa-1;i>-1;i--)
		{
        	if (document.all.oEsa_In[i].selected)
			{
            	document.all.oEsa_In.options.remove(i);
            }
		}
	return;
    }
}



function rimuovi_elemento()
{
	num_esa=document.all.oEsa_Out.options.length;
    for (i=num_esa-1;i>-1;i--)
	{
    	if (document.all.oEsa_Out[i].selected)
		{
        	valore_iden = document.all.oEsa_Out.options(i).value;
            valore_descr = document.all.oEsa_Out.options(i).text;
            var oOption = document.createElement('Option');
            oOption.text = valore_descr;
            oOption.value = valore_iden;
            document.all.oEsa_In.add(oOption);
            document.all.oEsa_Out.options.remove(i);
        }
     }
}


/*
	Funzione richiamata dalla funzione di callback del dwr (cbkJsCheck())
	contenuta nel file check.js
*/
function funzione(nome_campo)
{
	var doc = document.form_esa;
	if(nome_campo == 'cod_esa')
	{
		doc.cod_esa.value = '';
		doc.cod_esa.focus();
	}
	else
	{
		if(nome_campo == 'cod_dec')
		{
			doc.cod_dec_t.value = '';
			doc.cod_dec_t.focus();
		}
		else
		{
			if(nome_campo == 'cod_cup')
			{
				doc.cod_cup.value = '';
				doc.cod_cup.focus();
			}
		}
	}
}


function salva()
{
	var reg = true;
	var doc = document.form_esa; 
	var mancano = '';
	var corpo = '';
	
	if (doc.testa.checked==1)
		corpo = corpo + "A";
	if (doc.collo.checked==1)
		corpo = corpo + "B";
	if (doc.torace.checked==1)
		corpo = corpo + "C";
	if (doc.add_inf.checked==1)
		corpo = corpo + "D"
	if (doc.add_sup.checked==1)
		corpo = corpo + "E"
	if (doc.spalla_dx.checked==1)
		corpo = corpo + "F"
	if (doc.spalla_sx.checked==1)
		corpo = corpo + "G"
	if (doc.avambr_dx.checked==1)
		corpo = corpo + "H";
	if (doc.avambr_sx.checked==1)
		corpo = corpo + "I";
	if (doc.gomito_dx.checked==1)
		corpo = corpo + "L";
	if (doc.gomito_sx.checked==1)
		corpo = corpo + "M";
	if (doc.braccio_dx.checked==1)
		corpo = corpo + "N";
	if (doc.braccio_sx.checked==1)
		corpo = corpo + "O";
	if (doc.polso_dx.checked==1)
		corpo = corpo + "P";
	if (doc.polso_sx.checked==1)
		corpo = corpo + "Q";
	if (doc.coscia_sx.checked==1)
		corpo = corpo + "R";
	if (doc.coscia_dx.checked==1)
		corpo = corpo + "S";
	if (doc.ginocc_dx.checked==1)
		corpo = corpo + "T";
	if (doc.ginocc_sx.checked==1)
		corpo = corpo + "U";
	if (doc.gamba_dx.checked==1)
		corpo = corpo + "V";
	if (doc.gamba_sx.checked==1)
		corpo = corpo + "W";
	if (doc.caviglia_dx.checked==1)
		corpo = corpo + "X";
	if (doc.caviglia_sx.checked==1)
		corpo = corpo + "Y";
		
	doc.hcorpo.value = corpo;
	
	if (doc.tipo(0).checked)
	{
		doc.htipo.value="M";
	} 
	if (doc.tipo(1).checked)
	{
		doc.htipo.value="T";
	}
	if (doc.tipo(2).checked)
	{
		doc.htipo.value="N";
	}
	
	
	var gestione_cdc = filtro_cdc();
	if(gestione_cdc)
		doc.idenCampi.value = getAllOptionCode('selCampiDx');
	else
		doc.idenCampi.value = 'NO GESTIONE CDC';	
	
	/*alert(doc.cod_esa.value);
	alert(doc.descr.value);
	alert(doc.htipo.value);
	alert(corpo);
	alert(doc.metodica.value);
	alert(doc.idenCampi.value);*/
	
	if(doc.mn_doppia_dose.checked == 1)
		doc.hmn_doppia_dose.value = 'S';
	else
		doc.hmn_doppia_dose.value = 'N';
	
	if(doc.cod_esa.value == '' || doc.descr.value == '' || doc.htipo.value == '' || corpo == '' ||
	   doc.metodica.value == '' || doc.idenCampi.value == '')
	{
		if (doc.cod_esa.value == "")
		{
			mancano += '- Codice\n';
		}
		if (doc.descr.value == "")
		{
			mancano += '- Descrizione\n';
		}
		if(doc.htipo.value == '')
		{
			mancano += '- Indicare se l\'esame è richiedibile\n';
		}
	
		if(corpo == '')
		{
			mancano += '- Parti del corpo\n';
		}
		if(doc.metodica.value == '')
		{
			mancano += '- Metodica\n';
		}
		if(gestione_cdc)
		{
			if(doc.idenCampi.value == '')
			{
				 mancano += '- Almeno un centro di costo\n';
			}
		}
	
	alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
	return;
	}
	

	if(!gestione_cdc)
		doc.idenCampi.value = '';
	
	
	if(doc.attivo.checked==1) 
		doc.hattivo.value="N";
	else
		doc.hattivo.value="S";
		
		
	if(doc.mdc_sino.checked == 1) 
		doc.hmdc_sino.value = "S";
	else
		doc.hmdc_sino.value = "N";	
		
	if(doc.esecuzione_obbligatoria.checked == 1) 
		doc.hesecuzione_obbligatoria.value = "S";
	else
		doc.hesecuzione_obbligatoria.value = "N";			
	
	if(doc.esame_di_servizio.checked == 1)
		doc.hesame_di_servizio.value = "S";
	else
		doc.hesame_di_servizio.value = "N";
		

	doc.registrazione.value = reg;
//	alert(reg);return;
	doc.submit(); 
	alert(ritornaJsMsg('a4'));
	chiudi_ins_mod();
}

function check_float()
{
	if(isNaN(document.form_esa.quantita.value))
	{
		alert(ritornaJsMsg('alert_mn'));
		document.form_esa.quantita.value = '';
		document.form_esa.quantita.focus();
		return;
	}
}


$( document ).ready(function() {
	var srtToAppend = "<table cols='2' class='classDataEntryTable'><tr><td width='35%' class='classTdLabelNoWidth'>"
	srtToAppend  += "<label id='lblAttributi'>Attributi separati da virgola (NO spazi), ad esempio: ESEGUIBILE , !INIZIO_CICLO , !FINE_CICLO</label></td><td class='classTdField'>";
	srtToAppend += "<input size='50' name='attributi' id='txtAttributi' maxlength='4000' type='text'></input></td></tr></table>";
	$("#div").append(srtToAppend);
	initAttributi();
});


function initAttributi(){
	try{
		//carico info 
		var myLista = new Array();
		var iden_esa = document.form_esa.iden.value;
		if (iden_esa=="") {return;}
		myLista.push(iden_esa);
		try{rs = opener.top.executeQuery('tab_esa.xml','getInfoEsa',myLista);}catch(e){alert("Errore: getInfoEsa!!!!");return;}		
		if (rs.next()){
			$("#txtAttributi").val(rs.getString("attributi"));
		}
	}
	catch(e){
		alert("initAttributi - Error: " + e.description);
	}
}


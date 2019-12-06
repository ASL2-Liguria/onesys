var hnd_attesa;
function initAppletScan(my_web_user, my_cdc_user){
	
	n_copie=window.showModalDialog('n_fogli.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
	apri_attesa();
	if (isNaN(n_copie)){n_copie = 1;}
	if (parseInt(n_copie)<=0){n_copie = 1;}
	//alert("n_copie: "+ n_copie);
	
			var_risoluzione = "200";
	
	document.write('<applet archive="std/app/AppletScanner.jar,std/app/ojdbc14.jar" name="ScanApp" code=polaris.acquire.JTwainApplet width=1 height=1 mayscript="mayscript" >');
	//document.write('<param name="MAYSCRIPT" value="true" />');
	document.write('<param name="esami_iden" value="' + var_esami_iden + '">');
	document.write('<param name="anag_iden" value="' + var_anag_iden + '">');
	document.write('<param name="descr" value="' + var_descr + '">');
	document.write('<param name="conn_string" value="' + var_conn_string + '">');
	document.write('<param name="risoluzione" value="' + var_risoluzione + '">');
	document.write('<param name="driver" value="' + var_driver + '">');
	document.write('<param name="user" value="' + var_user + '">');
	document.write('<param name="psw" value="password">');
	document.write('<param name="data" value="' + var_data + '">');
	document.write('<param name="file_log" value="0">');
	document.write('<param name="n_file" v alue="' + n_copie + '">');
	document.write('<param name="web_user" value="' + my_web_user + '">');
	document.write('<param name="cdc_user" value="' + my_cdc_user + '">');
	document.write('<param name="iden_tipo_doc" value="' + var_iden_tipo_doc + '">');
	document.write('<param name="scriptable" value="true">');
	
	document.write('<param name="iden_tipo_disciplina" value="' + var_iden_tipo_disciplina + '">');
	document.write('<param name="provenienza" value="' + var_provenienza + '">');
	document.write('<param name="medico_riferimento" value="' + var_medico_riferimento + '">');
	document.write('<param name="altro_medico" value="' + var_altro_medico + '">');
	document.write('<param name="iden_nosologico" value="' + var_iden_nosologico + '">');
	
	/*document.write('<param name="web_user" value="ciao">');
	document.write('<param name="cdc_user" value="boh">');*/
	document.write('</applet>');

}

function destroy_applet(){
	try{
		document.all.ScanApp.stop();
		document.all.ScanApp.destroy;
	}
	catch(e){
		//alert("destroy_applet - Error: " + e.description);
	}
}

//chiamata dalla applet in caso di errore
//quindi viene chiamata chiudi_attesa
function removeLastElementAttached(){
	try{
		//alert("removeLastElementAttached");
		// alert(document.formSalva.Fdescr.value);
		//remove_elem_by_value("idSelDocLoaded", "SCANSIONE " + nScansione);
	}
	catch(e){
		alert("removeElementScanned - Error: "+ e.description);
	}
}



function apri_attesa()
{
	altezza = screen.height;
	largh 	= screen.width;
	hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-300)+ " ,top=" + (altezza/2-100) +",width=200,height=100,statusbar=no");
}

// funzione chiamata in uscita
// dall'applet
// gestire l'eventuale errore di scansione 
// per togliere elemento da listbox
// il parametro value indica idenDoc appena inserito
function chiudi_attesa(value)
{
	//alert("chiudi_attesa "+ value);	
	//alert(window.gbl_iden_anag);alert(parent.Scan.window.gbl_iden_anag); return;
	try{
		// NON posso accedere al document
		// se la chiamata arriva dalla applet!!
		//alert(value);
		if (value=="KO"){
			//try{removeLastElementAttached();}catch(e){alert(e.description);}
			alert("Operazione di scansione interrotta.");
		}
		else{
			parent.Scan.aggiungiElementoScansione(value);
		}

		try{if (hnd_attesa){hnd_attesa.close();	}}catch(e){;}
		try{if (parent.Scan.hnd_attesa){parent.Scan.hnd_attesa.close();	}}catch(e){;}
	}
	catch(e){
		alert("chiudi_attesa - Error: "+ e.description);
	}
	finally{
		parent.Scan.scansioneFinita = true;
	}
}

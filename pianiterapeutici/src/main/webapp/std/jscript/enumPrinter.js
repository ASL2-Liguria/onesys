function carica_combo_printer(oCombo, vSel)
{
	indiceSelezionato = 0;

	if(oCombo != null)
	{
		var WshNetwork = new ActiveXObject("WScript.Network");
		var oPrinters  = WshNetwork.EnumPrinterConnections();
		
		
		for(var i=0; i<oPrinters.Count(); i+=2)
		{
			
			var printer_port = oPrinters.Item(i);
			var printer_name = oPrinters.Item(i+1);
			var oOpt = document.createElement('Option');
			
			oOpt.text = printer_name;
			oOpt.value = printer_name;

			oCombo.add(oOpt);			
			
			if(vSel.replace("\\","") == printer_name.replace("\\",""))
			{
				oCombo.selectedIndex = indiceSelezionato;
			}
			

			indiceSelezionato ++;
		}	

	}
}
 /** Metodo Statico pubblico per la compilazione della funzione JavaScript
     * <B>clickOnData</B>. La funzione <B>Java Script</B> riceve in ingresso il <B>Text
     * Box</B> nel quale si vorrà andare a mettere la data scelta tramite la finestra di
     * gestione del Calendario
     * @return Ritorna una stringa contenente il codice della funzione Java Script <B>clickOnData</B>
	 
	 public static String getClickOnData()
     */    
function clickOnData(objData)
{
	var topW=0;
	var leftW=0;
	
	
	if(objData.disabled==false)
	{
		//Posizionamento Calendario
		topW=window.event.clientY-10;
		if(objData.id=='txtDaData')
		{
			leftW=window.event.clientX-120;
		}
		else
		{
			leftW=window.event.clientX-240;
		}
		hWindow=window.open('calendario.html', 'Calendario', 'TOP='+topW+', LEFT='+leftW+', WIDTH=250, HEIGHT=250');//SL_Calendar
		document.forms('frmCalendar').elements('dataCal').value=objData.value;
		document.forms('frmCalendar').elements('dataObj').value=objData.id;
		document.forms('frmCalendar').submit();
	}
	else
		{
			alert(ritornaJsMsg('MSG_TXTDATADISABLED'));//alert('Text data è disabilitato');
		}
}

/** Metodo Statico pubblico per la compilazione della funzione JavaScript per cambiare l'anno o il mese
    correntemente selezionato dal calendario
     * <B>changeMonth</B>. La funzione <B>Java Script</B> riceve in ingresso due parametri; il primo
     * parametro indica la tabella contenente le informazioni dei giorni, mentre il
     * secondo parametro indica di quanti mesi devo spostare il calendario attuale
     * @return Ritorna una stringa contenente il codice della funzione Java Script <B>changeMonth</B>
*/    
function changeMonth(Calendar, numMonth)
{
	dataCal=new Date(dataCal.getYear(), dataCal.getMonth()+numMonth, 1);
	//alert(dataCal);
	setHeader();
	setCalendar(Calendar);
}

/** Metodo Statico pubblico per la compilazione della funzione JavaScript
     * <B>setHeader</B>. La funzione <B>Java Script</B> modifica l' intestazione del
     * Calendario in base al mese scelto
     * @return Ritorna una stringa contenente il codice della funzione Java Script <B>setHeader</B>
	 
	 public static String getSetHeader()
     */    
function setHeader()
{
	try{
	/*prima riga contenente il mese ed il giorno correntemente selezionato*/
	document.all.CalHead.rows[0].cells[0].innerHTML="<div align='center'><strong>"+extractMonth(dataCal.getMonth()).toUpperCase()+" "+dataCal.getFullYear()+"</strong></div>";

	document.all.CalGest.rows[0].cells[0].innerHTML="<div onClick=\"changeMonth(document.all.CalGiorni, -12)\" onMouseOver=\"changeCursor(this, &quot;pointer&quot;);\" onMouseOut=\"changeCursor(this, &quot;default&quot;);\"><<</div>";
	
	document.all.CalGest.rows[0].cells[1].innerHTML="<div onClick=\"changeMonth(document.all.CalGiorni, -1)\" onMouseOver=\"changeCursor(this, &quot;pointer&quot;);\" onMouseOut=\"changeCursor(this, &quot;default&quot;);\"><</div>";
	
	document.all.CalGest.rows[0].cells[2].innerHTML="<div onClick=\"today()\" onMouseOver=\"changeCursor(this, &quot;pointer&quot;);\" onMouseOut=\"changeCursor(this, &quot;default&quot;);\"><strong>oggi</strong></div>";
	
	document.all.CalGest.rows[0].cells[3].innerHTML="<div onClick=\"changeMonth(document.all.CalGiorni, 1)\" onMouseOver=\"changeCursor(this, &quot;pointer&quot;);\" onMouseOut=\"changeCursor(this, &quot;default&quot;);\">></div>";

	document.all.CalGest.rows[0].cells[4].innerHTML="<div onClick=\"changeMonth(document.all.CalGiorni, 12)\" onMouseOver=\"changeCursor(this, &quot;pointer&quot;);\" onMouseOut=\"changeCursor(this, &quot;default&quot;);\">>></div>";
	}
	catch(e)
	{
		alert(e + ' - Errore in function setHeader()');
	}
}

/** Metodo Statico pubblico per la compilazione della funzione JavaScript
     * <B>hideCalendar</B>. La funzione <B>Java Script</B> controlla la posizione del
     * puntatore del Mouse e se questa cade al di fuori del calendario, allora la
     * funzione <B>Java Script</B> nasconderà automaticamente il calendario
     * @return Ritorna una stringa contenente il codice della funzione Java Script <B>hideCalendar</B>

	public static String getHideCalendar()
     */    
function hideCalendar()
{
	var curElement=window.event.toElement;
	var trovato=false;

	while(curElement.tagName!="BODY" && curElement.tagName!=null)
	{
		if(curElement.id=="MainCalendar")
		{
			trovato=true;
			break;
		}
		curElement=curElement.parentElement;
	}
	if(trovato==false)
	{
		document.all.MainCalendar.style.visibility="hidden";
	}
}


/** Metodo Statico pubblico per la compilazione della funzione JavaScript
     * <B>formatDate</B>. La funzione <B>Java Script</B> riceve in ingresso un parametro contenente
     * l' informazione del giorno del quale si vuole formattare la data; le informazioni
     * del mese e dell' Anno sono prese dalla variabile <B>dataCal</B> del codice <B>Java
     * Script</B>; la funzione <B>Java Script</B> ritornerà la data, eventualmente
     * corretta, in formato <B>GG/MM/AAAA</B>
     * @return Ritorna una stringa contenente il codice della funzione Java Script <B>formatDate</B>
	 
	 public static String getFormatDate()
     */    
function formatDate(giorno)
{
	return formatDateEx(dataCal.getFullYear(), dataCal.getMonth()+1, giorno);
}    



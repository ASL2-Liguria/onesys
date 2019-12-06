/*
 *	Alla fine del caricamento della pagina
 */
$(document).ready(function()
{	
	/*
	 *	Scrive "Maschio" oppure "Femmina"
	 *	a seconda del valore letto da ANAG
	 */
	var sex = $('#sorSesso').val();
	if(sex == "M") $('#sorSesso').before("<label>Maschio</label>");
	else $('#sorSesso').before("<label>Femmina</label>");
	
	/*
	 *	Scrive "Interno" oppure "Esterno"
	 *	a seconda del valore letto da tab_pro
	 */
	var int_ext = $('#sorTipoProvenienza').val();
	if(int_ext == "I") $('#sorTipoProvenienza').before("<label>Interno</label>");
	else $('#sorTipoProvenienza').before("<label>Esterno</label>");

});

function testReadonly()
{
	var readonly = $('#READONLY').val();
	var iden_richiesta = $('#IDEN_RICHIESTA').val();

	if(iden_richiesta == null)
	{
		if(readonly != 'S')
		{
			alert("Esistono già richieste di modifica per questo esame.");
		}
	}
}

function testOpener()
{
	var iden_richiesta = $('#IDEN_RICHIESTA').val();
	var readonly = $('#READONLY').val();
	
	/*	
	 *	Se la pagina viene aperta tramite CONSOLE_ADMIN	(IDEN_RICHIESTA è presente tra i parametri)
	 */
	if((iden_richiesta != null) && (readonly == 'S'))
	{
		//	(2) Viene selezionato il tipo di richiesta (aggiunta una classe css al pulsante relativo)
		var tipoModifica = $('input[name="tipoModifica"]').val();
		$('#valTec'+tipoModifica).parent().addClass("butActive");
		$('.butLevel').css('text-decoration', 'none');
		
		//	(3) Vengono "aperti" i layer relativi alla richiesta (solo il primo o entrambi)
		switch(tipoModifica)
		{
			case '1': case '5':
				set_1e5();
				break;
			case '2': case '4':
				set_2e4();
				break;
			case'3':
				set_3();
				break;
		}
		
		//	(1) Il tasto [Registra] viene nascosto
		$('#lblRegistra').parent().parent().hide();
		
		//	(4) Verifica l'urgenza e modifica la visualizzazione da radio a testo
		var urgenza = $('input[name="radUrgenza"]:checked').val();
		if(urgenza == 1)
		{
			//Urgente
			$('input[name="radUrgenza"]').parent().html("<label id=\"uuu\">URGENTE</label>").css('background','#FE4747').css('color','#fff');
		}
		else
		{
			//Non urgente
			$('input[name="radUrgenza"]').parent().html("<label id=\"uuu\">Non Urgente</label>");
		}
		
	}
	/*	Aperta dalla CONSOLE_ADMIN in modalita' modifica	*/
	else if((iden_richiesta != null) && (readonly != 'S'))
	{
		var tipoModifica = $('input[name="tipoModifica"]').val();
		$('#valTec'+tipoModifica).parent().addClass("butActive");
	
		//	(3) Vengono "aperti" i layer relativi alla richiesta (solo il primo o entrambi)
		switch(tipoModifica){
			case '1': case '5':
				set_1e5();
				break;
			case '2': case '4':
				set_2e4();
				break;
			case'3':
				set_3();
				break;
		}
		
		/*	
		 *	Al click su uno dei pulsanti di scelta del tipo di modifica,
		 *	rimuove la classe "butActive" da tutti i pulsanti e
		 *	aggiunge la classe "butActive" al pulsante cliccato
		 */
		$('.butLevel').click(function(){
			$('.butLevel').removeClass("butActive");
			$(this).addClass("butActive");
			
			//	Modifica il valore del campo hidden tipoModifica con l'ultimo carattere dell'id del pulsante cliccato
			$('input[name="tipoModifica"]').val($(this).children().attr('id').replace("valTec", ""));	
						
			//	Vengono "aperti" i layer relativi al pulsante cliccato (solo il primo o entrambi)
			switch($(this).children().attr('id').replace("valTec", ""))
			{
				case '1': case '5':
					set_1e5();
					break;
				case '2': case '4':
					set_2e4();
					break;
				case'3':
					set_3();
					break;
			}
		});
		
		//	Classe butHover sui pulsanti aggiunta con jQuery perche impossibile farlo tramite css con IE
		$('.butLevel').hover(function(){$(this).addClass('butHover');},function(){$(this).removeClass('butHover');});
	
	}
	/*	
	 *	Se la pagina viene aperta tramite WORKLIST	(IDEN_RICHIESTA NON è presente tra i parametri)
	 */
	else
	{
		/*	
		 *	Al click su uno dei pulsanti di scelta del tipo di modifica,
		 *	rimuove la classe "butActive" da tutti i pulsanti e
		 *	aggiunge la classe "butActive" al pulsante cliccato
		 */
		$('.butLevel').click(function()
		{
			$('.butLevel').removeClass("butActive");
			$(this).addClass("butActive");
			
			//	Modifica il valore del campo hidden tipoModifica con l'ultimo carattere dell'id del pulsante cliccato
			$('input[name="tipoModifica"]').val($(this).children().attr('id').replace("valTec", ""));	
						
			//	Vengono "aperti" i layer relativi al pulsante cliccato (solo il primo o entrambi)
			switch($(this).children().attr('id').replace("valTec", ""))
			{
				case '1': case '5':
					set_1e5();
					break;
				case '2': case '4':
					set_2e4();
					break;
				case'3':
					set_3();
					break;
			}
		});
		
		//	Classe butHover sui pulsanti aggiunta con jQuery perche impossibile farlo tramite css con IE
		$('.butLevel').hover(function(){$(this).addClass('butHover');},function(){$(this).removeClass('butHover');});
		
		//	DEFAULT Stato Richiesta = I (Nuova)
		document.all.statoRich.value="I";
		
		//	DEFAULT Non Urgente
		document.dati.radUrgenza[1].checked = true;
		
		//document.dati.tipoModifica.value = '1';
	}

}
	
function testRegistra()
{
	if(typeof opener.grm_registra != 'undefined')
	{
		opener.grm_registra = true;
	}
		else opener.aggiorna();
}
	
function setObbligatorio(lbl, campo){$("#" + lbl).parent().removeClass("classTdLabel").addClass("classTdLabel_O_O");$("#" + campo).attr("STATO_CAMPO","O").parent().removeClass("classTdField").addClass("classTdField_O_O");}
function setObbligatorioByName(lbl, campo){$("#" + lbl).parent().removeClass("classTdLabel").addClass("classTdLabel_O_O");$('[name="'+campo+'"]').attr("STATO_CAMPO","O").parent().removeClass("classTdField").addClass("classTdField_O_O");}
function setFacoltativo(lbl, campo){$("#" + lbl).parent().removeClass("classTdLabel_O_O").addClass("classTdLabel");$("#" + campo).attr("STATO_CAMPO","E").parent().removeClass("classTdField_O_O").addClass("classTdField");}
function setFacoltativoByName(lbl, campo){$("#" + lbl).parent().removeClass("classTdLabel_O_O").addClass("classTdLabel");$('[name="'+campo+'"]').attr("STATO_CAMPO","E").parent().removeClass("classTdField_O_O").addClass("classTdField");}

//	Obbligatorieta' e layer visibili per i casi "Modifica Anagrafica Paziente" e "Assegnazione Lato errato"
function set_1e5()
{
	setFacoltativo("valDataEsame","rilDataEsame");
	setFacoltativoByName("valDataEsame","valInOraEsame");
	setFacoltativo("valDicom","rilDicom");

	setFacoltativo("valTipoEsame","rilValTipoEsame");
	setFacoltativo("valNSerie","rilValNSerie");
	setFacoltativo("valNImg","rilValNImg");					
	
	ShowLayer('groupPrimoLiv');
	HideLayer('groupSecondoLiv');
}

//	Obbligatorieta' e layer visibili per i casi "Inserimento/Modifica Acc.Numb Esame" e "Cancellazione Immag./Esame/Referto"
function set_2e4()
{
	setObbligatorio("valDataEsame","rilDataEsame");
	setObbligatorioByName("valDataEsame","valInOraEsame");
	setObbligatorio("valDicom","rilDicom");
	
	setFacoltativo("valTipoEsame","rilValTipoEsame");
	setFacoltativo("valNSerie","rilValNSerie");
	setFacoltativo("valNImg","rilValNImg");
	
	ShowLayer('groupPrimoLiv');
	HideLayer('groupSecondoLiv');
}

//	Obbligatorieta' e layer visibili per il caso "Assegnazione Esame a Paziente Diverso"
function set_3()
{
	setObbligatorio("valDataEsame","rilDataEsame");
	setObbligatorioByName("valDataEsame","valInOraEsame");
	setObbligatorio("valDicom","rilDicom");
	
	setObbligatorio("valTipoEsame","rilValTipoEsame");
	setObbligatorio("valNSerie","rilValNSerie");
	setObbligatorio("valNImg","rilValNImg");
					
	ShowLayer('groupPrimoLiv');
	ShowLayer('groupSecondoLiv');
}

/*
Funzione richiamata dalla servlet ParametriRicercaPazPagina che crea la parte di ricerca inserita nel primo frame
della ricerca dei pazienti
*/
/*
function riposiziona_frame_ric_paz()
{
	//alert(parent.document.all.oFramesetRicercaPaziente.rows);
	var frameClose_82 = 49;
	var frameClose_141 = 50;
	var frameClose_110 = 51;
	
	var frameOpen_82= 82;
	var frameOpen_141= 141;
	var frameOpen_110= 110;
    if (parent.document.all.oFramesetRicercaPaziente.rows == "141,*" ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "141,303,*" ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "141,380,*" ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "82,*" ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "110,*" || 
		 parent.document.all.oFramesetRicercaPaziente.rows == "141,*")
		 {
		 	if (parent.document.all.oFramesetRicercaPaziente.rows == "141,*")
					parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",*";
			else
				if(parent.document.all.oFramesetRicercaPaziente.rows == "141,303,*")
					parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",303,*";
					else
					//Caso Riconcilia/Sposta Esami
					if(parent.document.all.oFramesetRicercaPaziente.rows == "141,380,*")
						parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",380,*";
					else
						if(parent.document.all.oFramesetRicercaPaziente.rows == "82,*")
							parent.document.all.oFramesetRicercaPaziente.rows = frameClose_82 + ",*";
						else
							if(parent.document.all.oFramesetRicercaPaziente.rows == "110,*")
								parent.document.all.oFramesetRicercaPaziente.rows = frameClose_110 + ",*";
							else
							//Caso Gestione Ripristino Cancellati
							 	if(parent.document.all.oFramesetRicercaPaziente.rows == "141,*")
									parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",*";
         }
    else
	{
		if (parent.document.all.oFramesetRicercaPaziente.rows == "50,*")
        	parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",*";
			else
				if(parent.document.all.oFramesetRicercaPaziente.rows == "50,303,*")
        			parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",303,*";
				else
					if (parent.document.all.oFramesetRicercaPaziente.rows == "49,*")
        				parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_82 + ",*";
					else
						if (parent.document.all.oFramesetRicercaPaziente.rows == "51,*")
        					parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_110 + ",*";
							else
							//Caso Gestione Ripristino Cancellati
							 	if(parent.document.all.oFramesetRicercaPaziente.rows == "50,*")
									parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",*";
								else
								//Caso Riconcilia/Sposta Esami
							 		if(parent.document.all.oFramesetRicercaPaziente.rows == "50,380,*")
										parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",380,*";
    }
}
*/


function riposiziona_frame_ric_paz()
{
	//alert(parent.document.all.oFramesetRicercaPaziente.rows);
	var frameClose_82 	= 49;
	var frameClose_141 	= 50;
	var frameClose_110 	= 51;
	
	var frameOpen_82	= 82;
	var frameOpen_141	= 141;
	var frameOpen_110	= 110;
	
	var frame_rows = parent.document.all.oFramesetRicercaPaziente.rows;
	var frame_info_esame = frame_rows.split(',');
	frame_info_esame = frame_info_esame[2];
	
	var frame_info_esame_close = 0;
	var frame_info_esame_open  = 0;
	if(frame_info_esame == 200)
	{
		frame_info_esame_open = 200;
		frame_info_esame_close = 200;
	}
	
    if (parent.document.all.oFramesetRicercaPaziente.rows == "141,*,"+frame_info_esame_open ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "141,303,*" ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "141,380,*" ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "82,*,"+frame_info_esame_open ||
		 parent.document.all.oFramesetRicercaPaziente.rows == "110,*,"+frame_info_esame_open || 
		 parent.document.all.oFramesetRicercaPaziente.rows == "141,*")
		 {
		 	if (parent.document.all.oFramesetRicercaPaziente.rows == "141,*,"+frame_info_esame_open)
				parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",*,"+frame_info_esame_close;
			else
				if(parent.document.all.oFramesetRicercaPaziente.rows == "82,*,"+frame_info_esame_open)
					parent.document.all.oFramesetRicercaPaziente.rows = frameClose_82 + ",*,"+frame_info_esame_close;
				else
					if(parent.document.all.oFramesetRicercaPaziente.rows == "110,*,"+frame_info_esame_open)
						parent.document.all.oFramesetRicercaPaziente.rows = frameClose_110 + ",*,"+frame_info_esame_close;				
					else
						if(parent.document.all.oFramesetRicercaPaziente.rows == "141,303,*")
						{
							parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",303,*";
						}
						else
							/*Caso Riconcilia/Sposta Esami*/
							if(parent.document.all.oFramesetRicercaPaziente.rows == "141,380,*")
								parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",380,*";
							else
								/*Caso Gestione Ripristino Cancellati*/
								if(parent.document.all.oFramesetRicercaPaziente.rows == "141,*")
								{
									parent.document.all.oFramesetRicercaPaziente.rows = frameClose_141 + ",*";
								}
         }
    else
	{
		if (parent.document.all.oFramesetRicercaPaziente.rows == "50,*,"+frame_info_esame_close)
        	parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",*,"+frame_info_esame_open;
		else
			if (parent.document.all.oFramesetRicercaPaziente.rows == "49,*,"+frame_info_esame_close)
        		parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_82 + ",*,"+frame_info_esame_open;
			else
				if (parent.document.all.oFramesetRicercaPaziente.rows == "51,*,"+frame_info_esame_close)
        			parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_110 + ",*,"+frame_info_esame_open;
				else
					if(parent.document.all.oFramesetRicercaPaziente.rows == "50,303,*")
        				parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",303,*";
					else
					/*Caso Gestione Ripristino Cancellati*/
						if(parent.document.all.oFramesetRicercaPaziente.rows == "50,*")
							parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",*";
						else
						/*Caso Riconcilia/Sposta Esami*/
							if(parent.document.all.oFramesetRicercaPaziente.rows == "50,380,*")
								parent.document.all.oFramesetRicercaPaziente.rows = frameOpen_141 + ",380,*";
    }
}

/*
	Funzione utilizzata nella GESTIONE DEL MAGAZZINO
*/
function riposiziona_frame_magazzino(righe)
{
	var frameClose = 50;
    if (parent.document.all.oFramesetGesMagazzino.rows == righe + ",*")
	{
    	parent.document.all.oFramesetGesMagazzino.rows = frameClose + ",*";
    }
    else
	{
        parent.document.all.oFramesetGesMagazzino.rows = righe + ",*";
    }
}

/*
	Utilizzata nella Gestione delle Richieste
*/
function riposiziona_frame_righe(righe, nome_frameset, righe_frame_close)
{
	var frameClose = righe_frame_close;
	
	//alert(nome_frameset.rows);
	
	if(nome_frameset.rows == righe + ",*,0" || nome_frameset.rows == righe + ",*,300")
	{
		if(nome_frameset.rows == righe + ",*,0")
			nome_frameset.rows = frameClose + ",*,0";
		else
			nome_frameset.rows = frameClose + ",200,300";
	}
	else
	{
		if(nome_frameset.rows == righe_frame_close + ',*,0' || nome_frameset.rows == righe_frame_close + ',200,300')
		{
			if(nome_frameset.rows == righe_frame_close + ',*,0')
				nome_frameset.rows = righe + ",*,0";
			else
				nome_frameset.rows = righe + ",*,300";
		}
	}
}

var rigaPrecedente = -1;
var colonnaPrecedente = -1;

$(document).ready(function(){
	$('#oTable').each(function(){
		$(this).mouseover(function illumina_cella(event) {
			if(event.target.nodeName === 'TD') {
				var oTd = event.target;
				$(oTd).addClass(oTd.classOrigine + 'Ill');
				$(oTd).removeClass(oTd.classOrigine);
				evidenzia_lite(this, oTd);
			}
		});
		$(this).mouseout(function ripristina_cella(event) {
			if(event.target.nodeName === 'TD') {
				var oTd = event.target;
				ripristina_evidenzia_lite(this, oTd);
				$(oTd).removeClass(oTd.classOrigine + 'Ill');
				$(oTd).addClass(oTd.classOrigine);
			}
		});
	});
	// modifica aldo 29/7/14 - nascondo il campo note 
	try{
	$("textarea[name='txtNote']").each(function(i){
		$(this).hide();
	});
	}catch(e){;}
	
		try{
			var strWhereIden = "";

/*
			$("span[class='refresh']").each(function(i){
				$(this).parent().children(":eq(1)").css("width","100").css("display","block");
			 });*/
			
			$("span[class='refresh']").each(function(i){
				 // inserire query per estrapolare le info del title
				 // se fosse vuoto non mettere icona
				 var idenSal = "";
				 idenSal = $(this).attr("onClick").toString().split("dettaglio_orario('")[1].split(",")[0].replace("'","");
				if (strWhereIden==""){
					strWhereIden = idenSal;
				}
				else{
					strWhereIden += "," + idenSal;
				}
			});
			if (strWhereIden!=""){
				var rs = top.executeQuery('tab_sal.xml','getInfoSale',[strWhereIden]);
				while (rs.next()){
					if (rs.getString("note") !=""){
						$("span[class='refresh']").each(function(i){
							if ( $(this).attr("onClick").toString().split("dettaglio_orario('")[1].split(",")[0].replace("'","") == rs.getString("iden")){
								$(this).parent().prepend("<span class='infoSala' title='" + rs.getString("note")  + "'></span>");		 											  
							}
						});
					}
				}
			}
	}catch(e){;}
	
});


function evidenzia_lite(table, oTd) {
	var riga = oTd.parentElement.sectionRowIndex;
	var colonna = oTd.cellIndex;
	$(table.rows[riga].cells[0]).addClass("TestataEvidenziata");
	$(table.rows[0].cells[colonna]).addClass("TestataEvidenziata");
	try{parent.evidenzia_titolo(oTd);}
	catch(e){
		try{evidenzia_titolo(oTd);}catch(e){alert("boh");}
	}
}

function ripristina_evidenzia_lite(table, oTd) {
	var riga = oTd.parentElement.sectionRowIndex;
	var colonna = oTd.cellIndex;
	$(table.rows[riga].cells[0]).removeClass("TestataEvidenziata");
	$(table.rows[0].cells[colonna]).removeClass("TestataEvidenziata");
}

/**
 * Attualmente non usato
 * @param riga
 * @param colonna
 */
function evidenzia(riga, colonna)
{
	sel_riga(riga-1, colonna);
	sel_colonna(document.all.oTable.rows[riga], colonna-1);
	
	rigaPrecedente = riga;
	colonnaPrecedente = colonna;
}


function sel_riga(r, c)
{
	try
	{
		if(document.all.oTable.rows[r].cells.length>1)
		{
			var cella = document.all.oTable.rows[r].cells[c];
			if(!$(cella).hasClass(cella.classOrigine + 'Sel') && r>0) // cella.className.indexOf('Sel')<0 && -- 
			{
				$(cella).removeClass(cella.classOrigine);
				$(cella).addClass(cella.classOrigine + 'Sel');// = 'classTdCellSecSelect';
				return r>0 ? sel_riga(--r, c):0;
			}
			else
			{
				return 0;
			}
		}
		else
		{
			return r>0 ? sel_riga(--r, c):0;
		}
	}
	catch(ex){}
}

function sel_colonna(riga, c)
{
	try
	{
	
		if(riga.cells.length>1)
		{
			var cella = riga.cells[c];
			if(!$(cella).hasClass(cella.classOrigine + 'Sel') && c>0) //cella.className.indexOf('Sel')<0  --  
			{
				$(cella).removeClass(cella.classOrigine); 
				$(cella).addClass(cella.classOrigine + 'Sel');// = 'classTdCellSecSelect';
				return c>0 ? sel_colonna(riga, --c):0;
			}
			else
			{
				return 0;
			}
		}
		else
		{
			return c>0 ? sel_colonna(riga, --c):0;
		}
	}
	catch(ex){}
}

/**
 * Attualmente non usato
 */
function ripristina_evidenzia()
{
	desel_riga(rigaPrecedente, colonnaPrecedente);
	desel_colonna(document.all.oTable.rows[rigaPrecedente], colonnaPrecedente);
}

function desel_riga(r, c)
{
	if(document.all.oTable.rows[r].cells.length>1 && c>0)
	{
		var cella = document.all.oTable.rows[r].cells[c];
		var classOrigine = cella.classOrigine;
		classOrigine = (typeof classOrigine == 'undefined') ? '' : classOrigine;
		$(cella).removeClass(classOrigine + 'Sel');
		$(cella).addClass(classOrigine);
	}
	return r>0 ? desel_riga(--r, c):0;
}

function desel_colonna(riga, c)
{
	if(riga.cells.length>1 && c>0)
	{
		var cella = riga.cells[c];
		var classOrigine = cella.classOrigine;
		classOrigine = (typeof classOrigine == 'undefined') ? '' : classOrigine;
		$(cella).removeClass(classOrigine + 'Sel');
		$(cella).addClass(classOrigine);
	}
	return c>0 ? desel_colonna(riga, --c):0;
}

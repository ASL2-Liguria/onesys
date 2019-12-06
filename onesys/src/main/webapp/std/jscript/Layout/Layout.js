$(document).ready(
function()
{
	
	try
	{
		
		//	TEMPORANEO
		top.opener.close();
		
		
		top.opener.chiudiHomepage();
	}catch(e){}
				
	$('li.title a').click
	(
		function(e)
		{
			var subMenu  = $(this).parent().next();
			var spanMenu = $(this).find('span:id<>keepIcon');
			var car 	 = $(this).find("span").html();
			
			$('span.menuPlus').html('+');
			$('.sub-menu').not(subMenu).slideUp(200);
				
			if(car == '-')
			{
				subMenu.slideUp(200);
			}
			else
			{
				$(this).find("span").html("-");
				subMenu.slideDown(200);
			}
		}
	);
	
	$(".addTab").click(function()
	{
		//	aggiunge un tab
		var link = $(this).find("a").attr("href");
		var descr = $(this).find("a").html();
		var cod = $(this).attr("cod");
		addBarTab(link, descr, cod);
	});
	
	handlerTab();
		
	window.onunload = logout;
});

//	handler per gli eventi sui tab
function handlerTab()
{
	//	visibilita simbolo di chiusura tab sul hover
	$(".rto").hover(function()
	{
		$(this).removeClass("rto").addClass("rth");
	}
	,function()
	{
		$(this).removeClass("rth").addClass("rto");
	});
	
	//	Click sul simbolo di chiusura tab
	$(".rto").click(function()
	{
		removeTab($(this));
	});
	
	//	Click su un tab
	//	Lo rende attivo aggiungendo la classe tabActive
	$("#ulTabs li").click(function()
	{
		if(!$(this).hasClass("tabActive"))
		{
			$(".tabActive").removeClass("tabActive");
			$(this).addClass("tabActive");
		}
	});
	
	//	Sortable
	$("#ulTabs").sortable(
	{ 
		axis	: 'x',
		handle	: '.h',
		items	: 'li',
		tolerance: 'pointer'
	});
	
}

//	aggiunge un tab nella tabsBar se non esiste gia'
function addBarTab(link, descr, cod)
{
	//	TO DO controllare num max di tab visibili

	//alert($('[codTab="' + cod + '"]').html());
	if($('[codTab="' + cod + '"]').html() == null)
	{
		$(".tabActive").removeClass("tabActive");
		$("#ulTabs").prepend('<li codTab="' + cod + '" class="tabActive"><a class="h" href="' + link + '">' + descr + '</a><span class="rto"></span></li>');
		handlerTab();
	}
	else
	{
		$(".tabActive").removeClass("tabActive");
		$('[codTab="' + cod + '"]').addClass("tabActive");
	}
}

//	rimuove un tab dalla tabsBar
function removeTab(tab)
{
	$(tab).parent().remove();
}

function expand_menu()
{
	if($('#divMenu').hasClass('clsMenuFrame'))
	{
		apriVerticalMenu();	
	}
	else
	{
		chiudiVerticalMenu();
		$("#lay").remove();
	}
}

function chiudiVerticalMenu()
{
	if($('#divMenu').hasClass('clsMenuFrameExpand'))
	{
		$('span.menuPlus').html('+');
		$('.sub-menu').hide();
		$('#divMenu').removeClass('clsMenuFrameExpand');
		$('#divMenu').addClass('clsMenuFrame');
	}
}

function apriVerticalMenu()
{
	$('#divMenu').removeClass('clsMenuFrame');
	$('#divMenu').addClass('clsMenuFrameExpand');
	
	var divlay = '<div id="lay"></div>';
	$(body).append(divlay);
	
	$("#lay").click(function()
	{
		chiudiVerticalMenu();
		$("#lay").remove();
	});
}

function apri(valore)
{
	var url = 'blank';
	var k = "servletGenerator?KEY_LEGAME=";
	
	switch(valore)
	{
		case 'wk_elettromedicali':
			url = k+"FILTRO_WK_ELETTROMEDICALI";
			break;
			
		case 'wk_ditte':
			url = k+"FILTRO_WK_DITTE";
			break;
			
		case 'wk_personale':
			url = k+"FILTRO_WK_PER";	
			break;
			
		case 'wk_contratti':
			url = k+"FILTRO_WK_CONTRATTI";
			break;
			
		case 'wk_reparti':
			url = k+"FILTRO_WK_REPARTI";	
			break;
			
		case 'wk_sede_geo':
			url = k+"FILTRO_WK_SEDE_GEO";
			break;
			
		case 'wk_presidi':
			url = k+"FILTRO_WK_PRESIDI";
			break;
		
		case 'wk_unita_oper':
			url = k+"FILTRO_WK_UNITA_OPER";	
			break;
			
		case 'wk_generale':
			url = k+"FILTRO_WK_GENERALE";
			break;
			
		case 'visualizzatoreCartelle':
			url = k+"VISUALIZZATORE";
			break;
		
		case 'wk_manutenzioni':
			url = k+"FILTRO_WK_MANUTENZIONI";
			break;			
			
		case 'wk_ricambi':
			url = k+"FILTRO_WK_RICAMBI";
			break;
			
		case 'wk_magazzini':
			url = k+"FILTRO_WK_MAGAZZINI";
			break;
			
		case 'wk_movimenti':
			url = k+"FILTRO_WK_MOVIMENTI";
			break;
			
		case 'wk_causali':
			url = k+"FILTRO_WK_CAUSALI";
			break;				
				
		default:
			alert("defaultvertical link");

	}
	
	//document.apriAttesa('Caricamento in corso...', true);
	
	chiudiVerticalMenu();
	
	$("#lay").remove();	//	Rimuove layer 100% per click su tutta la pagina
	
	
	
	aggiornaLoadOnStartUp(url);
	
	$('#oIFWork').attr('src', url);
}

//	Aggiorna la colonna LOADONSTARTUP in CONF_WEB
function aggiornaLoadOnStartUp(url)
{
	var query = "update CONF_WEB set LOADONSTARTUP = '" + url + "' where WEBUSER = '" + baseUser.LOGIN + "'";

	dwr.engine.setAsync(false);	
	toolKitDB.executeQueryData(query, null);
	dwr.engine.setAsync(true);	
}

var logged_out = false;
function logout(_modalita)
{
	if(!logged_out)
	{
		logged_out = true;
		
		var _modalita = "" + _modalita;
		top.location.replace ("logout?MODALITA=" + _modalita);
	}
}

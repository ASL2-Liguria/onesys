$(function() {
	RIEPILOGO_WRAPPER.init();
});

var RIEPILOGO_WRAPPER = {
		
		$divBtn		: $("#divBtn"),
		$divContent	: $("#divContent"),
		
		init: function() 
		{
			home.RIEPILOGO_WRAPPER = this;
			RIEPILOGO_WRAPPER.createButtons();
			RIEPILOGO_WRAPPER.setLayout();
			RIEPILOGO_WRAPPER.$divBtn.find("span:first").click();
		},
		
		createButtons: function() 
		{
			var arConfig = home.baseGlobal["RIEPILOGO_WRAPPER"].split(",");
			for ( var i=0; i < arConfig.length; i++ ) 
			{
				var conf = CONFIG[arConfig[i]];
				var btn = $("<span/>", {src : conf.src }).on("click", RIEPILOGO_WRAPPER.setFrame ).text(conf.text);

				RIEPILOGO_WRAPPER.$divBtn.append(btn);
			}
		},
		
		setFrame: function() 
		{
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			$("#iContent").attr("src", $(this).attr("src") + home.NS_MMG.getCommonParameters() );
		},
		
		setLayout: function() 
		{
			home.RIEPILOGO.setLayout( $('#IDFRAME').val() );
			$("#divContent").height( $(document).height() - $("#divBtn").outerHeight());
		},
		
		getContentHeight: function()
		{
			return RIEPILOGO_WRAPPER.$divContent.innerHeight() - 50;
		}
};

var CONFIG = {
		
	"FARMACI" : 
	{
		src		 	: "page?KEY_LEGAME=TAB_RR_FARMACI",
		title		: "Prescrizione farmaci",
		text 		: "Farmaci"
	},
	"ACCERTAMENTI" :
	{
		src 		: "page?KEY_LEGAME=TAB_RR_ACCERTAMENTI",
		title		: "Prescrizione accertamenti",
		text 		: "Accertamenti"
	},
	"PROBLEMI" :
	{
		src 		: "page?KEY_LEGAME=RIEP_ACCESSI_PROBLEMI",
		title		: "Problemi",
		text 		: "Problemi"
	},
	"RILEVAZIONI_PLS" :
	{
		src 		: "page?KEY_LEGAME=RIEPILOGO_RILEVAZIONI_PLS",
		title		: "Rilevazioni",
		text 		: "Rilevazioni"
	},
	"ANAGRAFICA" :
	{
		src 		: "page?KEY_LEGAME=SCHEDA_ANAGRAFICA_MMG&LAYOUT=EMBEDDED",
		title		: "Anagrafica",
		text 		: "Anagrafica"
	}
};
NS_VACCINAZIONI={
		init: function(){
			
			$("select[name='ComboVaccinazioniOut']").parent().addClass("divTo");
			$("select[name='ComboVaccinazioniIn']").parent().addClass("divFrom");
			if(parent.$("select[name='cmbVaccinazioniResult']").find("option").length){
				var ritornoHTML=parent.$("select[name='cmbVaccinazioniResult']").html();
				$("select[name='ComboVaccinazioniOut']").html(ritornoHTML);
			}

			
		},
		setEvents: function(){
		},
		MyCreaButton: function(){
			$(".buttons").find("a").remove();
			$(".buttons").append(MyButtons());
		}
};

$(document).ready(function(){
	NS_VACCINAZIONI.init();
	NS_VACCINAZIONI.setEvents();
});

function MyButtons(){
	var buttons=[];
	buttons.push($("<a/>").attr({href:"#",id:"idButAddOne"}).addClass("button").append($("<span/>").attr({class:"butAddOne"}).html("&#x25BC")));
	buttons.push($("<a/>").attr({href:"#",id:"idButRemoveOne"}).addClass("button").append($("<span/>").attr({class:"butRemOne"}).html("&#x25B2")));
	buttons.push($("<a/>").attr({href:"#",id:"idButRemoveAll"}).addClass("button").append($("<span/>").attr({class:"butRemAll"}).html("Rimuovi Tutti")));
	return buttons;
}



/*
 * Linkare dopo NS_FENIX
 */
$(document).ready(function() {
	NS_OFFLINE_ALL.init();
	NS_OFFLINE_ALL.setEvents();
	
});

var NS_OFFLINE_ALL = {
	
	init: function() {
		
		var hash = window.location.hash;
		if (hash.length > 0) {
			var ar = hash.substr(1).split("&");
			for (var i=0; i < ar.length; i++) {
				var par = ar[i].split("=");
				var input = '<input name="' + par[0] + '" type="hidden" value="' + par[1] + '" id="' + par[0] + '">';
				$("#EXTERN").append(input);
			}
		}
	},
	
	setEvents: function() {
	},
	
	buttonSelect: function(elemento) {
		elemento.addClass("offline_button_selected").append("<i class='icon-ok' style='color:green'></i>");
	},
	
	buttonDeselect: function(elemento) {
		elemento.removeClass("offline_button_selected");
		elemento.find("i.icon-ok").remove();
	},
	
	buttonSwitch: function(elemento) {
		if(elemento.hasClass("offline_button_selected")) {
			NS_OFFLINE_ALL.buttonDeselect(elemento);
			return false;
		} else {
			NS_OFFLINE_ALL.buttonSelect(elemento);
			return true;
		}
	}
};

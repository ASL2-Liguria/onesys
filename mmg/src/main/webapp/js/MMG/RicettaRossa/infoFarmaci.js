$(document).ready(function () {
	INFO_FARMACI.init();
	INFO_FARMACI.setEvents();
});

var INFO_FARMACI = {
	
	init: function () {
		$(".lettura").attr('readonly', true);
		$("textarea").attr('readonly', true);
	},
	
	setEvents: function () {
	},
};


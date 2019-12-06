(function ($) {
	function isValid(n) {
		return typeof n !== 'undefined' && n !== null;
	}

	function ToF(o) {
		//alert(o+"-"+(o==="S" || o==="Y"));
		if (typeof (o) == "boolean")
			return o;
		return o === "S" || o === "Y" || o === "true" || o === "YES";
	}

	function getPos(el, e) {
		var _pageX = parseInt(e.pageX);
		var _pageY = parseInt(e.pageY);
		var _left = 0;
		var _top = 0;
		var el_w = $(el).outerWidth();
		var el_h = $(el).outerHeight();
		var doc_w = $(document).width();
		var doc_h = $(document).height();
		_left = ((_pageX + el_w) < doc_w) ? _pageX : _left = (_pageX - el_w);
		((_pageY + el_h) < doc_h) ? _top = _pageY : _top = (_pageY - el_h);
		((_pageY + el_h) > doc_h && (_pageY - el_h) < 0) ? _top = ((doc_h - el_h) / 2) : null;
		var pos = {
			'left': _left,
			'top': _top
		};
		return pos;
	}

	function getSubPos(e, menu, sub_menu) {
		var pos = {}, menu_offset, menu_l, menu_t, menu_w, menu_h, sub_menu_h, sub_menu_w, doc_w, doc_h;
		menu_offset = menu.offset();
		menu_l = menu_offset.left;
		menu_t = menu_offset.top;
		menu_w = menu.outerWidth();
		menu_h = menu.outerHeight();
		sub_menu_h = sub_menu.outerHeight();
		sub_menu_w = sub_menu.outerWidth();
		doc_w = $(document).width();
		doc_h = $(document).height();
		((menu_l + menu_w + sub_menu_w) < doc_w) ? pos.left = menu_w - 2 : pos.left = (-menu_w);
		(parseInt(e.pageY) + sub_menu_h > doc_h) ? pos.top = (-sub_menu_h) : pos.top = 0;
		return pos;
	}

	$.ContextMenu = function () {
		var cm = null;
		cm = {
			structure: null,
			setting: null,
			SETTINGS_MODE: false, //flag
			div: $('<div/>').addClass('contextMenu'),
			ul: $("<ul/>").addClass("cMenu"),
			createHeaderTitle: function (text, settingIcon) {

				var header = (text != null || text != "") ? $("<p/>").addClass("Separator SeparatorHead").html(cm.checkTranslate(text)) : null;

				if (header != null && ToF(settingIcon))//controllo se devo aggiungere l'icona per il setting
					header.append(cm.createSettingsIconEvent());

				return header;
			},
			createSettingsIconEvent: function () {
				return $("<i>").addClass("icon-cog").on("click", function (e) {
					if (!cm.SETTINGS_MODE) {
						cm.SETTINGS_MODE = true;
						e.stopPropagation();
						cm.closeSubMenu();
						cm.loadInSettings(cm.ul);
					} else {
						cm.SETTINGS_MODE = false;
						cm.unloadInSettings(cm.ul);
					}
				});
			},
			createSeparator: function (text) {
				var sep = (text == null || text == "") ? $("<p/>").addClass("SeparatorEmpty") : $("<p/>").addClass("Separator").html(text);
				return sep;
			},
			createSub_ul: function () {
				return $("<ul/>").addClass("subMenu");
			},
			createItem: function (v) {
				var text = cm.checkTranslate(v.output);
				var li = $("<li/>").attr("id", v.id);
				if (isValid(v["class"])) {
					li.addClass(v["class"]);
				}
				var a = $("<a/>").append(text);
				if (isValid(v.url_image)) {
					$("<img/>", {"src": v.url_image}).prependTo(a);
				}
				if (isValid(v.icon_class)) {
					$("<span/>", {"class": v.icon_class}).prependTo(a);
				}
				if (isValid(v.process)) {
					a.append(v.process(v));
				}
				return li.append(a);
			},
			createInfoMenuEmpty: function (v) {
				var text = cm.checkTranslate(v.output);
				return $("<li/>").css({"padding": "5px"}).attr("id", v.id).append(text);
			},
			removeInfoMenuEmpty: function () {
				cm.ul.find("li#mEmpty").remove();
			},
			hideItem: function (el) {
				if (isValid(el)) {
					el.hide();
				}
				;

			},
			disableItem: function (el, info) {
				if ($(".cmPlus", el).length > 0) {
					$(".cmPlus", el).remove();
					$("a", el).unbind(cm.setting.openSubMenuEvent); //DA RIVEDERE!!!!
				} else {
					$("a", el).unbind("click"); //DA RIVEDERE!!!!
					$("a", el).bind("click", function (e) {
						e.preventDefault();
						e.stopImmediatePropagation();
					});
				}
				$("a", el).addClass("Disabled").attr("title", info);
				if ($("i", el).length == 0) {
					$(el).prepend($("<i/>").addClass("icon-info-circled").attr("title", info));
				}
			},
			enableItem: function (el, v, rig) {

				if (isValid(v.list)) {
					cm.addPlus(el);
				}
				else {
					cm.createItemEvent(el, v, rig);
				}
				$("a", el).removeClass("Disabled").removeAttr("title");
				$("i.icon-info-circled", el).remove();
				$(el).show();

			},
			enableItemSettingsMode: function (el, v) {
				$("a", el).removeClass("Disabled");
				if (isValid(v.list)) {
					$(".cmPlus", el).remove();
					$("a", el).unbind(cm.setting.openSubMenuEvent); //DA RIVEDERE!!!!
					$("a", el).bind("click", function (e) {
						return false;
					});
				}
				else {
					$("a", el).unbind("click"); //DA RIVEDERE!!!!
					$("a", el).bind("click", function (e) {
						return false;
					});
				}
				$("i.icon-info-circled", el).remove();
				$(el).show();

			},
			addPlus: function (el) {
				if ($(".cmPlus", el).length > 0) {
					$(".cmPlus", el).html("+");

				}
				else {
					el.prepend($("<span/>").addClass("cmPlus").html("+"));

					el.bind(cm.setting.openSubMenuEvent, function (e) {
						e.preventDefault();
						e.stopImmediatePropagation();
						if ($(".cmPlus", this).html() == "+") {
							cm.closeSubMenu();
							$(".cmPlus", this).html("-");
							$("a", this).eq(0).addClass("cmItemActive");
							$(el).children("ul").css(getSubPos(e, $(this).parent(), $(el).children("ul")));
							$(el).children("ul").show();
						}
						else {
							$(".cmPlus", this).html("+");
							$("a", this).eq(0).removeClass("cmItemActive");
							$(el).children("ul").hide();
						}
					});
				}


			},
			checkTranslate: function (text) {
				var descrizione;

				try {
					descrizione = eval(text);
					if (!descrizione)
						descrizione = "-- undefined --";
				} catch (ex) {
					descrizione = "-- undefined --";
				}
				return descrizione;
			},
			closeSubMenu: function () {
				$(".subMenu").hide();
				$(".cmItemActive").removeClass("cmItemActive");
				$(".cmPlus").html("+");
			}, //chiude tutti i sottoMenu
			createItemEvent: function (el, v, rig) {
				$("a", el).unbind("click");
				/*PRECAUZIONE*/
				$("a", el).bind("click", function (e) {
					typeof (v.link(rig, cm.evnt));
					cm.close();
				});
			}, //crea l'evento al click sull' Item
			addESCEvent: function () {
				$("body").bind("keyup", function (event) { //aggunge l'evento alla pressione del tasto ESC che chiude il Menu
					var code = (event.keyCode ? event.keyCode : event.which);
					(code == 27) ? cm.close() : null;
				});
			},
			itemOverEvent: function (el) {
				el.bind("mouseover", cm.closeSubMenu);
			}, //evento al mouseover su un Item (esclusi i launcher ai sottoMenu e i sottoMenu)
			close: function () {
				if (cm.SETTINGS_MODE) {
					cm.SETTINGS_MODE = false;
					cm.unloadInSettings(cm.ul);
				} //se sono in modalita settings la tolgo!
				cm.div.hide();
				cm.closeSubMenu();
			},
			show: function (pos) {
				cm.div.css(getPos(cm.div, pos)).show();
			},
			open: function (e, rig) {
				cm.test(e, rig);
			},
			test: function (e, rig) {
				cm.evnt = e;
				cm.close();
				//alert(JSON.stringify(rig));
				cm.controlWhere(rig);
				cm.div.css(getPos(cm.div, e)).show();
				//$(document).on('click',cm.close);
				$('body').bind('click', function () {
					cm.close();
				});
			},
			controlWhere: function (rig) {
				//alert(ul.children("li").length);
				var li = cm.ul.children("li");
				var el_count = cm.structure.length;
				$.each(cm.structure, function (k, v) {
					//alert(rig.STATO+"--"+v.where(rig));
					//alert(isValid(v.enable) && v.enable==false);
					if (isValid(v.enable) && !ToF(v.enable)) {//se esiste enable ed e false nascondo l'elemento
						cm.hideItem(li.eq(k));
						el_count--;
					}
					else {
						if (isValid(v.where)) {
							if (!v.where(rig)) {
								if (ToF(v.concealing)) {
									cm.hideItem(li.eq(k));
									el_count--;

								} else
									cm.disableItem(li.eq(k), v.info);
							} else {
								//alert("abilito");
								cm.enableItem(li.eq(k), v, rig);
								cm.controlSubMenuWhere(rig, v, k);
							}
						}
					}
					if (el_count == 0) {
						if (cm.ul.find("li#mEmpty").length == 0)
							cm.ul.append(cm.createInfoMenuEmpty({"id": "mEmpty", "output": "traduzione.menuVuoto"}));
					} else {
						cm.removeInfoMenuEmpty();
					}
				});
			}, //-End controlWhere
			controlSubMenuWhere: function (rig, v, k) {
				if (isValid(v.list)) {
					//alert(ul.children("li").eq(k).find("li").length);
					var sub_li = cm.ul.children("li").eq(k).find("li");
					$.each(v.list, function (k, v) {
						if (isValid(v.enable) && !ToF(v.enable)) {//se esiste enable ed e false nascondo l'elemento
							cm.hideItem(sub_li.eq(k));
						}
						else {
							if (isValid(v.where) && !v.where(rig)) {
								(v.concealing) ? cm.hideItem(sub_li.eq(k)) : cm.disableItem(sub_li.eq(k), v.info);
							} else {
								//alert("abilito"););
								cm.enableItem(sub_li.eq(k), v, rig);
							}
						}
					});
				}
			},
			loadInSettings: function (ul) {
				cm.removeInfoMenuEmpty();
				var li = ul.children("li");
				$.each(cm.structure, function (k, v) {
					cm.enableItemSettingsMode(li, v);
					if (isValid(v.enable) && !ToF(v.enable)) {
						li.eq(k).prepend($("<i>").addClass("icon-check-empty iconSettingMode").bind("click", function (e) {
							v.enable = true;
							e.stopPropagation();
							cm.changeItemSetting(li.eq(k));
						}));
					} else {
						li.eq(k).prepend($("<i>").addClass("icon-check-1 iconSettingMode").bind("click", function (e) {
							v.enable = false;
							e.stopPropagation();
							cm.changeItemSetting(li.eq(k));
						}));
					}
				});
			},
			unloadInSettings: function (ul) {
				var li = ul.children("li");
				$.each(cm.structure, function (k, v) {
					li.eq(k).find("i.iconSettingMode").remove();
				});
			},
			changeItemSetting: function (li) {

				if ($("i.iconSettingMode", li).hasClass("icon-check-empty")) {
					$("i.iconSettingMode", li).removeClass("icon-check-empty");
					$("i.iconSettingMode", li).addClass("icon-check-1");
					this.saveMenuConfiguration(li.attr("id"), "S");
				} else {
					$("i.iconSettingMode", li).removeClass("icon-check-1");
					$("i.iconSettingMode", li).addClass("icon-check-empty");
					this.saveMenuConfiguration(li.attr("id"), "N");
				}

			},
			saveMenuConfiguration: function (id_item, enable) {
				//alert(cm.id)(id_item)(enable);
				toolKitWK.saveVisibleMenu(cm.id, id_item, enable,"", function (response) {
				});
			}
		};
		return cm;
	},
			$.createContextMenu = function (obj, cfg, options) {
				var defaults = {
					openSubMenuEvent: "click",
					openInfoEvent: "click",
					closeWithESC: true
				};
				var setting = $.extend({}, defaults, options);
				if (isValid($(obj).data('cmPlugin'))) {
					return cm = $(obj).data('cmPlugin');
				}
				var CMenu = $.ContextMenu();
				CMenu.setting = setting;
				CMenu.structure = cfg.menu.structure.list;
				CMenu.div.bind("contextmenu", function () {
					return false;
				}); //Tolgo l'evento contextmenu all'interno del menu
				CMenu.ul.attr("id", cfg.menu.id);
				CMenu.id = cfg.menu.id;
				CMenu.ul.append(CMenu.createHeaderTitle(cfg.menu.title, true));
				$.each(cfg.menu.structure.list, function (k, v) {
					var li = CMenu.createItem(v);
					if (isValid(v.list)) {
						CMenu.addPlus(li, setting);
						var sub_ul = CMenu.createSub_ul();
						sub_ul.append(CMenu.createHeaderTitle(v.output, false));
						$.each(v.list, function (k, v) {
							var sub_li = CMenu.createItem(v);
							sub_ul.append(sub_li);
							CMenu.createItemEvent(sub_li, v, null);
							if (isValid(v.separator) && v.separator == true)
								sub_ul.append(CMenu.createSeparator());
						});
						//alert(sub_ul.html());
						li.append(sub_ul);
					} else {
						CMenu.createItemEvent(li, v, null);
						CMenu.itemOverEvent(li);
					}
					CMenu.ul.append(li);
					if (isValid(v.separator) && ToF(v.separator))
						CMenu.ul.append(CMenu.createSeparator());
				});
				CMenu.div.append(CMenu.ul);
				(setting.closeWithESC) ? CMenu.addESCEvent() : null;
				obj.CMenu = CMenu;
				$(obj).data('cmPlugin', CMenu);
				$('body').append(CMenu.div);
				return CMenu;
			};

	$.fn.extend({
		contextMenu: function (cfg, p_cfg) {
			return $.createContextMenu(this, cfg, p_cfg);
		}
	});
})(jQuery);

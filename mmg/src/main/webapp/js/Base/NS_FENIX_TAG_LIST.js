var NS_FENIX_TAG_LIST = {
	
	prevSelection: null,
	
	objCheckBox:null,
	
    setEvents: function ()
    {
        $(".tdLabelTags").not(".tagList").on("click", NS_FENIX_TAG_LIST.apriTagList);

        $(".closeTags").click(NS_FENIX_TAG_LIST.chiudiTagList);
        $(".tagList").on("click", function (e) {
            e.stopPropagation();
            NS_FENIX_TAG_LIST.chiudiTagList();
        });

        $(".tagListDiv").on("click", function (e) {
            e.stopPropagation();
        });

        Mousetrap.bind('esc', function () {
            NS_FENIX_TAG_LIST.chiudiTagList();
            return false;
        });

        $(".okTags").on("click", NS_FENIX_TAG_LIST.applicaTagList);
        $(".selAllTags").on("click", NS_FENIX_TAG_LIST.selectAll);
        $(".deselAllTags").on("click", NS_FENIX_TAG_LIST.deselectAll);
    },

    selectAll: function ()
    {
        var idBut = $(this).attr("id");
        var idCheck = idBut.split("@")[0];
        $("#" + idCheck).data("CheckBox").selectAll();
    },

    deselectAll: function ()
    {
        var idBut = $(this).attr("id");
        var idCheck = idBut.split("@")[0];
        $("#" + idCheck).data("CheckBox").deselectAll();
    },

    descrTagList: function ()
    {
        var id = $(this.obj).attr("id");
        var descr = $("#" + id).data("CheckBox").descr();
        $("[data-tag-descr='" + id + "']").val(descr).attr("title", descr);
    },

    applicaTagList: function (params)
    {
        var idTag = $(this).attr("id").split("@")[0];

        var descr = $("#" + idTag).data("CheckBox").descr();
        $("[data-tag-descr='" + idTag + "']").val(descr);

        $(".tagList").hide();

        if($("input[name='" + idTag + "']").attr("data-filtro-applica")=="S" && NS_FENIX_TAG_LIST.checkApplicaFiltro())
        {
            var params = (typeof params != 'undefined') ? params : {};
            params = NS_FENIX_TAG_LIST.beforeApplica(idTag, params);
            NS_FENIX_FILTRI.applicaFiltri(params);
            NS_FENIX_TAG_LIST.afterApplica(idTag, params);
        }
    },
    
    checkApplicaFiltro: function()  /*ridefinire per eseguire controlli prima di chiamare applicaFiltri, ad es. nelle wk*/
    {
    	return true;
    },

    beforeApplica: function (idTag, params)
    {
        return params;
    },
    afterApplica: function (idTag, params)  /*ridefinire per utilizzare*/
    {
        return;
    },
    apriTagList: function (e)
    {
        e.stopPropagation();
        
        var tagList = $(".tagList", this);
        tagList.show();
        var tagListDiv = tagList.find(".tagListDiv");
        var hBody = $("body").innerHeight();
        var cDiv = tagListDiv.find(".contentDiv");
        if(hBody < 600){
            cDiv.css({"max-height": hBody*0.85 });
        }
        tagListDiv.css("margin-top",0);
        tagListDiv.css("margin-top",(hBody-tagListDiv.height())/2);
        
        NS_FENIX_TAG_LIST.objCheckBox = cDiv.find(".CheckBox").data("CheckBox");
	    NS_FENIX_TAG_LIST.prevSelection = NS_FENIX_TAG_LIST.objCheckBox.val();
    },

    chiudiTagList: function ()
    {
    	if (!NS_FENIX_TAG_LIST.objCheckBox) return;
    	
    	NS_FENIX_TAG_LIST.objCheckBox.deselectAll();
    		
		$.each(NS_FENIX_TAG_LIST.prevSelection.split(","), function(i,v) {
			NS_FENIX_TAG_LIST.objCheckBox.selectByValue(v);
		});
		$(".tagList").hide();
    }
};
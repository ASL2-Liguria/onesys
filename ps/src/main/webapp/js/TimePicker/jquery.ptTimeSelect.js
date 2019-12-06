/**
 * FILE: $.ptTileSelect.js
 *  
 * @fileOverview
 * $ plugin for displaying a popup that allows a user
 * to define a time and set that time back to a form's input
 * field.
 *  
 * @version 0.8
 * @author  Paul Tavares, www.purtuga.com
 * @see     http://pttimeselect.sourceforge.net
 * 
 * @requires $ {@link http://www.$.com}
 * 
 * 
 * LICENSE:
 * 
 *  Copyright (c) 2007 Paul T. (purtuga.com)
 *  Dual licensed under the:
 *
 *  -   MIT
 *      <http://www.opensource.org/licenses/mit-license.php>
 * 
 *  -   GPL
 *      <http://www.opensource.org/licenses/gpl-license.php>
 *  
 *  User can pick whichever one applies best for their project
 *  and doesn not have to contact me.
 * 
 * 
 * INSTALLATION:
 * 
 * There are two files (.css and .js) delivered with this plugin and
 * that must be included in your html page after the $.js library
 * and the $ UI style sheet (the $ UI javascript library is
 * not necessary).
 * Both of these are to be included inside of the 'head' element of
 * the document. Example below demonstrates this along side the $
 * libraries.
 * 
 * |    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/$/1.3.2/$.min.js"></script>
 * |    <link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/$ui/1.8.22/themes/redmond/$-ui.css" />
 * |
 * |    <link rel="stylesheet" type="text/css" href="$.ptTimeSelect.css" />
 * |    <script type="text/javascript" src="$.ptTimeSelect.js"></script>
 * |
 * 
 * USAGE:
 * 
 *     -    See <$(ele).ptTimeSelect()>
 * 
 * 
 * 
 * LAST UPDATED:
 * 
 *         - $Date: 2012/08/05 19:40:21 $
 *         - $Author: paulinho4u $
 *         - $Revision: 1.8 $
 * 
 */

(function($){
    
    /**
     *  $ definition
     *
     *  @see    http://$.com/
     *  @name   $
     *  @class  $ Library
     */
    
    /**
     * $ 'fn' definition to anchor all public plugin methods.
     * 
     * @see         http://$.com/
     * @name        fn
     * @class       $ Library public method anchor
     * @memberOf    $
     */
    
    /**
     *  Namespace for all properties and methods
     *  
     *  @namespace   ptTimeSelect
     *  @memberOf    $
     */
    $.ptTimeSelect         = {};
    $.ptTimeSelect.version = "__BUILD_VERSION_NUMBER__";
    
    /**
     * The default options for all calls to ptTimeSelect. Can be
     * overwriten with each individual call to {@link $.fn.ptTimeSelect}
     *  
     * @type {Object} options
     * @memberOf $.ptTimeSelect
     * @see $.fn.ptTimeSelect
     */
    $.ptTimeSelect.options = {
        containerClass: undefined,
        containerWidth: '22em',
        hoursLabel:     'Hour',
        minutesLabel:   'Minutes',
        setButtonLabel: 'Set',
        popupImage:     undefined,
        onFocusDisplay: true,
		rangeLimit:	undefined,
        zIndex:         10,
        onBeforeShow:   undefined,
        onClose:        undefined
    };
    
    /**
     * Internal method. Called when page is initialized to add the time
     * selection area to the DOM.
     *  
     * @private
     * @memberOf $.ptTimeSelect
     * @return {undefined}
     */
    $.ptTimeSelect._ptTimeSelectInit = function () {
        $(document).ready(
            function () {
                //if the html is not yet created in the document, then do it now
                if (!$('#ptTimeSelectCntr').length)
				{	
                    $("body").append(
                            '<div id="ptTimeSelectCntr">'
                        +    '        <div class="ptTimeSelectHeader">'
                        +    '            <div id="ptTimeSelectCloseCntr"></div>'
                        +    '            <div id="ptTimeSelectUserTime">'
                        +    '                <span id="ptTimeSelectUserSelHr">1</span> : '
                        +    '                <span id="ptTimeSelectUserSelMin">00</span> '
                        +    '            </div>'
                        +    '            <br style="clear: both;" />'
                        +    '        </div>'
                        +    '        <div class="ptTimeSelectBody">'
                        +    '                <div class="ptTimeSelectTimeLabelsCntr">'
                        +    '                    <div class="ptTimeSelectLeftPane" >Hour</div>'
                        +    '                    <div class="ptTimeSelectRightPane">Minutes</div>'
                        +    '                </div>'
                        +    '                <div id="ptTimeSelectLeftPane" class="ptTimeSelectLeftPane"></div>'
                        +    '                <div id="ptTimeSelectRightPane" class="ptTimeSelectRightPane"></div>'
                        +    '        </div>'
                      /*  +    '        <div id="ptTimeSelectSetButton">'
                        +    '            <br style="clear: both;" />'
                        +    '        </div>'*/
                        +    '</div>'
                    );
					
					$.ptTimeSelect.createHr();
					$.ptTimeSelect.createMin();
                    var e = $('#ptTimeSelectCntr');
					
					$("#ptTimeSelectCloseCntr").append($("<i>").addClass("icon-cancel-circled"));
    
                    // Add the events to the functions
                    e.find('.ptTimeSelectMin')
                        .on("click", function(){
                            $.ptTimeSelect.setMin($(this).text());
                         });
				    e.find('.ptTimeSelectHr')
                        .on("click", function(){
                            $.ptTimeSelect.setHr($(this).text());
                         });    
					e.find('#ptTimeSelectCloseCntr i')
						.on("click", function(){
                            $.ptTimeSelect.closeCntr();
                         });
					e.find("#ptTimeSelectUserTime")
						.on("click", function(){
							$.ptTimeSelect.setTime();
                            $.ptTimeSelect.closeCntr();
                         });	  
                   $(document).mousedown($.ptTimeSelect._doCheckMouseClick);            
                }//end if

            }
        );
    }();// $.ptTimeSelectInit()
	$.ptTimeSelect.format=function(v)
	{
		return (v<10)?"0"+v:v;
	}
    $.ptTimeSelect.showAll = function(param) {
		 $.each($(".ptTimeSelectHr"),function(k,v){
					$(v).show();	
		  });
		   $.each($(".ptTimeSelectMin"),function(k,v){ 		
					$(v).show();	
		  });  

    };// END showAll() function
    $.ptTimeSelect.limitHr = function(param) {
		 var hr=$('#ptTimeSelectUserSelHr');
	
			
		 if(param.to[0]<Number(hr.text())<param.from[0])
		 {
			hr.text(param.from[0]);
			$.ptTimeSelect.limitMin(param.from[0],param);
		 }
		 $.each($(".ptTimeSelectHr"),function(k,v){
		 		if(k<param.from[0] || k>param.to[0])
					$(v).hide();
				else
					$(v).show();	
		  });  

    };// END limitHr() function
	
	$.ptTimeSelect.createHr = function(param) {
		var start=0;
		var end=23;
		var container=$("<div>").addClass("ptTimeSelectHrCntr");
      	for (var i=start; i<=end; i++)
	   	{
			container.append($("<a>").addClass("ptTimeSelectHr").attr("href","javascript: void(0);").html(i));  
	   	} 
		 container.append("<br style='clear: left;'/>");
	   	$("#ptTimeSelectLeftPane").html(container);
		  

    };// END createHr() function
	$.ptTimeSelect.limitMin = function(h,param) {
		if(h==param.from[0])
		{
			$.each($(".ptTimeSelectMin"),function(k,v){
		 		if(k<param.from[1])
					$(v).hide();
				else
					$(v).show();	
		  	});
			$('#ptTimeSelectUserSelMin').text($.ptTimeSelect.format(param.from[1]))   
		}else if(h==param.to[0])
		{
			$.each($(".ptTimeSelectMin"),function(k,v){
		 		if(k>param.to[1])
					$(v).hide();
				else
					$(v).show();	
		  	});
			$('#ptTimeSelectUserSelMin').text($.ptTimeSelect.format(param.to[1]));   
		}else
		{
			$.each($(".ptTimeSelectMin"),function(k,v){
					$(v).show();	
		  	});	
			
		}	
			
		   
    };// END limitMin() function
	$.ptTimeSelect.createMin = function() {
		var start=0;
		var end=59;
		var container=$("<div>").addClass("ptTimeSelectMinCntr");
      	for (var i=start; i<=end; i++)
	   	{
			container.append($("<a>").addClass("ptTimeSelectMin").attr("href","javascript: void(0);").html($.ptTimeSelect.format(i)));  
	   	}
		container.append("<br style='clear: left;'/>"); 
	   $("#ptTimeSelectRightPane").html(container);   
	   

    };// END createMin() function
	
    /**
     * Sets the hour selected by the user on the popup.
     * 
     * @private 
     * @param  {Integer}   h   -   Interger indicating the hour. This value
     *                      is the same as the text value displayed on the
     *                      popup under the hour. This value can also be the
     *                      words AM or PM.
     * @return {undefined}
     * 
     */
    $.ptTimeSelect.setHr = function(h) {
            $('#ptTimeSelectUserSelHr').empty().append(h);
			this.setTime();

    };// END setHr() function
        
    /**
     * Sets the minutes selected by the user on the popup.
     * 
     * @private
     * @param {Integer}    m   - interger indicating the minutes. This
     *          value is the same as the text value displayed on the popup
     *          under the minutes.
     * @return {undefined}
     */
    $.ptTimeSelect.setMin = function(m) {
        $('#ptTimeSelectUserSelMin').empty().append(m);
		this.setTime();
    };// END setMin() function
        
    /**
     * Takes the time defined by the user and sets it to the input
     * element that the popup is currently opened for.
     * 
     * @private
     * @return {undefined}
     */
    $.ptTimeSelect.setTime = function() {
        var tSel = $('#ptTimeSelectUserSelHr').text()
                    + ":"
                    + $('#ptTimeSelectUserSelMin').text()      
        $(".isPtTimeSelectActive").val(tSel);
       // this.closeCntr();
        
    };// END setTime() function
        
    /**
     * Displays the time definition area on the page, right below
     * the input field.  Also sets the custom colors/css on the
     * displayed area to what ever the input element options were
     * set with.
     * 
     * @private
     * @param {String} uId - Id of the element for whom the area will
     *                  be displayed. This ID was created when the 
     *                  ptTimeSelect() method was called.
     * @return {undefined}
     * 
     */
    $.ptTimeSelect.openCntr = function (ele) {
        $.ptTimeSelect.closeCntr();
		
        $(".isPtTimeSelectActive").removeClass("isPtTimeSelectActive");
        var cntr            = $("#ptTimeSelectCntr");
        var i               = $(ele).eq(0).addClass("isPtTimeSelectActive");
        var opt             = i.data("ptTimeSelectOptions");
        var style           = i.offset();
        style['z-index']    = opt.zIndex;
        style.top           = (style.top + i.outerHeight());
		
		
        if (opt.containerWidth) {
            style.width = opt.containerWidth;
        }
        if (opt.containerClass) {
            cntr.addClass(opt.containerClass);
        }
        cntr.css(style);
		var d = new Date();
		var curr_hour = d.getHours();	
		var curr_min = d.getMinutes();
        var hr    = curr_hour;
        var min   = $.ptTimeSelect.format(curr_min);
        if (i.val()) {
			
            var re = /([0-9]{1,2}).*:.*([0-9]{2})/i;
            var match = re.exec(i.val());
            if (match) {
                hr    = match[1] || hr;
                min    = match[2] || min;
            }
        }
        cntr.find("#ptTimeSelectUserSelHr").empty().append(hr);
        cntr.find("#ptTimeSelectUserSelMin").empty().append(min);
        cntr.find(".ptTimeSelectTimeLabelsCntr .ptTimeSelectLeftPane")
            .empty().append(opt.hoursLabel);
        cntr.find(".ptTimeSelectTimeLabelsCntr .ptTimeSelectRightPane")
            .empty().append(opt.minutesLabel);
        cntr.find("#ptTimeSelectSetButton a").empty().append(opt.setButtonLabel);
		if (opt.rangeLimit) {
         	$.ptTimeSelect.limitHr(opt.rangeLimit);
			 cntr.find('.ptTimeSelectHr')
                        .on("click", function(){
							$.ptTimeSelect.limitMin($(this).text(),opt.rangeLimit);
                            $.ptTimeSelect.setHr($(this).text());
                         });  
        }else
		{
			 $.ptTimeSelect.showAll();
		}
        if (opt.onBeforeShow) {
            opt.onBeforeShow(i, cntr,$.ptTimeSelect);
        }
        cntr.slideDown("fast"); 
            
    };// END openCntr()
        
    /**
     * Closes (hides it) the popup container.
     * @private
     * @param {Object} i    -   Optional. The input field for which the
     *                          container is being closed.
     * @return {undefined}
     */
    $.ptTimeSelect.closeCntr = function(i) {
        var e = $("#ptTimeSelectCntr");
        if (e.is(":visible") == true) {
            
            // If IE, then check to make sure it is realy visible
            if ($.support.tbody == false) {
                if (!(e[0].offsetWidth > 0) && !(e[0].offsetHeight > 0) ) {
                    return;
                }
            }
            
            $('#ptTimeSelectCntr')
                .css("display", "none")
                .removeClass()
                .css("width", "");
            if (!i) {
                i = $(".isPtTimeSelectActive");
            }
            if (i) {
                var opt = i.removeClass("isPtTimeSelectActive")
                            .data("ptTimeSelectOptions");
                if (opt && opt.onClose) {
                    opt.onClose(i);
                }
            }
        }
        return;
    };//end closeCntr()
    
    /**
     * Closes the timePicker popup if user is not longer focused on the
     * input field or the timepicker
     * 
     * @private
     * @param {$Event} ev -    Event passed in by $
     * @return {undefined}
     */
    $.ptTimeSelect._doCheckMouseClick = function(ev){
        if (!$("#ptTimeSelectCntr:visible").length){
            return;
        }
        if (   !$(ev.target).closest("#ptTimeSelectCntr").length
            && $(ev.target).not("input.isPtTimeSelectActive").length ){
            $.ptTimeSelect.closeCntr();
        }
        
    };// $.ptTimeSelect._doCheckMouseClick
	
	
    /**
     * FUNCTION: $().ptTimeSelect()
     * Attaches a ptTimeSelect widget to each matched element. Matched
     * elements must be input fields that accept a values (input field).
     * Each element, when focused upon, will display a time selection 
     * popoup where the user can define a time.
     * 
     * @memberOf $
     * 
     * PARAMS:
     * 
     * @param {Object}      [opt] - An object with the options for the time selection widget.
     * 
     * @param {String}      [opt.containerClass=""] - A class to be associated with the popup widget.
     * 
     * @param {String}      [opt.containerWidth=""] - Css width for the container.
     * 
     * @param {String}      [opt.hoursLabel="Hours"] - Label for the Hours.
     * 
     * @param {String}      [opt.minutesLabel="Minutes"] - Label for the Mintues container.
     * 
     * @param {String}      [opt.setButtonLabel="Set"] - Label for the Set button.
     * 
     * @param {String}      [opt.popupImage=""] - The html element (ex. img or text) to be appended next to each
     *      input field and that will display the time select widget upon
     *      click.
     * 
     * @param {Integer}     [opt.zIndex=10] - Integer for the popup widget z-index.
     * 
     * @param {Function}    [opt.onBeforeShow=undefined] - Function to be called before the widget is made visible to the 
     *      user. Function is passed 2 arguments: 1) the input field as a 
     *      $ object and 2) the popup widget as a $ object.
     * 
     * @param {Function}    [opt.onClose=undefined] - Function to be called after closing the popup widget. Function
     *      is passed 1 argument: the input field as a $ object.
     * 
     * @param {Bollean}     [opt.onFocusDisplay=true] - True or False indicating if popup is auto displayed upon focus
     *      of the input field.
     * 
     * 
     * RETURN:
     * @return {$} selection
     * 
     * 
     * 
     * EXAMPLE:
     * @example
     *  $('#fooTime').ptTimeSelect();
     * 
     */
	 
	
    $.fn.ptTimeSelect = function (opt) {
            if(this[0].nodeName.toLowerCase() != 'input') return;
            var e = $(this);
            if (e.hasClass('hasPtTimeSelect')){
                return externFunction;
            }
            var thisOpt = {};
            thisOpt = $.extend(thisOpt, $.ptTimeSelect.options, opt);
            e.addClass('hasPtTimeSelect').data("ptTimeSelectOptions", thisOpt);
            
            
            if (thisOpt.onFocusDisplay){
                e.focus(function(){
                    $.ptTimeSelect.openCntr(this);
                });
            }

			var externFunction={
				obj:e,
				changeOptions:function(newOpt)
				{
					this.obj.data("ptTimeSelectOptions", newOpt);		
				}		 
			};
            return externFunction;
    };// End of $.fn.ptTimeSelect
    
})($);

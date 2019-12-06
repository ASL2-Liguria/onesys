/*********************
//* jQuery Multi Level CSS Menu #2- By Dynamic Drive: http://www.dynamicdrive.com/
//* Last update: Nov 7th, 08': Limit # of queued animations to minmize animation stuttering
//* Menu avaiable at DD CSS Library: http://www.dynamicdrive.com/style/
*********************/

//Update: April 12th, 10: Fixed compat issue with jquery 1.4x

//Specify full URL to down and right arrow images (23 is padding-right to add to top level LIs with drop downs):
var arrowimages={down:['downarrowclass', 'imagexPix/arrow/down.gif', 23], right:['rightarrowclass', 'imagexPix/arrow/right.gif']}

/*var jqueryslidemenu={

	animateduration: {over: 100, out: 50}, //duration of slide in/ out animation, in milliseconds

	buildmenuClick:function(menuid, arrowsvar)
	{
		jQuery(document).ready(function($)
		{
			var $mainmenu=$("#"+menuid+">ul");
			
			var $headers=$mainmenu.find("ul").parent()
						
			$mainmenu.find("ul").attr("aperto","false");
						
			$headers.each(function(i)
			{
				var $curobj=$(this)
							
				var $subul=$(this).find('ul:eq(0)')
				this._dimensions={w:this.offsetWidth, h:this.offsetHeight, subulw:$subul.outerWidth(), subulh:$subul.outerHeight()}
				this.istopheader=$curobj.parents("ul").length==1? true : false
				$subul.css({top:this.istopheader? this._dimensions.h+"px" : 0})
				$curobj.children("a:eq(0)").css(this.istopheader? {paddingRight: arrowsvar.down[2]} : {}).append(
					'<img src="'+ (this.istopheader? arrowsvar.down[1] : arrowsvar.right[1])
					+'" class="' + (this.istopheader? arrowsvar.down[0] : arrowsvar.right[0])
					+ '" style="border:0;" />'
				)
							
			}) //end $headers.each()
			
			
			$("#"+menuid).find("ul:eq(0)").find("li").click(
				function(e){
					var $targetul = $(this).find("ul:eq(0)");
					
					if($(this).children("ul").html() == null)
						$("#"+menuid).find("ul").find("ul").slideUp(jqueryslidemenu.animateduration.out).attr("aperto","false");
					
					if($targetul.attr("aperto") == "false")
					{
						if(!$(this).parent().find("li").attr("istopheader"))
							$(this).parent().find("li").find("ul").slideUp(jqueryslidemenu.animateduration.out).attr("aperto","false");
										
						var $targetul=$(this).children("ul:eq(0)")
						this._offsets={left:$(this).offset().left, top:$(this).offset().top}
						var menuleft=this.istopheader? 0 : this._dimensions.w
						menuleft=(this._offsets.left+menuleft+this._dimensions.subulw>$(window).width())? (this.istopheader? -this._dimensions.subulw+this._dimensions.w : -this._dimensions.w) : menuleft
						
						if ($targetul.queue().length<=1)//if 1 or less queued animations
							$targetul.css({left:menuleft+"px", width:this._dimensions.subulw+'px'}).slideDown(jqueryslidemenu.animateduration.over)
						
						$targetul.attr("aperto","true");
						
					}
					else
					{
						var $targetul=$(this).children("ul:eq(0)")
						$targetul.slideUp(jqueryslidemenu.animateduration.out)
						$targetul.attr("aperto","false");
					}
					event.cancelBubble = true;
				}
			)
			
			
			$mainmenu.find("ul").css({display:'none', visibility:'visible'})
		}) //end document.ready
	},
	
	buildmenuHover:function(menuid, arrowsvar)
	{
	
		jQuery(document).ready(function($)
		{
			var $mainmenu=$("#"+menuid+">ul")
			var $headers=$mainmenu.find("ul").parent()
			
			$headers.each(function(i)
			{
				var $curobj=$(this)
				var $subul=$(this).find('ul:eq(0)')
				this._dimensions={w:this.offsetWidth, h:this.offsetHeight, subulw:$subul.outerWidth(), subulh:$subul.outerHeight()}
				this.istopheader=$curobj.parents("ul").length==1? true : false
				$subul.css({top:this.istopheader? this._dimensions.h+"px" : 0})
				$curobj.children("a:eq(0)").css(this.istopheader? {paddingRight: arrowsvar.down[2]} : {}).append(
					'<img src="'+ (this.istopheader? arrowsvar.down[1] : arrowsvar.right[1])
					+'" class="' + (this.istopheader? arrowsvar.down[0] : arrowsvar.right[0])
					+ '" style="border:0;" />'
				)
				$curobj.hover(
					function(e){
						var $targetul=$(this).children("ul:eq(0)")
						this._offsets={left:$(this).offset().left, top:$(this).offset().top}
						var menuleft=this.istopheader? 0 : this._dimensions.w
						menuleft=(this._offsets.left+menuleft+this._dimensions.subulw>$(window).width())? (this.istopheader? -this._dimensions.subulw+this._dimensions.w : -this._dimensions.w) : menuleft
						if ($targetul.queue().length<=1) //if 1 or less queued animations
							$targetul.css({left:menuleft+"px", width:this._dimensions.subulw+'px'}).slideDown(jqueryslidemenu.animateduration.over)
					},
					function(e){
						var $targetul=$(this).children("ul:eq(0)")
						$targetul.slideUp(jqueryslidemenu.animateduration.out)
					}
				) //end hover
				$curobj.click(function(){
					$(this).children("ul:eq(0)").hide()
				})
			}) //end $headers.each()
			$mainmenu.find("ul").css({display:'none', visibility:'visible'})
		}) //end document.ready
	}
}
*/
//build menu with ID="myslidemenu" on page:
//jqueryslidemenu.buildmenu("myslidemenu", arrowimages)


var $slidemenu={
	animateduration:{over:100,out:50},
	
	buildmenuClick:function(a,b){
	
		$(document).ready(function(c){
	
			var d=c("#"+a+">ul");
			
			var e=d.find("ul").parent();
			
			d.find("ul").attr("aperto","false");
			
			e.each(function(a){
				var d=c(this);
				var e=c(this).find("ul:eq(0)");
				this._dimensions={w:this.offsetWidth,h:this.offsetHeight,subulw:e.outerWidth(),subulh:e.outerHeight()};
				
				this.istopheader=d.parents("ul").length==1?true:false;
				
				e.css({top:this.istopheader?this._dimensions.h+"px":0});
				
				d.children("a:eq(0)").css(this.istopheader?{paddingRight:b.down[2]}:{}).append('<img src="'+(this.istopheader?b.down[1]:b.right[1])+'" class="'+(this.istopheader?b.down[0]:b.right[0])+'" style="border:0;" />')
			});
				
			c("#"+a).find("ul:eq(0)").children("li").click(function(){
				//alert('154 : ' + c(this).hasClass("topMenuActive") + ';');
				if(c(this).hasClass("topMenuActive"))
					c(this).removeClass("topMenuActive");
				else{
					c(".topMenuActive").removeClass("topMenuActive");
					
					if(c(this).children("ul").html()!=null)
						c(this).addClass("topMenuActive")
				}
			});

			c("#"+a)
				.find("ul:eq(0)")
				.children("li")
				.find("ul:eq(0)")
				.children("li")
				.click(function(){
					//alert('171 : ' + (c(this).hasClass("liMenuActive")) + ';');
					if(c(this).hasClass("liMenuActive"))
						c(this).removeClass("liMenuActive");
					else{
						c(".liMenuActive")
						.find("ul")
						.slideUp($slidemenu.animateduration.out)
						.attr("aperto","false");
						
						c(".liMenuActive").removeClass("liMenuActive");
						
						if(c(this).children("ul").html()!=null){
							c(this).addClass("liMenuActive")}
					}
				});
				
				c("#"+a)
					.find("ul:eq(0)")
					.find("li")
					.click(function(b){
						//alert('191 : ')
						c(this)
							.parent()
							.find("li")
							.find("ul")
							.slideUp($slidemenu.animateduration.out);
						var d=c(this).find("ul:eq(0)");
						if(c(this).children("ul").html()==null){
							c("#"+a)
								.find("ul")
								.find("ul")
								.slideUp($slidemenu.animateduration.out).attr("aperto","false");
							c(".topMenuActive").removeClass("topMenuActive");
							c(".liMenuActive").removeClass("liMenuActive")
						}

						if(d.attr("aperto")=="false" || d.attr("aperto")==""){
							/*if(!c(this).parent().find("li").attr("istopheader")){
								c(this)
									.parent()
									.find("li")
									.find("ul")
									.slideUp($slidemenu.animateduration.out).attr("aperto","false");
								c(".liMenuActive").removeClass("liMenuActive")
							}*/

							if(!c(this).prop("istopheader")){
								c(this).addClass("liMenuActive")
							}
							
							var d=c(this).children("ul:eq(0)");
							this._offsets={left:c(this).offset().left,top:c(this).offset().top};
							var e=this.istopheader?0:this._dimensions.w;
							e=this._offsets.left+e+this._dimensions.subulw>c(window).width()?this.istopheader?-this._dimensions.subulw+this._dimensions.w:-this._dimensions.w:e;

							if(d.queue().length<=1)
								d.css({left:e+"px",width:this._dimensions.subulw+"px"}).slideDown($slidemenu.animateduration.over);
							
							d.attr("aperto","true")
						}
						else{
							var d=c(this).children("ul:eq(0)");
							d.slideUp($slidemenu.animateduration.out);
							d.attr("aperto","false");c(".liMenuActive").removeClass("liMenuActive")
						}
						
						event.cancelBubble=true
					});
						
					d.find("ul").css({display:"none",visibility:"visible"})
		})
	}
}
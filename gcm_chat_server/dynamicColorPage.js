/* Please visit https://github.com/ulrobin/dynamicColorPage/ for detailed documentation and license information */

var colors = {
    standard: "#F34E36",
    red: "#F34E36",
    green: "#B5D947",
    purple: "#9d6fc8",
    blue: "#4abcdd",
    turquoise: "#1abc9c",
    pink: "#C61C72",
    orange: "#f4a622",
    emerald: "#2ecc71"
};
var color_tiles_per_row=2;
var colorChangerOldColor = "";


var colorChangerToggleState=false;var css_string = ".color_changer-toggle{position:fixed;right:10px;bottom:10px;z-index:10000}.color_changer{position:fixed;right:10px;bottom:50px;z-index:10000;max-height:0vh;overflow:hidden;transition:all 1s ease-out;border-width:0px;margin-bottom:0px}.color_changer .panel{margin-bottom:0px;padding:5px}.color_changer.faded-in{transition:all 1s ease-in;max-height:100vh}.row .color_tile{width:25px;height:25px;border-radius:4px;float:left;margin:5px;cursor:pointer}.row .color_tile:nth-child(1){margin-left:20px}.row .color_tile:nth-child(2){margin-right:20px}";
function colorLuminance(color_hex,factor){
    color_hex=String(color_hex).replace(/[^0-9a-f]/gi,'');
	if(color_hex.length<6)color_hex=color_hex[0]+color_hex[0]+color_hex[1]+color_hex[1]+color_hex[2]+color_hex[2];
	factor=factor||0;
    var rgb="#",c,i;
	for(var i=0;i<3;i++){
		c=parseInt(color_hex.substr(i*2,2),16);
		c=Math.round(Math.min(Math.max(0,c+(c*factor)),255)).toString(16);
		rgb+=("00"+c).substr(c.length);
	}
	return rgb;
}

jQuery(document).ready(function($){
    $('<div class="color_changer"><div class="panel panel-default"></div></div>').appendTo("body");var domElementContent='<div class="panel panel-default"><div class="row">';
    $("body").on("click","*",function(){
        if(colorChangerToggleState){
            if(!$(this).hasClass("color_changer-toggle")){
                $(".color_changer").removeClass('faded-in');
                colorChangerToggleState=false;
            }
        }
    });
    $("body").on("click",".color_changer-toggle",function(){
        if(colorChangerToggleState){
            $(".color_changer").removeClass('faded-in');
            colorChangerToggleState=false;
        }else{
            $(".color_changer").addClass('faded-in');
            colorChangerToggleState=true;
        }
    });
    var color_tiles_counter=0;
    for(var key in colors) {
        if(colors.hasOwnProperty(key)){
            var property_value=colors[key];
            var name_only=false;
            if(key=="standard")key="";
            else{
                if(color_tiles_counter<color_tiles_per_row-1)
                {
                    color_tiles_counter++;
                    domElementContent+='<div class="color_tile dbg'+key+'" data-color="'+key+'"></div>';
                }
                else
                {
                    domElementContent+='<div class="color_tile dbg'+key+'" data-color="'+key+'"></div>';
                    domElementContent+="</div><div class='row'>";
                    color_tiles_counter=0;
                }
            }
            for(var h=-1000;h<1001;h+=10)
            {
                if(!name_only)
                {
                    css_string+=".dcl"+key+"{color:"+property_value+"}";
                    css_string+=".dbg"+key+"{background-color:"+property_value+"}";
                    name_only=true;
                }
                css_string+=".dcl"+key+h+"{color:"+colorLuminance(property_value,(h/100))+"}";
                css_string+=".dbg"+key+h+"{background-color:"+colorLuminance(property_value,(h/100))+"}";
            }
        }
    }
    domElementContent+="</div></div>";
    $('.color_changer').html(domElementContent);
    $("body").on("click",".color_tile",function(){
        var new_color=$(this).attr("data-color");
        $('.dcl'+colorChangerOldColor).each(function(){
            if($(this).hasClass("color_tile"))return;
            $(this).removeClass('dcl'+colorChangerOldColor);
            $(this).addClass('dcl'+new_color);
        });
        $('.dbg'+colorChangerOldColor).each(function(){
            if($(this).hasClass("color_tile"))return;
            $(this).removeClass('dbg'+colorChangerOldColor);
            $(this).addClass('dbg'+new_color);
        });
        for(var j=-1000;j<1001;j+=10)
        {
            $('.dbg'+colorChangerOldColor+j).each(function(){
                if($(this).hasClass("color_tile"))return;
                $(this).removeClass('dbg'+colorChangerOldColor+j);
                $(this).addClass('dbg'+new_color+j);
            });
            $('.dcl'+colorChangerOldColor+j).each(function(){
                if($(this).hasClass("color_tile"))return;
                $(this).removeClass('dcl'+colorChangerOldColor+j);
                $(this).addClass('dcl'+new_color+j);
            });
        }
        $('.color_changer-toggle').click();
        colorChangerOldColor=new_color;
    });
    $("<style type='text/css'>"+css_string+"</style>").appendTo("head");
});

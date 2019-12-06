/**
* User: matteopi
* Date: 31/07/13
* Time: 9.52
*/

$(document).ready(function () {

    $('td.oracontrol input')
        .live()
        .setMask("29:59")
        .keypress(function() {
            var currentMask = $(this).data('mask').mask;
            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
            if (newMask != currentMask) {
                $(this).setMask(newMask);
            }
        })


});
var NS_TIME = {

    getJsonDate:function(){

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var hour = today.getHours();
        var min = today.getMinutes();
        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} if(min<10){'0'+min}   if(hour<10){'0'+hour}
        return {
            'dd':dd,
            'mm':mm,
            'yyyy':yyyy,
            'hour': hour,
            'min':min
        }
    },
    getTime:function(){
        var fullDate = NS_TIME.getJsonDate();
        return  fullDate.hour + ':' + fullDate.min;
    },
    getDate:function(){
        var fullDate = NS_TIME.getJsonDate();
        return   fullDate.dd+'/'+fullDate.mm+'/'+fullDate.yyyy;
    },
    getDateDb:function(){
        var fullDate = NS_TIME.getJsonDate();
        return   fullDate.yyyy+fullDate.mm+fullDate.dd+fullDate.hour + ':' +fullDate.min;
    }

}


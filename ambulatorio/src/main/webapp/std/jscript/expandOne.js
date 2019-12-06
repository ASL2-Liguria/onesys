//javascript per il menu espandibile con massimo un livello aperto
var prev="null";

window.onload=function(){
if(document.getElementsByTagName && document.getElementById){
    document.getElementById("nav").className="jsenable";
    BuildList();
    }
}

function BuildList(){
var hs=document.getElementById("nav").getElementsByTagName("h3");
for(var i=0;i<hs.length;i++){
    hs[i].onclick=function(){
        if(this.parentNode.className!="show"){
            this.parentNode.className="show";
            if(prev && prev!=this.parentNode) prev.className="hide";
            prev=this.parentNode;
            }
        else this.parentNode.className="hide";
        }
    }
}
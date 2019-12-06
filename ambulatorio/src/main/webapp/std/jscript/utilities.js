function rip_frame()
{
	parent.document.all.oFramesetWorklist.rows = "82,0,*,0";
}

function riposiziona_frame()
{
	var frameClose = 50;
	righe_frame = parent.document.all.oFramesetWorklist.rows;
	vettore = righe_frame.split(',');
	var info_ref = vettore[3];
    if (parent.document.all.oFramesetWorklist.rows == "82,0,*," + info_ref)
	{
    	parent.document.all.oFramesetWorklist.rows = frameClose + ",0,*,"+info_ref;
    }
    else
	{
        parent.document.all.oFramesetWorklist.rows = "82,0,*,"+info_ref;
    }
}


 

  
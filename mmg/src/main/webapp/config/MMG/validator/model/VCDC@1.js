var VCDC =
{
    elements:
    {
        txtCodiceCdc:
        {
            status: "required",
            name: "Codice",
            rules:
            {
                minlength:3
            }
        },
        txtOrdineCdc:
        {
            status: "required",
            name: "Ordine",
            rules:
            {
                number:true
            }
        },
        txtDescrizioneCdc:
        {
            status: "required",
            name: "Descrizione"
        }

    }
};
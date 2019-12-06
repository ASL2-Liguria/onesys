var ns_controllo_cod_fisc = {


	verificaCodiceFiscaleDefinitivo : function (cfins) {

		if (cfins == '')
			return false;
		if (cfins.length != 16)
			return false;
		var cf = cfins.toUpperCase();
		var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{2}(\d|[L-V])[A-Z]$/;
		if (!cfReg.test(cf))
			return false;
		var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
		var s = 0;
		for (i = 1; i <= 13; i += 2)
			s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
		for (i = 0; i <= 14; i += 2)
			s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
		if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0))
			return false;
		return true;
	},
	
	
	calcola_cfs : function(cognome, nome, datanascita, sesso, provincia) {
      // alert("Cognome: "+cognome+"\nNome: "+nome+"\nSesso: "+sesso+"\nData di nascita: "+datanascita+"\nProvincia :"+provincia);
        // Attenzione, per utilizzo datanascita deve essere: gg/mm/aaaa
        //if (cognome == '' || nome == '' || datanascita == '' || sesso == '' || provincia == '')	return "Dati mancanti";
        var err = '';
        var count = 0;
        if(cognome == '') {
            count++;
            err += "Cognome";
        }
        if(nome == '') {
            err += count> 0 ? ", Nome " : "Nome ";
            count++;
        }
        if(sesso == '' || sesso == 'U') {
            err += count> 0 ?", Sesso ":"Sesso ";
            count++;
        }
        if(provincia == null) {
            err += count > 0 ? ", Luogo di nascita ":"Luogo di nascita ";
            count++;
        }
        if(datanascita == '') {
            err += count > 0 ? ", Data di nascita " : "Data di nascita ";
            count++;
        }

        if (count>0 ){
            err += count==1?'mancante':'mancanti';
            return err;
        }
        //Ricavo il cognome(123)
        cognome = cognome.toUpperCase();
        vocali = "";
        consonanti = "";
        l = cognome.length;

        var a = "AEIOU";
        var b = "BCDFGHJKLMNPQRSTVWXYZ";

        for(var i = 0; i < l; i++) {
            if(a.search(cognome.substr(i, 1)) != -1) {
                vocali = vocali + cognome.substr(i, 1);
            }
            if(b.search(cognome.substr(i, 1)) != -1) {
                consonanti = consonanti + cognome.substr(i, 1);
            }
            if(consonanti.length == 3) {
                break;
            }
        }

        if(consonanti.length < 3) {
            consonanti = consonanti + vocali.slice(0, (3 - consonanti.length)); //consonanti=consonanti+vocali.substr(0, (3 - consonanti.length));
        }

        if(consonanti.length < 3) {
            var appo = consonanti + 'XXX';
            consonanti = appo.substr(0, 3);
        }

        cfs = consonanti;

        //Ricavo il nome(456)

        nome = nome.toUpperCase();
        vocali = "";
        consonanti = "";
        l = nome.length;

        for(i = 0; i < l; i++) {
            if(a.search(nome.substr(i, 1)) != -1) {
                vocali = vocali + nome.substr(i, 1);
            }
            if(b.search(nome.substr(i, 1)) != -1) {
                consonanti = consonanti + nome.substr(i, 1);
            }
        }

        if((consonanti.length > 4) || (consonanti.length == 4)) {
            consonanti = consonanti.slice(0, 1) + consonanti.substr(2, 2);
        }

        if(consonanti.length < 4) {
            covo = consonanti + vocali;
            consonanti = covo.slice(0, 3);

            if(consonanti.length < 3) {
                var appo = consonanti + 'XXX';
                consonanti = appo.substr(0, 3);
            }
        }
        cfs = cfs + consonanti;
        //Anno di nascita(78)

        cfs = cfs + datanascita.slice(8, 10);
        //Mese di nascita(9)

        a = "ABCDEHLMPRST";
        cfs = cfs + a.substr(datanascita.slice(3, 5) - 1, 1);
        //Giorno nascita(0A)

        if(sesso == "F") {
            cfs = cfs + (parseFloat(datanascita.slice(0, 2)) + 40);
        } else {
            cfs = cfs + datanascita.slice(0, 2);
        }
        //Località di nascita(BCDE)

        cfs = cfs + provincia;

        //Ultima lettera(F)
        //Controllo caratteri pari

        tempnum = 0;
        a = "B1A0KKPPLLC2QQD3RRE4VVOOSSF5TTG6UUH7MMI8NNJ9WWZZYYXX";
        b = "A0B1C2D3E4F5G6H7I8J9KKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ";
        cicla = 1;
        i = 0;

        while (cicla == 1) //for(i=0;i<15;i++)
        {
            //Dispari
            apponum = a.search(cfs.substr(i, 1)) + 1;
            tempnum = tempnum + ((apponum - 1) & 32766) / 2;
            //alert("dispari "+i+"  a: "+apponum+"  t: "+tempnum);
            i++;
            if(i > 13) {
                cicla = 0;
            }
            //Pari
            apponum = b.search(cfs.substr(i, 1)) + 1;
            tempnum = tempnum + ((apponum - 1) & 32766) / 2;
            //alert("pari "+i+"  a: "+apponum+"  t: "+tempnum);
            i++;
        }
        tempnum = tempnum % 26;
        a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        cfs = cfs + a.substr(tempnum, 1);



        return (cfs);
    }
};



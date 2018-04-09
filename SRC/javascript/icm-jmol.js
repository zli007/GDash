var xyzfile = "http://dna.engr.latech.edu/~bishop/icmgb-jg/tmpdata/icm.occ.xyz";


$("#rerun").click(function(){


    $.get(xyzfile, { "_": $.now() }, function(data) {
      	console.log("xyz model received");
       	//jmolLoadInline(data);
	//jmolScriptWait('script nuc-cores.txt');
        jmolLoadInlineScript(data, 'script nuc-cores.txt', 0);
    });

});


//-----------------------------------------------------------------------------
// embed dallicance genome browser
//-----------------------------------------------------------------------------



var chromatinpage = icm_server_addr + "../chromatin.html";
var chromatinpage2 = icm_server_addr + "../chromatins.html";
var chromatinpage3 = icm_server_addr + "../chromatinnuc.html";
var chromatinpage4 = icm_server_addr + "../nucleosome.html";
var chromatinpage5 = icm_server_addr + "../loader.html";
var chromatinpage6 = icm_server_addr + "../chromatinnucs.html";
var chromatinpage7 = icm_server_addr + "../chromatincolor.html";


//var chrId = 22,
//    default_viewStart = 30014047, //30010000, //29890000,
//    default_viewEnd = 30015936; //30020000; //30050000,
var viewStart = default_viewStart,
    viewEnd = default_viewEnd;

dbrowser.addInitListener(function(){
    dbrowser.setLocation(chrId, default_viewStart, default_viewEnd);
});
dbrowser.addInitListener(delete_icm_tracks);

//-----------------------------------------------------------------------------
// nuc widget
//-----------------------------------------------------------------------------

var Tempi = 0.0;

var temperature = ['0.0', '100.0', '200.0', '300.0'] ;

$.each(temperature, function(j, k){
    var optionString = '<option value=' + j + '>' + k + '</option>';
    //console.log(optionString);
    $('#Temp').append(optionString);
});

//var nucdat = '01kx5.min';

var nucdat = ['oct', 'hex1', 'hex2', 'tet','chrmat'];
$.each(nucdat, function(i, s){
    var optionString = '<option value=' + i + '>' + s + '</option>';
    //console.log(optionString);
    $('#Xnuc').append(optionString);
});

var cols = 'red';
var colors = ['red', 'blue', 'green', 'yellow','deepskyblue'];
$.each(colors, function(i, s){
    var optionString = '<option value=' + i + '>' + s + '</option>';
    //console.log(optionString);
    $('#col').append(optionString);
});

//var nucdat = ['01kx5.min', '01kx5.par', 'ki-01.par', 'ki-02.par', 'ki-03.par', 'ki-04.par', 'ki-05.par'];
//$.each(nucdat, function(i, s){
//    var optionString = '<option value=' + i + '>' + s + '</option>';
    //console.log(optionString);
//    $('#Xnuc').append(optionString);
//});

//var diff = Math.round((default_viewEnd - default_viewStart)*0.0527);
var default_seqStart = default_viewStart+diff, //30014247,
    default_seqEnd = default_viewEnd-diff; //30015736;

var seqStart = default_seqStart,
    seqEnd = default_seqEnd;
    


var seq_CAGa = "GAGGATTCCTGGGAAAACCCTGGCGAGCAGCAGCAGCAACAGTAGTAGAAGCAGCAGCACTAACGACAGCAGCAGCAGTAGCAGTAATAGAAGCAGCAGCAGCAGCAGTAGCAGTAGCAGCAGCAGCAGCAGCAATAACAACAACAGCAGCAGCAGTCACACAGGAAACAGCTCGGTCCTC";

var nucsmargin = {top: 20, right: 20, bottom: 40, left: 40};
var nucs = icmgb.nucwidget().width(960).height(200).margin(nucsmargin);
// init some nucs
nucs.initdata(seqEnd - seqStart, 147, 180, "default.par");
d3.select("#nucwidget").call(nucs);


function update_position_dat( posdata ) {

    nucs.seqlen(seqEnd - seqStart);
    var nucd = [];

    if(posdata == undefined){
        var getPositionsDat = $.get(icm_server_addr + "positions.dat", { "_": $.now() }, function(data) {
            console.log("position.dat received: ", data);
            data = data.replace(/^\s*\r\n/gm, "");

            var datalines = data.split(/\r\n|\n/);
            datalines = datalines.filter(function(d){ return d!=""; });

            console.log("datalines: ", datalines);

            if(datalines.length == 3) {
                //no header, simply nuc start pos (index from 0) with default Xnuc file and size 147
                var d = datalines[0].trim().split(/\s+/);
                var e = datalines[1].trim().split(/\s+/);
                var f = datalines[2].trim().split(/\s+/);
                console.log("d: ", d);
                console.log("e: ", e);

                for(i=0; i<d.length; i++){
                    nucd.push({start: +d[i], end: +d[i]+parseInt(e[i]), len: e[i], Xnuc: f[i]});
                console.log("nucd: ", nucd);
                }
            }
            else if (datalines.length == 1){
            	var d = datalines[0].trim().split(/\s+/);
                console.log("d: ", d);

                for(i=0; i<d.length; i++){
                    nucd.push({start: +d[i], end: +d[i]+147, len: 147, Xnuc: "default.par"});
                }
            
            }
            else {
                //with header, normal csv file
                nucd = d3.csv.parse(data);
            }


            //console.log(nucd);
            nucs.data(nucd);
            //d3.select("#nucwidget").call(nucs);
            
        });
    }
    else {
        for(i=0; i<posdata.length; i++){
            nucd.push({start: posdata[i], end: posdata[i]+147, len: 147, Xnuc: "default.par"});
        }
        nucs.data( nucd );
    }
}


var enemargin = {top: 20, right: 20, bottom: 40, left: 40};
var energyChart = icmgb.icmdatChart().width(960).height(200).margin(enemargin);
//energyChart.y(function(d){ return +d[2]; });

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


var data = [];
data.push([1, 150]);
for(var i=2; i<(seqEnd - seqStart); i++) data.push([i, getRandomArbitrary(165,170)]);
data.push([seqEnd-seqStart, 150]);
energyChart.data(data);
d3.select("#nucwidget").call(energyChart);

function update_icm_dat() {
    var getIcmDat = $.get(icm_server_addr + "icm.dat", { "_": $.now() }, function(data) {

        console.log("icm.dat received")

        data = data.replace(/^\s{2,}/gm, '');
        //data = data.trim();
        data = data.replace(/\s{2,}/gm, ',');

        var d = d3.csv.parseRows(data);
        console.log("first line of icm.dat: ", d[0], d.length);

        energyChart.data(d);
        //d3.select("#nucwidget").call(energyChart);
        //console.log(nucs);
        nucs.seqlen ( d.length );
        nucs.h( d );

    });
}

var tempdegree = [0, 100, 200, 300];
$('#Temp').change(function(){
    var idt = $(this).val();
    var C = tempdegree[idt];
    //console.log("Xnuc change: ", id, n);
    Tempi = C;
});

//var col2=['red', 'blue', 'green', 'yellow','deepskyblue'];
$('#col').change(function(){
    var id = $(this).val();
    var C = colors[id];
    //console.log("Xnuc change: ", id, n);
    cols = C;
});
//var nuclength = 147;
//var nuclength = [147, 130, 120, 110, 80, 70, 60];
//$('#Xnuc').change(function(){
//    var id = $(this).val();
 //   var len = nuclength[id];
    //console.log("Xnuc change: ", id, n);
//    nucs.change(nucs.selection(), len);
//});

var nuclength = [147, 99, 100, 52, 166];
var nuctype = ['oct.par', 'hex1.par', 'hex2.par', 'tet.par', 'chrmat.par'];
$('#Xnuc').change(function(){
    var id = $(this).val();
    var len = nuclength[id];
    var nucX = nuctype[id];
    //console.log("Xnuc change: ", id, n);
    nucs.change(nucs.selection(), len, nucX);
});

$("#delete").click(function(){
    nucs.delete(nucs.selection());
});
$("#addleft").click(function(){
    var id = $("#Xnuc").val();
    var len = nuclength[id];
    //var len = nuclength;
    var dat = nuctype[id];
    //var dat = nucdat;
    nucs.addleft(nucs.selection(), len, dat);
});
$("#addright").click(function(){
    var id = $("#Xnuc").val();
    var len = nuclength[id];
    //var len = nuclength;
    var dat = nuctype[id];
    //var dat = nucdat;
    nucs.addright(nucs.selection(), len, dat);
});



//-----------------------------------------------------------------------------
// brush
//-----------------------------------------------------------------------------

var brushScale = d3.scale.linear().range([0, 1024]);
var brush = d3.svg.brush()
    .x(brushScale)
    .on("brush", brushed);

init_brush();

function init_brush() {

    var svg = d3.select("#svgoverlay").append("svg")
        .attr("width", 1024)
        .attr("height", 30);

    //console.log("init svg:", svg.node());

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", 1024)
        .attr("height", 30);
        // .style("fill", "steelblue")
        // .style("fillopacity", 0.5);
        // .on("mousedown", function() {
        //     console.log("vis.rect, mousedown");            
        // });

    var context_margin = {top: 0, right: 0, bottom: 0, left: 0};
    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + context_margin.left + "," + context_margin.top + ")");

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .style("stroke", "black")
        .style("fill", "yellow")
        .style("fill-opacity", 0.3)
        .attr("y", 3)
        .attr("height", 24);
}


function show_brush_range(extent) {

    seqStart = Math.round(extent[0]);
    seqEnd = Math.round(extent[1]);

    $("#min").val(seqStart.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    $('#max').val(seqEnd.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
	

    var len = seqEnd - seqStart;
    //console.log(seqStart, seqEnd, len);
    $("#size").val(len.toString());
}


// when brush is moved or changed boundary, "brush" event will be triggered

function brushed() {
    
    if(brush.empty()) {
        console.log("brush empty!");
        return;
    }

    // get new extent
    var extent = brush.extent();
    //console.log("brushed, new extent: ", extent);
    
    show_brush_range(extent);

    //if(dbrowser.highlights.length > 0) $( "#highlight" ).trigger( "click" );
}


//-----------------------------------------------------------------------------
// more about browsers and brush interaction
// -----------------------------------------------------------------------------


//var zoom2slider = false;
dbrowser.addViewListener(function(chr, min, max) {
    
    // called when view changes
    //console.log("dbrowser.addViewListener", chr, min, max);

    //if( (min == viewStart) && (max == viewEnd) ) return;

    chrId = chr;
    $("#chr").val(chrId.toString());

    // if(zoom2slider == false){
    //     viewStart = min;
    //     viewEnd = max;
    // }

    var extent = brush.extent();
    brushScale.domain([min, max]);

    if(brush.empty()) {
        //var viewlen = max - min;
        //var viewmid = (max + min)/2;
        //extent = [viewmid - viewlen/10, viewmid + viewlen/10];
        extent = [seqStart, seqEnd];
        show_brush_range(extent);
    }

    //console.log("new brush domain: ", brushScale.domain(), "extent: ", extent);

    d3.selectAll(".brush").call(brush.x(brushScale).extent(extent));

});


//$("#reset_browser").click(reset_browser);
//$("#reset_slider").click(reset_slider);
$('#zoomin').click(zoomin);
$('#zoomout').click(zoomout);
$('#reset').click(reset);

function zoomin(){
    zoom2slider = true;
    dbrowser.setLocation(chrId, seqStart-diff, seqEnd+diff);
}

function zoomout(){
    zoom2slider = false;
    dbrowser.setLocation(chrId, viewStart, viewEnd);

    delete_icm_tracks();
}


function reset() {
    chrId = 22;
    viewStart = default_viewStart;
    viewEnd = default_viewEnd;

    dbrowser.setLocation(chrId, viewStart, viewEnd);

    seqStart = default_seqStart;
    seqEnd = default_seqEnd;

   
    $("#min").val(Math.round(seqStart).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    $('#max').val(Math.round(seqEnd).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    d3.selectAll(".brush").call(brush.extent([seqStart, seqEnd]));

    delete_icm_tracks();
}

//$("#highlight").click(function(){
function highlight(){

    //dbrowser.clearHighlights();
    dbrowser.highlights = [];
    dbrowser.highlightRegion(chrId, seqStart, seqEnd);
}
//);

//diff = Math.round(($('#size').val())*0.052);


//-----------------------------------------------------------------------------
// icm folding
//-----------------------------------------------------------------------------

function data_in_extent(data, extent){
    var newdata = null;

    if( data.hasOwnProperty('start') && data.hasOwnProperty('end') && data.hasOwnProperty('seq') )
    {
        var start = data.start;
        var end = data.end;
        var w = end-start+1;
        console.log("old seq length: ", w, data.seq.length);

        var l = Math.round(extent[0]);
        var r = Math.round(extent[1]);

        var cutleft = l - start;
        var cutright = r - start;
        var nw = r - l;

        newdata = {};
        newdata.chr = 'chr'+chrId;
        newdata.start = l;
        newdata.end = r;
        newdata.seq = data.seq.substring(cutleft, cutright);
        console.log("new seq length: ", nw, newdata.seq.length);
    }
    else {
    	var l = Math.round(extent[0]);
      var r = Math.round(extent[1]);
      
      newdata = {};
      newdata.chr = 'chr'+chrId;
      newdata.start = l;
      newdata.end = r;
      newdata.seq = data;
    }

    return newdata;
}


//var icmtracks = []; //here is the bug: a global var make the array accumulating. Change to a local var fixed it
$("#send2icm").click(function(){


    delete_icm_tracks();

    var data = getSequence();
    submit( data );
});


function getSequence(){
    // read data from genome browser

    var sources = dbrowser.sources;
    var tiers = dbrowser.tiers;
    var extent = brush.extent(); //[seqStart, seqEnd];

    var brushdata = {};
    for(id=0; id < sources.length; id++) {
        //console.log(sources[id]);

        if(sources[id].name === 'Genome'){
            var thistier = tiers[id];
            data = thistier.currentSequence;
            console.log("currentsequence: ", data);
            if(data === undefined) 
          	{brushdata = data_in_extent('AAA', extent);}
            else {           	
            	//alert(data.start);
                brushdata = data_in_extent(data, extent);
                //content = data.alphabet + ':chr' + data.name + ':' 
                //    + brushdata.start + '--' + brushdata.end + '\n' + brushdata.seq;

            }
        }
    }

    return brushdata;
}


$("#gettrack").click(function(){
    // read data from genome browser

    var sources = dbrowser.sources;
    var nucdata_s = [];
    var nucfamilytype = [];
    //alert(sources.bwgURI);
    var tiers = dbrowser.tiers;
    var seqdata = getSequence();
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    //console.log(sequencedata.start);
    //alert(tiers[1].currentFeatures);
    //console.log("length"+tiers[1].currentFeatures.length)
    //console.log("Feature"+tiers[1].currentFeatures);
    //console.log(tiers[0].currentSequence);
    for (id=0; id < tiers[1].currentFeatures.length; id++){
    	var diffm = tiers[1].currentFeatures[id].min - seqdata.start
    	var diff2 = seqdata.end - tiers[1].currentFeatures[id].max
    	var diff3 = tiers[1].currentFeatures[id].max - tiers[1].currentFeatures[id].min
    	if(diff3<145 || diff3>150){
    		alert('Please use a track with nucleosome positioning information');
    		break;
    	}
    	//console.log(diff);
    	else if(diffm > 0 && diff2 > 0){
    	nucdata_s.push(diffm);
    	nucfamilytype.push('oct.par');       
    }
    }
    if(nucdata_s.length !== 0){

    diff = Math.round(($('#size').val())*0.052);
    zoomin();
    posting = $.post("../../SRC/jason/foldall.php", {seqdata: seqdata, nucdata: nucdata_s, nucfa: nucfamilytype, tempn: Tempi,diff:diff, addr: sessionnum}, "json");
    window.open(chromatinpage5, 'JsmolChromatin', 'width=500,height=500');

    posting.done(function(data) {
        window.open(chromatinpage, 'JsmolChromatin', 'width=500,height=500');
        parent.location.reload();
    });
 }

});

$("#trackcolorold").click(function(){
    // read data from genome browser

    var sources = dbrowser.sources;
    var trackstart = [];
    var trackend = [];
    var trackscore = [];
    //alert(sources.bwgURI);
    var tiers = dbrowser.tiers;
    var seqdata = getSequence();
    var seqstart = seqdata.start;
    var seqend = seqdata.end;
    var seqchr=seqdata.chr;
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    console.log(tiers[1].currentFeatures);
    console.log(tiers[1].dasSource.bwgURI);
    console.log(seqchr);
    for (id=0; id < tiers[1].currentFeatures.length; id++){
    		var tierstart = tiers[1].currentFeatures[id].min
    		var tierend = tiers[1].currentFeatures[id].max
    		var tierscore = tiers[1].currentFeatures[id].score
    		trackstart.push(tierstart);
    		trackend.push(tierend);
    		trackscore.push(tierscore);      
    }
    console.log(trackstart);
    console.log(trackend);
    console.log(trackscore);
    posting = $.post("../../SRC/jason/trackcolorold.php", {trackstart: trackstart,trackend: trackend,trackscore: trackscore, seqstart:seqstart, seqend: seqend, addr: sessionnum}, "json");
    window.open(chromatinpage5, 'JsmolChromatin4', 'width=500,height=500');

	 posting.done(function(data){
		
	 window.open(chromatinpage7, 'JsmolChromatin4', 'width=500,height=500');
	 })

});

$("#trackcolor").click(function(){
    // read data from genome browser

    var sources = dbrowser.sources;
    var tiers = dbrowser.tiers;
    var seqdata = getSequence();
    var seqstart = seqdata.start;
    var seqend = seqdata.end;
    var seqchr=seqdata.chr;
    var bwurl=tiers[1].dasSource.bwgURI;
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    console.log(bwurl);

    posting = $.post("../../SRC/jason/trackcolor.php", {bwurl: bwurl,seqchr: seqchr, seqstart:seqstart, seqend: seqend, addr: sessionnum}, "json");
    window.open(chromatinpage5, 'JsmolChromatin4', 'width=500,height=500');

	 posting.done(function(data){
		
	 window.open(chromatinpage7, 'JsmolChromatin4', 'width=500,height=500');
	 })

});


var posting;
var re;
function submit( data ) {
    // send sequence to server, server side code submit.php will save seqence as seqin.txt, and exec run-icm.tcsh
    //posting = $.post( "submit.php", {start: seqStart, end: seqEnd, seq: seq_CAGa, nuc: nucs.data()}, "json");
    console.log("posting to submit.php provides: ", data);
    posting = $.post("submit.php", data, "json");


    posting.done(function( data ) {
        console.log("posting to submit.php returns: ", data);

        showIcmTracks();
    });

}



function delayRun(code,time) {
	var t = setTimeout(code,time);};


function showIcmTracks() {
    // update browser panel
    //var newtracks = ["Buckle", "Prop-Tw", "Roll", "Shift", "Stagger", "Tilt", "Opening", "Rise", "Shear", "Slide", "Stretch", "Twist", "E", "Positions"];
    //var newtracks = ["Tilt", "Roll", "Twist" ,"Shift", "Slide", "Rise", "E", "Positions"];
    //var newtracks = ["chr22", "Roll", "Slide", "Twist"];
    var newtracks = ["Roll", "Slide", "Twist"];
    //var newtracks = ["chr10"];
    var icmtracks = [];
    //$.each( jQuery.parseJSON(data), function(i,d){
    $.each( newtracks, function(i,d){
        icmtracks.push({name: 'i-'+d, url: icm_server_addr + d + '.bw'});
     //   icmtracks.push({name: d, url: icm_server_addr + d + '.bw'});
    });

    //console.log("icmtracks: ", icmtracks);
    add_icm_tracks( icmtracks );

    //dbrowser.setLocation(chr, extent[0], extent[1]); 
    zoomin();

}


$("#senddefault").click(function(){

    delete_icm_tracks();
    diff = Math.round(($('#size').val())*0.052);

    var nucdata = nucs.data();
    var nucdata_s = [];

    nucdata.forEach(function(d,i) {
    	  //if (Math.floor(d.start)==0){nucdata_s.push( Math.floor(d.start+1)}
    	 // else{
        nucdata_s.push( Math.floor(d.start+1) );
     //}
    });

    console.log("send nuc positions: ", nucdata_s);


    zoomin();
    var seqdata = getSequence();
    console.log("send seq : ", seqdata);
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    
    //console.log("temp:", Tempi);


    // send the simple version of nuc position for now
    posting = $.post("../../SRC/jason/submit.php", {seqdata: seqdata, nucdata: nucdata_s, tempn: Tempi, diff:diff, addr: sessionnum}, "json");
    window.open(chromatinpage5, 'JsmolChromatin', 'width=500,height=500');

    posting.done(function(data) {
        console.log(data);
        //top.frames['c'].location.reload();

        
        //update_position_dat();
        //update_icm_dat();
        //showIcmTracks();

        window.open(chromatinpage, 'JsmolChromatin', 'width=500,height=500');
        parent.location.reload();
    });

});

$("#send30").click(function(){

    delete_icm_tracks();
    diff = Math.round(($('#size').val())*0.052);

    var nucdata = nucs.data();
    var nucdata_s = [];

    nucdata.forEach(function(d,i) {
        nucdata_s.push( Math.floor(d.start+1) );
    });

    console.log("send nuc positions: ", nucdata_s);


    zoomin();
    var seqdata = getSequence();
    console.log("send seq : ", seqdata);
    
    
    console.log("temp:", Tempi);


    // send the simple version of nuc position for now
    posting = $.post("fold.php", {seqdata: seqdata, nucdata: nucdata_s, tempn: Tempi,diff:diff}, "json");
    window.open(chromatinpage5, 'JsmolChromatin', 'width=500,height=500');

    posting.done(function(data) {
        console.log(data);
        //top.frames['c'].location.reload();

        //showIcmTracks();
        //update_position_dat();
        //update_icm_dat();

        window.open(chromatinpage, 'JsmolChromatin', 'width=500,height=500');
        parent.location.reload();
    });

});

$("#senduni").click(function(){

	 var phi = $("#Phi").val();
	 var Lk = $("#Lk").val();
	 diff = Math.round(($('#size').val())*0.052);
    zoomin();
    var seqdata = getSequence();     
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    posting = $.post("../../SRC/jason/fold.php", {seqdata: seqdata, Phise: phi, Lk: Lk, tempn: Tempi,diff:diff, addr: sessionnum}, "json");
    window.open(chromatinpage5, 'JsmolChromatin', 'width=500,height=500');

    posting.done(function(data) {
        console.log(data);
        //alert(data);
        window.open(chromatinpage, 'JsmolChromatin', 'width=500,height=500');
        parent.location.reload();
    });

});

$("#sendnucpos").click(function(){

    //delete_icm_tracks();

    var nucdata = nucs.data();
    var nucdata_s = [];
    var nucfamilytype = [];
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    diff = Math.round(($('#size').val())*0.052);

    nucdata.forEach(function(d,i) {
        nucdata_s.push( Math.floor(d.start+1) );
        nucfamilytype.push(d.Xnuc);
    });
    zoomin();
    var seqdata = getSequence();
    posting = $.post("../../SRC/jason/foldall.php", {seqdata: seqdata, nucdata: nucdata_s, nucfa: nucfamilytype, tempn: Tempi,diff:diff, addr: sessionnum}, "json");
    window.open(chromatinpage5, 'JsmolChromatin', 'width=500,height=500');

    posting.done(function(data) {
        window.open(chromatinpage, 'JsmolChromatin', 'width=500,height=500');
        parent.location.reload();
    });

});

$("#freedna").click(function(){
    var nucdata = nucs.data();
    var nucdata_s = [];
    var nucfamilytype = [];

    nucdata.forEach(function(d,i) {
        nucdata_s.push( Math.floor(d.start+1) );
        nucfamilytype.push(d.Xnuc);
    });

    console.log("send nuc positions: ", nucdata_s);


    zoomin();
    var seqdata = getSequence();
    console.log("send seq : ", seqdata);
    
    
    console.log("temp:", Tempi);
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    console.log("addr",sessionnum);
	
	posting = $.post("../../SRC/jason/runfree.php", {seqdata: seqdata, tempn: Tempi, addr: sessionnum}, "json");
	window.open(chromatinpage5, 'JsmolChromatin3', 'width=500,height=500');
	
	posting.done(function(data){
	//	alert(data);
	window.open(chromatinpage3, 'JsmolChromatin3', 'width=500,height=500');
	})
});

$("#freednam").click(function(){
    var nucdata = nucs.data();
    var nucdata_s = [];
    var nucfamilytype = [];

    nucdata.forEach(function(d,i) {
        nucdata_s.push( Math.floor(d.start+1) );
        nucfamilytype.push(d.Xnuc);
    });

    console.log("send nuc positions: ", nucdata_s);


    zoomin();
    var seqdata = getSequence();
    console.log("send seq : ", seqdata);
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    
    console.log("temp:", Tempi);
	
	posting = $.post("../../SRC/jason/runfreem.php", {seqdata: seqdata, tempn: Tempi, addr: sessionnum}, "json");
	window.open(chromatinpage5, 'JsmolChromatin3', 'width=500,height=500');
	
	posting.done(function(data){
	window.open(chromatinpage6, 'JsmolChromatin3', 'width=500,height=500');
	})
});

$("#allatom").click(function(){
    var nucdata = nucs.data();
    var id = nucs.selection();   
	 var nstart = Math.floor(nucdata[id].start);
    var seqdata = getSequence();
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    
	posting = $.post("../../SRC/jason/allatom.php", {seqdata: seqdata, nstart: nstart, addr: sessionnum}, "json");
	window.open(chromatinpage5, 'JsmolChromatin4', 'width=500,height=500');
	
	posting.done(function(data){
	//alert(data);	
	window.open(chromatinpage4, 'JsmolChromatin4', 'width=500,height=500');
	})
});

$("#nucfamily").click(function(){

	window.open(chromatinpage3, 'JsmolChromatin', 'width=500,height=500');

});

$("#minimize").click(function(){
	var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
	posting = $.post("../../SRC/jason/runlammps.php",{tempn: Tempi, addr: sessionnum}, "json");
	window.open(chromatinpage5, 'JsmolChromatin2', 'width=500,height=500');
	posting.done(function(data){
	//	alert(data);
	window.open(chromatinpage2, 'JsmolChromatin2', 'width=500,height=500');
	})
});

$("#sessionhg19").click(function(){
	//posting = $.post("session.php",{tempn: Tempi}, "json");
	posting = $.post("../../SRC/jason/sessionhg19.php");
	
	posting.done(function(data){
	var n = data.length;
	var sessionpage = serverurl.substring(0, serverurl.lastIndexOf('sessions'));
	sessionpage = sessionpage + "sessions/" + parseInt(data) +"/icmgb-dna.html"
	location.replace(sessionpage);
	})
});

$("#sessionhg38").click(function(){
	//posting = $.post("session.php",{tempn: Tempi}, "json");
	posting = $.post("../../SRC/jason/sessionhg38.php");
	
	posting.done(function(data){
	var n = data.length;
	var sessionpage = serverurl.substring(0, serverurl.lastIndexOf('sessions'));
	sessionpage = sessionpage + "sessions/" + parseInt(data) +"/icmgb-dna.html"
	location.replace(sessionpage);
	})
});

$("#sessionmm10").click(function(){
	//posting = $.post("session.php",{tempn: Tempi}, "json");
	posting = $.post("../../run-session/sessionmm10.php");
	
	posting.done(function(data){
	var n = data.length;
	var sessionpage = serverurl.substring(0, serverurl.lastIndexOf('sessions'));
	sessionpage = sessionpage + "sessions/" + data.substring(44,n-3) +"/icmgb-dna.html"
	location.replace(sessionpage);
	//window.open(sessionpage);
	})
});

$("#sessionsusScr3").click(function(){
	//posting = $.post("session.php",{tempn: Tempi}, "json");
	posting = $.post("../../run-session/sessionsusScr3.php");
	
	posting.done(function(data){
	var n = data.length;
	var sessionpage = serverurl.substring(0, serverurl.lastIndexOf('sessions'));
	sessionpage = sessionpage + "sessions/" + data.substring(47,n-3) +"/icmgb-dna.html"
	location.replace(sessionpage);
	//window.open(sessionpage);
	})
});

$("#sessionsacCer3").click(function(){
	posting = $.post("../../SRC/jason/sessionsacCer3.php");
	
	posting.done(function(data){
	var n = data.length;
	var sessionpage = serverurl.substring(0, serverurl.lastIndexOf('sessions'));
	sessionpage = sessionpage + "sessions/" + parseInt(data) +"/icmgb-dna.html"
	location.replace(sessionpage);
	})
});

$("#color2").click(function(){
    var nucdata = nucs.data();
    var id = nucs.selection();   
	 var nstart = Math.floor(nucdata[id].start);
    var seqdata = getSequence();
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    //alert(id);
	posting = $.post("../../SRC/jason/color.php", {seqdata: seqdata, nstart: nstart, addr: sessionnum}, "json");
	window.open(chromatinpage5, 'JsmolChromatin4', 'width=500,height=500');
	
	posting.done(function(data){
	//alert(data);	
	window.open(chromatinpage7, 'JsmolChromatin4', 'width=500,height=500');
	})
});

$("#color").click(function(){
    //var nucdata = nucs.data();
    var id = nucs.selection();   
	 //var nstart = Math.floor(nucdata[id].start);
    //var seqdata = getSequence();
    var sessionnum=icm_server_addr.substring(icm_server_addr.lastIndexOf('sessions')+9, icm_server_addr.lastIndexOf('/tmpdata'));
    //alert(cols);
    //var ids=id.toString();
    console.log("session: ",sessionnum );
    console.log("id : ", id);
    console.log("color : ", cols);
	posting = $.post("../../SRC/jason/color.php", {nucid: id, addr: sessionnum, col:cols}, "json");
	window.open(chromatinpage5, 'JsmolChromatin4', 'width=500,height=500');
	
	posting.done(function(data){
	//alert(data);	
	window.open(chromatinpage7, 'JsmolChromatin4', 'width=500,height=500');
	})
});

$("#rename").click(function(){
	//posting = $.post("session.php",{tempn: Tempi}, "json");
	posting = $.post("rename.php");
	
	posting.done(function(data){
	alert('done');
	})
});

$("#reload").click(function(){
	parent.location.reload();
});


$("#ShowTracks").click(function(){
	update_position_dat();
	update_icm_dat();
	showIcmTracks();
});

update_position_dat();
update_icm_dat();


function showicmtr(){
	var seqdata = getSequence();
    //console.log("send seq : ", seqdata);
    posting = $.post("test.php", {seqdata: seqdata}, "json");

    posting.done(function(data) {
        //console.log(data);
        update_position_dat();
        update_icm_dat();
        showIcmTracks();
    });
	
}

$("#deleteicmtracks").click(delete_icm_tracks);


function delete_icm_tracks(){

    var tiers = dbrowser.tiers;
    var nt = tiers.length;

    //console.log("all tiers: ", nt, tiers);

    var sources = [];
    for(var i=1; i< nt; i++){
        var s = tiers[i].dasSource;
        console.log("add to delete list: ", s.name);
        if(s.name.indexOf('i-') != -1) sources.push(s);
        //sources.push(s);
    }

    for(var i=0; i<sources.length; i++) dbrowser.removeTier(sources[i]);    
}


function add_icm_tracks( tracks ) {


    $.each(tracks, function(i, d) {
        dbrowser.addTier({name: d.name, desc: 'TmBLab Wig',
                          pennant: 'http://genome.ucsc.edu/images/encodeThumbnail.jpg',
                          bwgURI: d.url,
                          style: [{type: 'bigwig', style: {glyph: 'LINEPLOT', BGCOLOR: '#ea115', FGCOLOR: 'green', HEIGHT: 40, id: 'style1'}}], 
                          noDownsample: true});
    });

}

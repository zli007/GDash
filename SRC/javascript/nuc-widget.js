/**
 * 〈Namespace〉 namespace.
 */
if (typeof icmgb == "undefined") {
  var icmgb = {};
};

console.log("name space icmgb is:", icmgb);

icmgb.nucwidget = function() {

    var _seqlen = 1000;
    var _nuclen = 147;
    var _linklen = 80;
    var _minlink = 20;
    var _nucdata = [];
    //var _nucdata = [{start: 0, end: 147, len: 147, Xnuc: "default.par"}];

    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 960,
        height = 30;

    var selection = -1;
    var dragoffset = 0;

    var xScale = d3.scale.linear().domain([0, _seqlen]).range([0, width-margin.left-margin.right]),
        yScale = d3.scale.linear().domain([0, 200]).range([0, height-margin.top-margin.bottom]),
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);

    function X(d) {
        //console.log(xScale(d.start));
        return xScale(d.start);
    }
    function W(d) {
        //console.log(xScale(d.len));
        return xScale(d.len);
    }
    function H(d) {
        //console.log(d.value, yScale(d.value));
        return yScale(d.value);
    }
    function Y(d) {
        return height-margin.top-margin.bottom - H(d);
    }
    function formatData() {
        var domain = yScale.domain();
        var dv = (domain[0] + domain[1]) / 2;

        _nucdata.forEach(function(d,i){
            d.start = +d.start;
            d.end = +d.end;
            d.len = +d.len;
            d.value = dv;
        });
    }

    var color = d3.scale.category20();
    var drag = d3.behavior.drag()
        //.origin(function(d) { return d; })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    function dragstarted(d, i) {
        //d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
        d3.select(this).classed("selected", false);
        d3.select(this).style("cursor", "move");

        var g = d3.select(".nucwidget");
        var p = d3.mouse(g.node())[0];   
        var x = d3.select(this).attr('x');
        dragoffset = p-x;
    }

    function dragged(d, i) {
        //console.log(d3.event.sourceEvent.x);
        //console.log(d3.mouse(svg.node()));
        var g = d3.select(".nucwidget");
        var p = d3.mouse(g.node())[0];
        var x = d3.select(this).attr('x');
        //console.log(x, p);

        var left = 0, right = xScale.range()[1] - xScale(_nucdata[_nucdata.length-1].len);
        if(i > 0) left = xScale(_nucdata[i-1].end + _minlink);
        if(i < _nucdata.length-1) right = xScale(_nucdata[i+1].start - d.len - _minlink);
        var nx = d3.min([right, d3.max([left, p-dragoffset])]);
        //console.log(i, x, left, right, nx);

        d3.select(this).attr("x", nx); //.attr("cy", d.y = d3.event.y);
        d.start = xScale.invert(nx);
        d.end = d.start + d.len;
    }

    function dragended(d, i) {
        d3.select(this).classed("dragging", false);
    }

    function mouseclick(d, i) {
        //console.log("mouse click");
        d3.select(".nucwidget").selectAll("rect").classed("selected", false);
        d3.select(this).classed("selected", true);
        selection = i;
    }

    function mouseover(d, i) {
        //console.log("mouse over");
        //d3.select(this).style("cursor", "move");
    }

    var svg;

    function update() {

        svg.attr("width", width)
           .attr("height", height);

        var g = d3.select(".nucwidget");
        g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var widgets = g.selectAll("rect").data(_nucdata);
        if(selection == -1) widgets.classed("selected", false);
        
        widgets.enter().append("rect");
        widgets
            .attr("x", X)
            .attr("y", Y)
            .attr("width", W)
            .attr("height", H) //height-margin.bottom-margin.top)
            .classed("selected", function(d,i){ return i==selection; })
            .style("fill-opacity", 0.3)
            .call(drag)
            .on("click", mouseclick)
            .on("mouseover", mouseover);

        widgets.exit().remove();
    }


    var nucwidget = function(selection) {

        selection.each(function(){

            //console.log("nucdata: ", _nucdata);

            // Select the svg element, if it exists.
            svg = d3.select(this).selectAll("svg");
            console.log("svg: ", svg[0][0]);

            // Otherwise, create the skeletal chart.
            if(svg[0][0] == undefined){ 
                svg = d3.select(this).append("svg");
                console.log("new svg: ", svg);
            }

            svg.attr("width", width)
               .attr("height", height);

            svg.append("g").attr("class", "nucwidget");
            update();


        });
    };

    nucwidget.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        xScale.range([0, width - margin.left - margin.right]);
        yScale.range([0, height - margin.top - margin.bottom]);
        return nucwidget;
    };

    nucwidget.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        xScale.range([0, width - margin.left - margin.right]);
        return nucwidget;
    };

    nucwidget.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        yScale.range([0, height - margin.top - margin.bottom]);
        return nucwidget;
    };
    nucwidget.seqlen = function(_) {
        if (!arguments.length) return _seqlen;
        _seqlen = _;
        xScale.domain([0, _seqlen]);
        return nucwidget;
    };

    nucwidget.data = function(_) {
        if (!arguments.length) return _nucdata;
        _nucdata = _;

        formatData();

        console.log("nucwidget.data(): ", yScale.domain(), _seqlen, _nuclen, _linklen, _nucdata);
        update();
        return nucwidget;
    };


    nucwidget.h = function(_) {


        var aug = _;
        var len = aug.length;

        _nucdata.forEach(function(d,i) {
            var sid = d.start;
            if(sid < len) d.value = +aug[sid][1];
        });
        //console.log("nucwidget.js: data: ", _nucdata);

        var extent = d3.extent(aug, function(d) { return +d[1]; });
        yScale.domain(extent);
        //var maxy = d3.max(_nucdata, function(d){ return d.value; });
        //yScale.domain([0, maxy]);
        console.log("nucwidget.js: yScale domain: ", extent);

        update();
        return nucwidget;
    };

    nucwidget.initdata = function(seqlen, nuclen, linklen) {
        if(linklen < _minlink) {
            alert("link length is less than mininum value" + _minlink);
            return;
        }

        _seqlen = seqlen;
        _nuclen = nuclen;
        _linklen = linklen;

        xScale.domain([0, _seqlen]);

        var l = _nuclen + _linklen;
        var n = (_seqlen - _nuclen) / l;
        for( var i=0; i<n; i++){
            _nucdata.push({start: i * l, end: i*l+nuclen, len: nuclen, value: 100, Xnuc: 'default.par'});
        }

        console.log("nucwidget.initdata(): ", _seqlen, _nuclen, _linklen, _nucdata);
        return nucwidget;
    };

    // add one nuc at the left side of nuc[index]
    nucwidget.addleft = function(index, nuclen, nucdat) {

        var end = _nucdata[index].start - _minlink;
        var start = 0;
        if(index > 0) start = _nucdata[index-1].end + _minlink;

        var room = end - start;

        if(room < nuclen) {
            alert("not enough room to add one more nuc with length " + nuclen);
            return nucwidget;
        }
        
        var domain = yScale.domain();
        var dv = (domain[0] + domain[1]) / 2;
        _nucdata.splice(index, 0, {start: end-nuclen, end: end, len: nuclen, value: dv, Xnuc: nucdat});

        selection = index;

        update();
        return nucwidget;
    };


    // add one nuc at the right side of nuc[index]
    nucwidget.addright = function(index, nuclen, nucdat) {
        var lastind = _nucdata.length-1;
        var start = _nucdata[index].end + _minlink;
        var end = _seqlen;
        if(index < lastind) end = _nucdata[index+1].start - _minlink;

        var room = end - start;
        if(room < nuclen) {
            alert("not enough room to add one more nuc with length " + nuclen);
            return nucwidget;
        }
        
        var domain = yScale.domain();
        var dv = (domain[0] + domain[1]) / 2;
        _nucdata.splice(index+1, 0, {start: start, end: start+nuclen, len: nuclen, value: dv, Xnuc: nucdat});

        selection = index+1;

        update();
        return nucwidget;
    };


    nucwidget.delete = function(index) {
        _nucdata.splice(index, 1);
        selection = -1;
        update();
        return nucwidget;
    };

    nucwidget.selection = function(_) {
        if (!arguments.length) return selection;
        selection = _;
        return nucwidget;
    };

    nucwidget.change = function(index, nuclen, nucX) {
        console.log("nucwidget change: ", index, nuclen, nucX);

        _nucdata[index].len = nuclen;
        _nucdata[index].end = _nucdata[index].start + nuclen;
        _nucdata[index].Xnuc = nucX;
        update();
        return nucwidget;
    };



    return nucwidget;
};

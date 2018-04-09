//create namespace
if (typeof icmgb == "undefined") {
  var icmgb = {};
};

console.log("name space icmgb is:", icmgb);


//function timeSeriesChart() {
icmgb.icmdatChart = function(){
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
    width = 760,
    height = 120,
    data = [[0,0]],
    xValue = function(d) { return +d[0]; },
    yValue = function(d) { return +d[1]; },
    //xScale = d3.time.scale(),
    xScale = d3.scale.linear(),
    yScale = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
    yAxis = d3.svg.axis().scale(yScale).orient("left"),
    area = d3.svg.area().x(X).y1(Y),
    line = d3.svg.line().x(X).y(Y);

    // private functions
    // The x-accessor for the path generator; xScale's xValue.
    function X(d) {
        //console.log(d[0], xScale(d[0]));
        return xScale(d[0]);
    }

    // The x-accessor for the path generator; yScale's yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    function formatData() {
        // Convert data to standard representation greedily;
        // this is needed for nondeterministic accessors.
        data = data.map(function(d, i) {
            return [xValue.call(data, d, i), yValue.call(data, d, i)];
        });

        //console.log(data);
    }

    function updateScaleDomain() {
        // Update the x-scale.
        var extent = d3.extent(data, function(d) { return d[0]; })
        xScale.domain(extent);
        console.log("icmdatChart: xScale domain: ", extent);

        // Update the y-scale.
        //var maxy = d3.max(data, function(d) { return d[1]; });
        //yScale.domain([0, maxy]);
        extent = d3.extent(data, function(d) { return d[1]; });
        yScale.domain(extent);
        console.log("icmdatChart: yScale domain: ", extent);
    }


    var svg;

    function update() {

        // svg .attr("width", width)
        //     .attr("height", height);
        //var fd = data[0];
        //console.log(xScale, yScale);
        //console.log(fd, xScale(fd[0]), yScale(fd[1]));


        var g = d3.select(".icmdat").datum(data);
        g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Update the area path.
        //g.select(".tscarea")
        //    .attr("d", area.y0(yScale.range()[0]));

        // Update the line path.
        g.select(".tscline")
            .attr("d", line);

        // Update the x-axis.
        g.select(".x.tscaxis")
            .attr("transform", "translate(0," + yScale.range()[0] + ")")
            .call(xAxis);

        //console.log("update y axis");
        g.select(".y.tscaxis")
            .call(yAxis);

    }


    // public: will return this object
    var chart = function(selection) {
        selection.each(function() {
            
            // Select the svg element, if it exists.
            svg = d3.select(this).selectAll("svg"); //.data([data]); 
            console.log("svg: ", svg[0][0]);

            // Otherwise, create the skeletal chart.
            if(svg[0][0] === undefined){ 
                svg = d3.select(this).append("svg");
                console.log("new svg: ", svg);
            }

            svg .attr("width", width)
                .attr("height", height);

            var g = svg.append("g").attr("class", "icmdat");
            //g.append("path").attr("class", "tscarea");
            g.append("path").attr("class", "tscline");
            g.append("g").attr("class", "x tscaxis");
            g.append("g").attr("class", "y tscaxis");

            update();

        });
    };



    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        xScale.range([0, width - margin.left - margin.right]);
        yScale.range([height - margin.top - margin.bottom, 0]);
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;

        var extent = [0, width - margin.left - margin.right]
        xScale.range(extent);
        console.log("icmdatChart: xScale range: ", extent);

        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;

        var extent = [height - margin.top - margin.bottom, 0];
        yScale.range(extent);
        console.log("icmdatChart: yScale range: ", extent);

        return chart;
    };
    chart.data = function(_) {
        if (!arguments.length) return data;
        data = _;
        //console.log("set module data: ", data);

        formatData();
        updateScaleDomain();

        update();
        return chart;
    };
    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    return chart;
};

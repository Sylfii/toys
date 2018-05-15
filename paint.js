function draw_Create(data, field_id) {
    var margin = { top:80, right: 40, bottom: 80, left: 40},
        width = (data.length < 25 ? data.length * 50 : 1000),
        height = 400 - margin.top - margin.bottom, tip, x, y;

    if (data.length > 100) {
        width = 200;
        tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d.y + "</span>";
                })

        var val_min = Math.min.apply(Math,data.map(function(d){return d[fields[field_id]];}));
        var val_max = Math.max.apply(Math,data.map(function(d){return d[fields[field_id]];}));
        var bin_num = 4;
        var histogram = d3.layout.histogram()
                        .value(function(d) {return d[fields[field_id]]; })
                        .range([val_min, val_max])
                        .bins(bin_num)
                        .frequency(true);
        var histData = histogram(data);

        var rect_step = 50;
        var heights = [];
        for (var i = 0; i < histData.length; i++) {
            heights.push( histData[i].y );
        }

        x = d3.scale.ordinal()
            .domain(histData.map(function(d) {
                return d.x;
            }))
            .rangeRoundBands([0, width]);
        y = d3.scale.linear()
            .domain([0, d3.max(heights)])
            .range([height, 0]);
    }
    else {
        tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d["COUNT(*)"] + "</span>";
                })

        x = d3.scale.ordinal()
            .domain(data.map(function(d) {
                return d[fields[field_id]];
            }))
            .rangeRoundBands([0, width]);

        y = d3.scale.linear()
            .domain([0, Math.max.apply(Math,data.map(function(d){
                return d["COUNT(*)"];}))])
            .range([height, 0]);
    }

    var svg = d3.select("#" + fields[field_id]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var bar1 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", fields[field_id] + "_1");
    var bar2 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", fields[field_id] + "_2");

    bar1.call(tip);
    //var formatPercent = d3.format(".0%");

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

    bar1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    bar1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    if (data.length > 100) {
        bar1.selectAll(".bar")
            .data(histData)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) {
                return x(d.x);
            })
            .attr("y", function(d, i) {
                return y(d.y);
            })
            .attr("width", x.rangeBand() - 1)
            .attr("height", function(d) {
                return height - y(d.y);
            })
            .attr("fill", "BurlyWood")
            .on("click", function() {
                console.log(this.id);
                d3.select(this).attr("fill", "orangered");
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
    }
    else {
        bar1.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d[fields[field_id]]);
            })
            .attr("width", x.rangeBand()-1)
            .attr("height", function(d) {
                return height - y(d["COUNT(*)"]);
            })
            .attr("y", function(d) {
                return y(d["COUNT(*)"]);
            })
            .attr("fill", "BurlyWood")
            .on("click", function() {
                console.log(this.id);
                d3.select(this).attr("fill", "orangered");
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
    }

    bar1.append("text")
        .attr("x", (width/2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "underline")
        .text(function(d) {
            return fields[field_id];
        });
}

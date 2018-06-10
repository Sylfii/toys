/* --- fraw_Create function --- */
// This function will be called when the data are loaded successfully
// it will draw all the field's chart but will not display it.
function draw_Create(data, field_id) {
    //it determines how large a chart is.
    var margin = { top:80, right: 40, bottom: 80, left: 40},
        width = (data.length < 25 ? data.length * 50 : 1000),
        height = 400 - margin.top - margin.bottom, tip;

    // if this data is too long, use a histogram to show it.
    if (data.length > 100) {
        width = 200;
        //it will show an panel with specific information when you hover your mouse on an bar.
        tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d.y + "</span>";
                })

        // this determines the range of the histogram x axis
        var val_min = Math.min.apply(Math,data.map(function(d){return d[fields[field_id]];}));
        var val_max = Math.max.apply(Math,data.map(function(d){return d[fields[field_id]];}));
        // use only 4 bins to show the data.
        var bin_num = 4;
        histogram[field_id] = d3.layout.histogram()
                        .value(function(d) {return d[fields[field_id]]; })
                        .range([val_min, val_max])
                        .bins(bin_num)
                        .frequency(true);
        var histData = histogram[field_id](data);

        // it determines the height of each bar.
        var heights = [];
        for (var i = 0; i < histData.length; i++) {
            heights.push( histData[i].y );
        }

        // scale for x axis
        xScale[field_id] = d3.scale.ordinal()
            .domain(histData.map(function(d) {
                return d.x;
            }))
            .rangeRoundBands([0, width]);
        // scale for y axis
        yScale[field_id] = d3.scale.linear()
            .domain([0, d3.max(heights)])
            .range([height, 0]);
    }
    // otherwise we use bar chart to show data
    else {
        //it will show an panel with specific information when you hover your mouse on an bar.
        tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d["COUNT(*)"] + "</span>";
                })

        // scale for x axis
        xScale[field_id] = d3.scale.ordinal()
            .domain(data.map(function(d) {
                return d[fields[field_id]];
            }))
            .rangeRoundBands([0, width]);

        // scale for y axis
        yScale[field_id] = d3.scale.linear()
            .domain([0, Math.max.apply(Math,data.map(function(d){
                return d["COUNT(*)"];}))])
            .range([height, 0]);
    }

    // create a svg for this data.
    var svg = d3.select("#page2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", fields[field_id]);
    //$("#" + fields[field_id]).hide();

    // bar1 contains the bars of the data itself.
    var bar1 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", fields[field_id] + "_1");
    // bar2 contains the bars of the data filtered.
    var bar2 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", fields[field_id] + "_2");

    bar1.call(tip);
    //var formatPercent = d3.format(".0%");

    // use the scale to set x axis.
    var xAxis = d3.svg.axis()
            .scale(xScale[field_id])
            .orient("bottom");
    // use the scale to set y axis.
    var yAxis = d3.svg.axis()
            .scale(yScale[field_id])
            .orient("left")
            .ticks(10);

    // draw x axis
    bar1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    // draw y axis
    bar1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    // draw histogram bars
    if (data.length > 100) {
        bar1.selectAll(".bar")
            .data(histData)
        .enter().append("rect")
            .attr("class", field_id + " bar")
            .attr("id", function(d) {
                return '(' + fields[field_id] + ">=" + d.x + " AND " +
                             fields[field_id] + "<" + (d.x + d.dx) + ")";
            })
            .attr("x", function(d, i) {
                return xScale[field_id](d.x) + xScale[field_id].rangeBand()/2;
            })
            .attr("y", function(d, i) {
                return yScale[field_id](d.y);
            })
            .attr("width", xScale[field_id].rangeBand())
            .attr("height", function(d) {
                return height - yScale[field_id](d.y);
            })
            .attr("fill", "BurlyWood")
            .on("click", function() {
                var ord = parseInt(this.classList[0]);
                var p = $.inArray(this.id, constraint[ord]);
                if (p == -1) {
                    d3.select(this).attr("fill", "orangered");
                    constraint[ord].push(this.id);
                }
                else {
                    d3.select(this).attr("fill", "BurlyWood");
                    constraint[ord].splice(p, 1);
                }
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
    }
    // draw bar chart bars
    else {
        bar1.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", field_id + " bar")
            .attr("id", function(d) {
                return fields[field_id] + "='" + d[fields[field_id]] + "'";
            })
            .attr("x", function(d) {
                return xScale[field_id](d[fields[field_id]]);
            })
            .attr("width", xScale[field_id].rangeBand()-1)
            .attr("height", function(d) {
                return height - yScale[field_id](d["COUNT(*)"]);
            })
            .attr("y", function(d) {
                return yScale[field_id](d["COUNT(*)"]);
            })
            .attr("fill", "BurlyWood")
            .on("click", function() {
                var ord = parseInt(this.classList[0]);
                var p = $.inArray(this.id, constraint[ord]);
                if (p == -1) {
                    d3.select(this).attr("fill", "orangered");
                    constraint[ord].push(this.id);
                }
                else {
                    d3.select(this).attr("fill", "BurlyWood");
                    constraint[ord].splice(p, 1);
                }
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
    }

    // show this field name.
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

/* --- fraw_filter function --- */
// This function will be called each time you click button 'filter',
// it will draw the filtered bars.
function draw_filter(data, field_id) {
    //clear constraint selected before.
    for (let i in constraint[field_id]) {
        d3.select(document.getElementById(constraint[field_id][i])).attr("fill", "BurlyWood");
    }
    constraint[field_id] = [];

    //select the bar2 which is created before.
    var bar2 = d3.select("#" + fields[field_id] + "_2");
    if (histogram[field_id] != undefined) {
        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d.y + "</span>";
                })
        bar2.call(tip);

        var histData = histogram[field_id](data);
        bar2.selectAll(".bar")
            .data(histData)
        .enter().append("rect")
            .attr("class", field_id + " bar")
            .attr("x", function(d, i) {
                return xScale[field_id](d.x) + xScale[field_id].rangeBand()/2;
            })
            .attr("y", function(d, i) {
                return yScale[field_id](d.y);
            })
            .attr("width", xScale[field_id].rangeBand())
            .attr("height", function(d) {
                return 240 - yScale[field_id](d.y);
            })
            .attr("fill", "steelblue")
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
    }
    else {
        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Frequency:</strong> <span style='color:red'>" + d["COUNT(*)"] + "</span>";
                })
        bar2.call(tip);

        bar2.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", field_id + " bar")
            .attr("x", function(d) {
                return xScale[field_id](d[fields[field_id]]);
            })
            .attr("width", xScale[field_id].rangeBand()-1)
            .attr("height", function(d) {
                return 240 - yScale[field_id](d["COUNT(*)"]);
            })
            .attr("y", function(d) {
                return yScale[field_id](d["COUNT(*)"]);
            })
            .attr("fill", "steelblue")
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
    }
}

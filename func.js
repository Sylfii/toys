/* --- Startup Funciton --- */
// This function will be called when the index.html is openned.
// It shows the panel1 and set the function of submit
function startup() {
    $("#panel1").fadeIn();

    $('#forms').submit(function (event) {
        //if a database is loaded before, panel3 and switch button should be hidden
        event.preventDefault();
        $("#panel3").fadeOut();
        $("#Switch").fadeOut();

        //output what is happenning, it means getData.php is loading database
        output("Database loading...");

        var form = $(this);
        var formData = new FormData(this);
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: formData,
            dataType: 'json',
            mimeType: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success:function (msg) {
                //it seems php is difficult to throw an error.
                //since even I throw an error in getData.php, it still return to success.
                //I use an json text to pass error message to debug.
                if (msg['error']) {
                    output(msg['error']);
                }
                //if success with out error message, it will draw charts
                else if (msg['success']) {
                    fields = msg['success'];
                    output('Upload Success.');
                    creatPanel3();
                }
            },
            //this error function will be called only if getData.php has a syntax error
            error:function (e) {
                output("php error:" + e.statusText + ' ' + e.status);
            }
        });
    });

}

/* --- creatPage2 function --- */
// This function is used to create page2 which is used to draw Charts
function creatPage2() {
    //if page2 has been created before, it should be reset as well
    var page2 = document.getElementById("page2");
    if (page2 != null) {
        page2.parentNode.removeChild(page2);
    }
    page2 = document.createElement("div");
    page2.id = "page2";
    page2.setAttribute("class", "page");
    document.getElementById("pages").appendChild(page2);
}

/* --- creatPanel3 function --- */
// This function is used to create panel3 which shows the checkboxes and buttons
function creatPanel3() {
    // if a panel3 has been created before, delete it.
    var res = document.getElementById("panel3");
    if (res != null) {
        res.parentNode.removeChild(res);
    }

    var panel3 = document.createElement("div");
    panel3.id = "panel3";

    // use a list to display checkboxes, thos checkboxes' names are the fields of data
    var ul = document.createElement("ul");
    for (let field_id in fields) {
        var li = document.createElement("li")
        var label = document.createElement("label");
        var checkBox = document.createElement("input");
        var span = document.createElement("span");
        span.innerHTML = fields[field_id];
        checkBox.type = "checkbox";
        checkBox.id = fields[field_id] + "_checkbox";
        label.appendChild(checkBox);
        label.appendChild(span);
        li.appendChild(label);
        ul.appendChild(li);
    }
    panel3.appendChild(ul);

    // the checkbox 'Normalize'.
    // this checkbox determines whether to normalize data or not.
    var label = document.createElement("label");
    var checkBox = document.createElement("input");
    var span = document.createElement("span");
    span.innerHTML = "Normalize";
    checkBox.type = "checkbox";
    checkBox.id = "normalize_checkbox";
    label.appendChild(checkBox);
    label.appendChild(span);
    label.style = "position:absolute; bottom:17px; left:17px;"
    panel3.appendChild(label);

    // the button 'Set'
    // this button is used to show the checked charts
    var button = document.createElement("button");
    button.onclick = function () {
        creatPage2();

        sum = [];
        xScale = [];
        yScale = [];
        histogram = [];
        constraint = [];
        output('Charts generating...');
        for (let field_id in fields) {
            constraint[field_id] = [];
            sum[field_id] = 0;
            if ($("#"+fields[field_id]+"_checkbox").attr('checked')) {
                d3.json("getData.php?key=" + fields[field_id],
                function(error, data) {
                    for (let i in data) {
                        sum[field_id] += parseFloat(data[i]['COUNT(*)']);
                    }
                    if ($("#normalize_checkbox").attr('checked')) {
                        for (let i in data) {
                            data[i]['COUNT(*)'] /= sum[field_id];
                        }
                    }
                    draw_Create(data, field_id);
                });
            }
        }
        output('Done.');
        $(window).scrollTo("#page2", 200);
    }
    button.innerHTML = "Set";
    button.style = "width:100px; position:absolute; bottom:17px; right:17px;"
    panel3.appendChild(button);


    // the button 'Filter'
    // this button is used to show the data filtered by the chosen data
    button = document.createElement("button");
    button.onclick = function () {
        var constraints = [];
        for (let field_id in constraint) {
            if (constraint[field_id] != 0) {
                constraints.push("(" + constraint[field_id].join(" OR ") + ")");
            }
            d3.select("#" + fields[field_id] + "_2").selectAll(".bar").remove();
        }
        if (constraints != 0) {
            //console.log(constraints.join(" AND "));
            for (let field_id in fields) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: "getData.php?key=" + fields[field_id],
                    data: { constraints:constraints.join(" AND ") },
                    success:function(data) {
                        if (data['error']) {
                            output("php error:" + data['error']);
                        }
                        else {
                            if ($("#normalize_checkbox").attr('checked')) {
                                for (let i in data) {
                                    data[i]['COUNT(*)'] /= sum[field_id];
                                }
                            }
                            draw_filter(data, field_id);
                        }
                    },
                    error:function (e) {
                        output("php error:" + e);
                    }
                });
            }
        }
    }
    button.innerHTML = "Filter";
    button.style = "width:100px; position:absolute; bottom:50px; right:17px;"
    panel3.appendChild(button);

    // the button 'Hide'
    // this button is used to hide the panel3
    button = document.createElement("button");
    button.onclick = function () {
        $("#panel3").fadeOut();
        $("#Switch").fadeIn();
    }
    button.innerHTML = "Hide";
    button.style = "width:100px; position:absolute; bottom:83px; right:17px;"
    panel3.appendChild(button);

    document.getElementById("page1").appendChild(panel3);
    $("#panel3").fadeIn();
}

/* --- output function --- */
// This function is used to show the message or debug message.
function output(msg) {
    var p = document.getElementById("message");
    p.innerHTML = msg;
}

/* --- Switch function --- */
// this function is used for the button '+' to show the panel3
function Switch() {
    $("#panel3").fadeIn();
    $("#Switch").fadeOut();
}

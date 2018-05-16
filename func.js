function startup() {
    $("#panel1").fadeIn();

    $('#forms').submit(function (event) {
        event.preventDefault();
        $("#panel3").fadeOut();
        $("#Switch").fadeOut();

        var page2 = document.getElementById("page2");
        if (page2 != null) {
            page2.parentNode.removeChild(page2);
        }
        page2 = document.createElement("div");
        page2.id = "page2";
        page2.class = "page";
        document.getElementById("pages").appendChild(page2);

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
                if (msg['error']) {
                    output(msg['error']);
                }
                else if (msg['success']) {
                    fields = msg['success'];
                    xScale = [];
                    yScale = [];
                    histogram = [];
                    constraint = [];
                    output('Charts generating...');
                    for (let field_id in fields) {
                        constraint[field_id] = [];
                        d3.json("getData.php?key=" + fields[field_id],
                        function(error, data) {
                            draw_Create(data, field_id);
                        });
                    }
                    output('Done.');
                    creatPanel3();
                }
            //成功提交
            },
            error:function (e) {
                output("php error:" + e);
            //错误信息
            }
        });
    });

}

function creatPanel3() {
    var res = document.getElementById("panel3");
    if (res != null) {
        res.parentNode.removeChild(res);
    }

    var panel3 = document.createElement("div");
    panel3.id = "panel3";

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

    var button = document.createElement("button");
    button.onclick = function () {
        for (let field_id in fields) {
            if ($("#"+fields[field_id]+"_checkbox").attr('checked')) {
                $("#"+fields[field_id]).show();
            }
            else {
                $("#"+fields[field_id]).hide();
            }
        }
        $(window).scrollTo("#page2", 200);
    }
    button.innerHTML = "Set";
    button.style = "width:100px; position:absolute; bottom:17px; right:17px;"
    panel3.appendChild(button);

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
            console.log(constraints.join(" AND "));
            for (let field_id in fields) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: "getData.php?key=" + fields[field_id],
                    data: { constraints:constraints.join(" AND ") },
                    success:function(data) {
                        if (data['error']) {
                            console.log(data['error']);
                        }
                        else {
                            draw_filter(data, field_id);
                        }
                    },
                    error:function (e) {
                        output("php error:" + e);
                    }
                });
            }
            //console.log(constraint);
        }
    }
    button.innerHTML = "Filter";
    button.style = "width:100px; position:absolute; bottom:50px; right:17px;"
    panel3.appendChild(button);

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

function output(msg) {
    var p = document.getElementById("message");
    p.innerHTML = msg;
}

function Switch() {
    $("#panel3").fadeIn();
    $("#Switch").fadeOut();
}

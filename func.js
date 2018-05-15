function startup() {
    $("#panel1").fadeIn();

/*
    fields = new Array();
    fields[0] = "balance";
    //fields[1] = "job";
    //fields[2] = "rua";

    for (let field_id in fields) {
        var span = document.createElement("span");
        span.id = fields[field_id];
        document.getElementById("page2").appendChild(span);
        d3.json("getData.php?key=" + fields[field_id],
        function(error, data) {
            draw_Create(data, field_id);
        });
        if(field_id > 0) {
            break;
        }
    }
    */

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
                    output('Charts generating...');
                    for (let field_id in fields) {
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
                output("php error");
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
    for (var key in fields) {
        var li = document.createElement("li")
        var label = document.createElement("label");
        var checkBox = document.createElement("input");
        var span = document.createElement("span");
        span.innerHTML = fields[key];
        checkBox.type = "checkbox";
        label.appendChild(checkBox);
        label.appendChild(span);
        li.appendChild(label);
        ul.appendChild(li);
    }
    panel3.appendChild(ul);

    var button = document.createElement("button");
    button.onclick = function () {
        $(window).scrollTo("#page2", 200);
    }
    button.innerHTML = "Set";
    button.style = "width:100px; position:absolute; bottom:17px; right:17px;"
    panel3.appendChild(button);

    button = document.createElement("button");
    button.onclick = function () {
        $("#panel3").fadeOut();
        $("#Switch").fadeIn();
    }
    button.innerHTML = "Hide";
    button.style = "width:100px; position:absolute; bottom:50px; right:17px;"
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

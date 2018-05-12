function startup() {
    $("#panel1").fadeIn();

    $('#forms').submit(function (event) {
        event.preventDefault();
        $("#panel3").fadeOut();
        $("#Switch").fadeOut();

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
                    output('');
                    creatPanel3(msg['success']);
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

function creatPanel3(fields) {
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
        scr(document.documentElement.scrollTop, window.innerHeight);
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

function scr(source, target) {
    var passTime = 200;
    var intervalRate = 0.05;
    var distance = target - source;
    var distanceRate = 0;

    var func = setInterval(function() {
        distanceRate = distanceRate + intervalRate;
        window.scrollTo(0, source + distance * distanceRate);

        if (distanceRate + 1e-5 >= 1) {
            clearInterval(func);
        }
    }, passTime * intervalRate);
}

function Switch() {
    $("#panel3").fadeIn();
    $("#Switch").fadeOut();
}

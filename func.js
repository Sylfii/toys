function startup() {
    $("#panel1").fadeIn();
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

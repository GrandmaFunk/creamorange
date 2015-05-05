function start_game() {
    //sets elements
    blob = document.getElementById("blob");
    floor = document.getElementById("floor");
    score = document.getElementById("score");
    highscore = document.getElementById("highscore");
    direction = "start";
    color = "orange";
    cur_high = 0;
    restart_game();
}

function restart_game() {
    if (direction != "start") {
        score.textContent = ":(";
    } else {
        //displays 0 as score if just started game
        score.textContent = "0";
    }
    //sets variables. Heights represent percentages
    //heights are inversed in SVG ~ 0 is top ~ 100 is bottom
    direction = "flat";
    maxh = 1;               //SVGview ceiling
    toph = 85;              //Max height ball can bounce
    minh = 100;             //SVGview floor
    adj = 2;                //estimated adjustment for circle's diameter
    leeway = 5;             //leeway for user to click before hitting ground. Difficulty level.
    blob.setAttribute("cy", minh-adj+"%");      //places blob on floor
    floor.setAttribute("opacity", 1);
}

function get_ran() {
    return Math.floor(Math.random() * (4-1+1) + 1);
    //                               (max-min+1) + min
    //returns random int between and including 1 to 4
}

function swap_colors() {
    //when blob hits SVG ceiling, swap colors
    if (color === "orange") {
        blob.style.fill = "#FF984F";
        floor.style.fill = "#FF984F";
        score.style.stroke = "#FF984F";
        document.getElementById("header").style.color = "#FF984F";
        document.getElementById("subfooter").style.color = "#FF984F";
        document.body.style.backgroundColor = "#FFC591";
        color = "white";
    } else {
        blob.style.fill = "#FFFFFF";
        floor.style.fill = "#FFFFFF";
        score.style.stroke = "#FFFFFF";
        document.getElementById("header").style.color = "#FFFFFF";
        document.getElementById("subfooter").style.color = "#FFFFFF";
        document.body.style.backgroundColor = "#FF984F";
        color = "orange";
    }
}

function apply_score() {
    if (score.textContent === ":(") {
        //skips "0" score
        score.textContent = "1";
    } else {
        //updates current score
        var cur_score = parseInt(score.textContent) + 1;
        score.textContent = cur_score;
        if (cur_score > cur_high) {
            //updates high score
            cur_high = cur_score;
            highscore.innerHTML = "Highscore: " + cur_high;
        }
    }
}

function bounce() {
    //get blob's current height
    var cur_h = parseInt(blob.getAttribute("cy").slice(0, -1));
    if (direction === "down") {
        if (cur_h + adj > minh) {
            //if hit floor
            restart_game();
            return false;
        } else {
            //else move blob down
            var new_h = cur_h + 1;
        }
    } else if (direction === "up") {
        if (cur_h - adj < maxh) {
            //if hit ceiling
            swap_colors();
            direction = "down";
        } else if (cur_h < toph) {
            //if hit max height
            direction = "down";
        } else {
            //else move blob up
            var new_h = cur_h - 1;
        }
    }
    if (new_h != undefined) {
        //unless blob is at min or max height
        //update blob height and floor opacity
        blob.setAttribute("cy", new_h+"%");
        floor.setAttribute("opacity", (new_h-80)/20);
    }
    if (direction != "flat") {
        //call function again if game not over
        requestAnimationFrame(bounce);
    }
}

function entry() {
    var cur_h = parseInt(blob.getAttribute("cy").slice(0, -1));

    //for testing make the following loop TRUE--
    //if (true) {
    if (cur_h > (minh - leeway) && (direction != "up")) {
        //if in sweet spot
        apply_score();

        if (direction === "flat") {
            //if first bounce after restart
            direction = "up";
            bounce();
        } else if (direction === "down") {
            if (toph > 0) {
                //increase max height
                toph -= get_ran();
            }
            direction = "up";
        }
    } else {
        //if clicked too early
        restart_game();
    }
}

function move_blob(LR) {
    //moves blob left/right bounded to floor
    var cur_x = parseInt(blob.getAttribute("cx").slice(0, -1));

    if (LR === "left" && cur_x > 25) {
        blob.setAttribute("cx", (cur_x-1)+"%");
    } else if (LR === "right" && cur_x < 75) {
        blob.setAttribute("cx", (cur_x+1)+"%");
    }
}

document.onkeyup = function(e) {
    //on Spacebar and Up Arrow
    if (e.keyCode == 32 || e.keyCode == 38) {
        entry();
    }
}

document.onkeydown = function(e) {
    //on Left and Right Arrow
    if (e.keyCode == 37) {
        move_blob("left");
    } else if (e.keyCode == 39) {
        move_blob("right");
    }
}

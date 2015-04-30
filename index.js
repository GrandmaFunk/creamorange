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
        score.innerHTML = ":(";
    } else{
        //displays 0 as score if just started game
        score.innerHTML = "0";
    }
    //sets variables
    direction = "flat";
    maxh = 1;
    toph = 85;
    minh = 100;
    vel = 3;
    adj = 2;
    leeway = 4;
    blob.setAttribute("cy", minh-adj+"%");
}

function get_ran(){
    return Math.floor(Math.random() * (4-1+1) + 1);
    //                               (max-min+1) + min
    //returns random in between and including 1 to 4
}

function swap_colors() {
    if (color == "orange"){
        blob.style.fill = "#FF984F";
        floor.style.fill = "#FF984F";
        score.style.stroke = "#FF984F";
        document.getElementById("header").style.color = "#FF984F";
        document.getElementById("subfooter").style.color = "#FF984F";
        document.body.style.backgroundColor = "#FFC591";
        color = "white";
    }else{
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
    if (score.innerHTML == ":("){
        score.innerHTML = 1;
    }else {
        var cur_score = parseInt(score.innerHTML) + 1;
        //applies current score
        score.innerHTML = cur_score;
        
        if (cur_score > cur_high) {
            //applies high score
            cur_high = cur_score;
            highscore.innerHTML = "Highscore: " + cur_high;
        }
    }
}

function bounce() {
    var cur_h = parseInt(blob.getAttribute("cy").slice(0, -1));
    //get current height
    if (direction == "down"){
        if (cur_h + adj > minh) {
            //if hit floor -> restart game
            restart_game();
            return false;
        } else{
            //else move blob down
            var new_h = cur_h + 1;
        }
    } else if (direction == "up"){
        if (cur_h - adj < maxh){
            //if hit ceiling -> go down and swap colors
            swap_colors();
            direction = "down";
        }else if (cur_h < toph){
            //hit top
            direction = "down";
        }else {
            //else move blob up
            var new_h = cur_h - 1;
        }
    }
    if (new_h != undefined){
        //if blob not at floor or ceiling
        //set blob height and floor opacity
        blob.setAttribute("cy", new_h+"%");
        //floor.setAttribute("opacity", ((new_h-40)/70));
        floor.setAttribute("opacity", (new_h-80)/20);
    }
    if (direction != "flat"){
        //continue if game not over
        requestAnimationFrame(bounce);
    }
}

function entry(){
    var cur_h = parseInt(blob.getAttribute("cy").slice(0, -1));
    
    //for testing--
    //if (true){
    if (cur_h > (minh - leeway) && (direction != "up")) {
        //if in sweet spot
        apply_score();
        
        if (direction == "flat"){
            direction = "up";
            bounce();
        }else if (direction == "down"){
            //get random amount to increase max height
            if (toph > 0) {
                toph -= get_ran();
            }
            direction = "up";
        }
    }else{
        //if clicked too early
        restart_game();
    }
}

function move_blob(LR) {
    //moves blob left/right bounded to floor
    var cur_x = parseInt(blob.getAttribute("cx").slice(0, -1));
    
    if (LR == "left" && cur_x > 25){
        blob.setAttribute("cx", (cur_x-1)+"%");
    }else if (LR == "right" && cur_x < 75){
        blob.setAttribute("cx", (cur_x+1)+"%");
    }
}

document.onkeyup = function(e) {
    //on Spacebar and Up Arrow
    if (e.keyCode == 32 || e.keyCode == 38){
        entry();
    }
}

document.onkeydown = function(e){
    //on Left and Right Arrow
    if (e.keyCode == 37) {
        move_blob("left");
    }else if (e.keyCode == 39) {
        move_blob("right");
    }
}
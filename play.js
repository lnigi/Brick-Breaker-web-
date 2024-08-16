//The following page has been used as reference to implement the game mechanics: 
//https://www.geeksforgeeks.org/create-a-2d-brick-breaker-game-using-html-css-and-javascript/

const user = sessionStorage.getItem("user"); //recover current user
const ratio = 2.4;

canvas.width = window.screen.width; //set correct pixel amount for screen 
canvas.height = (canvas.width)/ratio;
canvas.style.width = game.style.width; //"game" is the id of div containing canvas
canvas.style.height = game.style.height * (7/10);

var interval = null;
const ctx = canvas.getContext("2d");

var POSITION = []; //cell positions matrix [NxM elements][2 elements] --> 
                                            // - POSITION[i][0] --> X_COORDS
                                            // - POSITION[i][1] --> Y_COORDS
//constants to adjust elements' size
const PADDLE_WIDTH = 200;
const PADDLE_HEIGHT = 20;
const N_ROWS = 6;
const M_COLS = 13;
const CELL_START_X = 2;
const CELL_START_Y = 2;
const CELL_PADDING = 4;
const CELL_HEIGHT = 30;
const CELL_WIDTH = Math.floor((canvas.width - (M_COLS * CELL_PADDING))/M_COLS); //dinamically calculated
const BALL_RADIUS = 12;
const BALL_VELOCITY_X = 8;
const BALL_VELOCITY_Y = 2;


const LIVES = 3;
var score = 0;
var lives = LIVES;
var lose_life = null;
var win = null;

const cell = {
    height: CELL_HEIGHT,
    width: CELL_WIDTH,
    pos_x: CELL_START_X,
    pos_y: CELL_START_Y,
    setup_grid_data: function () {
        for (var i = 0; i < N_ROWS; i++) { //setup rows
            cell.pos_x = CELL_START_X; //rewind to start of row
            for (var j = 0; j < M_COLS; j++) { //setup columns (one row at a time)
                POSITION.push([cell.pos_x, cell.pos_y]); //x is changing with each iteration, y is fixed for each row
                cell.pos_x += cell.width + CELL_PADDING; //move to next element in current row
            }
            cell.pos_y += cell.height + CELL_PADDING; //move to next row
        }
        //reset to initial values
        cell.pos_x = CELL_START_X;
        cell.pos_y = CELL_START_Y;
    },

    draw_cell: function (start_x, start_y) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(start_x, start_y, this.width, this.height);
        ctx.closePath();
    },

    draw_grid: function() {
        for (i = 0; i < POSITION.length; i++) {
            this.draw_cell(POSITION[i][0], POSITION[i][1]);
        }
    },
    clear_cell: function (start_x, start_y) {
        ctx.clearRect(start_x, start_y, this.width, this.height);
    }
}

const ball = {
    center_x: canvas.width/2,
    center_y: canvas.height/2,
    velocity_x: ((Math.random() < 0.5)?(1):(-1)) * BALL_VELOCITY_X, // DeltaX/time_interval   ;  Randomize initial direction for ball
    velocity_y: BALL_VELOCITY_Y, // DeltaY/time_interval
    radius: BALL_RADIUS,

    draw_ball: function () {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.center_x, this.center_y, this.radius, 0, Math.PI * 2); //arc(x, y, radius, startAngle, endAngle, [OPTIONAL] counterClockwise)
        ctx.fill();
        ctx.closePath();
    },
    move_ball: function() { //the function will be called at any time interval when game is being played
        this.center_x += this.velocity_x;
        this.center_y += this.velocity_y;

        //Left-Right border collision
        if ((this.center_x - this.radius <= 0) || (this.center_x + this.radius >= canvas.width)) {
            this.velocity_x = -this.velocity_x; //invert movement direction
        }

        //Top border collision
        if (this.center_y - this.radius <= 0) {
            this.velocity_y = -this.velocity_y;
        }

        //Bottom border collision
        if (this.center_y + this.radius >= canvas.height) { //game will be paused, event for lost life will be triggered
            this.velocity_x = 0;
            this.velocity_y = 0;
            lose_life = true;
        }

        //Collision with brick Cell
        for (var i = (POSITION.length)-1; i >= 0; i--) { //start scanning from lower cells (higher probability of collision)
            if (
                ( (this.center_x >= POSITION[i][0]) &&
                 (this.center_x <= (POSITION[i][0] + cell.width)) ) //check that ball is under cell [i]
                 &&
                ( ((this.center_y - this.radius) >= POSITION[i][1]) &&
                 (this.center_y - this.radius <= POSITION[i][1] + cell.height) ) //check that ball is touching cell [i]
            ) {
                cell.clear_cell(POSITION[i][0], POSITION[i][1]);
                POSITION.splice(i,1); //remove (1) element (starting from) [i] from array POSITION
                this.velocity_y = -this.velocity_y;
                score += 1;
                score_text.innerHTML = "YOUR SCORE: " + score;
                
                //increase difficulty (ball velocity)
                this.velocity_x *= 1.01;
                this.velocity_y *= 1.01;
            }
        }

        //Collision with Paddle
        if ( 
            ( (this.center_x >= paddle.pos_x) &&
             (this.center_x <= (paddle.pos_x + paddle.width)) ) //check that ball is above paddle
            &&
            ( ((this.center_y + this.radius) < canvas.height) && //ball is still above lower boundary
             (this.center_y + this.radius) >= canvas.height - paddle.height) //ball is at paddle's height  //check that ball is touching paddle
        ) {
            this.velocity_y = -this.velocity_y;
        }

    }
}

const paddle = {
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    pos_x: (canvas.width / 2) - (PADDLE_WIDTH / 2), //center paddle (pos_x is top left corner)
    pos_y: canvas.height - PADDLE_HEIGHT, //pos_x and pos_y describe top left corner of paddle
    draw_paddle: function () {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillRect(this.pos_x, this.pos_y, this.width, this.height);
        ctx.closePath();
    },
    move_paddle: function (event) {
        if (event.offsetX <= (paddle.width / 2)) { //check left border
            paddle.pos_x = 0;
        } else if (event.offsetX >= (canvas.width - (paddle.width / 2))) { //check right border
            paddle.pos_x = canvas.width - paddle.width;
        } else {
            paddle.pos_x = event.offsetX - (paddle.width); //put the center of the paddle under mouse cursor
        }
    }    
}

const gameControl = {
    clearCanvas: function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
    },
    clearText: function (start_x, start_y) {
        ctx.clearRect(start_x, start_y, canvas.width, 100);
        ctx.fillStyle = "white";
    },
    startGame: function () {
        document.getElementById("canvas").removeEventListener("click", gameControl.startGame); //prevent multiple inputs to start game

        gameControl.clearCanvas();
        cell.setup_grid_data();
        cell.draw_grid();
        
        paddle.draw_paddle();
        ball.draw_ball();
        
        interval = setInterval(gameControl.countdown, 1000); //begin 3 seconds countdown
    },
    countdown: function () {
        gameControl.clearText(0, (canvas.height * (65/100))); //clear and update countdown text
        if (typeof gameControl.countdown.counter == 'undefined') { //set static-like variable for function
            gameControl.countdown.counter = 3;
        }
        
        ctx.fillText(("Game (re)starting in: " + gameControl.countdown.counter.toString()), (canvas.width / 2), (canvas.height * (7/10)));
        
        if (gameControl.countdown.counter == 0) {
            clearInterval(interval); //remove countdown interval
            gameControl.clearText(0, canvas.height * (7/10));
            gameControl.countdown.counter = 3; //reset countdown for next
            interval = setInterval(gameControl.play, 6.9); //approx. 144 fps  --> set game mainloop and keep track of interval
        } else { gameControl.countdown.counter--; }
    },
    play: function (event) {
        if (canvas.onmousemove == null) {canvas.onmousemove = paddle.move_paddle;} //MIGHT BREAK GAME
        
        ball.move_ball();
        gameControl.clearCanvas();
        ball.draw_ball();
        paddle.draw_paddle();
        cell.draw_grid();
        
        if (lose_life) {
            lives--;
            lives_text.innerHTML = "LIVES: " + lives;
            lose_life = false;
            if (lives <= 0) { //lose game
                win = false;
                clearInterval(interval);
                gameControl.gameOver(win);
            } else { //continue game, life lost: reset ball and paddle positions
                clearInterval(interval);
                ball.center_x = canvas.width / 2;
                ball.center_y = canvas.height / 2;
                ball.velocity_x = ((Math.random() < 0.5)?(1):(-1)) * BALL_VELOCITY_X;
                ball.velocity_y = BALL_VELOCITY_Y;
                
                paddle.pos_x = (canvas.width / 2) - (PADDLE_WIDTH / 2);
                paddle.pos_y = canvas.height - PADDLE_HEIGHT;
                
                gameControl.clearCanvas();
                ball.draw_ball();
                paddle.draw_paddle();
                cell.draw_grid();
                
                interval = setInterval(gameControl.countdown, 1000); //start countdown to resume game
            }
        } else if (POSITION.length == 0){ //if all cells have been cleared, game over
            win = true;
            clearInterval(interval);
            gameControl.clearCanvas();
            gameControl.gameOver(win);
        }
    },
    gameOver: function  () {
        canvas.removeEventListener("mousemove", paddle.move_paddle);
        gameControl.clearCanvas();
        result = (win)?("won!"):("lost...");
        ctx.fillText(("You " + result), (canvas.width / 2), (canvas.height * (5/10)));

        play_again.hidden = false;
        play_again.className = "myButton";
        document.getElementById("play_again").addEventListener("mouseover", play_again_handlers.mouseOverH);
        document.getElementById("send").addEventListener("mouseover", play_again_handlers.mouseOverH);
        document.getElementById("play_again").addEventListener("click", play_again_handlers.clickH);
        
        if (user != "NOT LOGGED IN") { //score submit is allowed only for logged-in players
            ctx.fillText("Click \"Submit\" to save your score or play again!", (canvas.width / 2), (canvas.height * (7/10)));
            user_save.hidden = false;
            
            score_save_opt.innerHTML = score;
            score_save.hidden = false;
            
            send.hidden = false;
            send.value = "Submit";
            send.className = "myButton";
        }


    }
}
var selected = null;

const play_again_handlers = {
    mouseOverH: function (event) { //buttons interaction
        current = event.currentTarget;
        if (selected != null) {
            selected.style.color = "white";
            selected.style.backgroundColor = "black";
        }
        selected = current;
        selected.style.backgroundColor = "white";
        selected.style.color = "black";
    },
    clickH: function (event) { //reset game (play again)
        score = 0;
        lives = LIVES;
        lose_life = null;
        win = null;
        POSITION.length = 0;
        ball.center_x = canvas.width / 2;
        ball.center_y = canvas.height / 2;
        ball.velocity_x = ((Math.random() < 0.5)?(1):(-1)) * BALL_VELOCITY_X;
        ball.velocity_y = BALL_VELOCITY_Y;
        paddle.pos_x = (canvas.width / 2) - (PADDLE_WIDTH / 2);
        paddle.pos_y = canvas.height - PADDLE_HEIGHT;
        score_text.innerHTML = "YOUR SCORE: " + score;
        lives_text.innerHTML = "LIVES: " + lives;
        selected = null;
        user_save.hidden = "true";
        score_save.hidden = "true";

        //remove event listeners and hide buttons again
        document.getElementById("play_again").removeEventListener("mouseover", play_again_handlers.mouseOverH);
        document.getElementById("send").removeEventListener("mouseover", play_again_handlers.mouseOverH);
        document.getElementById("play_again").removeEventListener("click", play_again_handlers.clickH);
        gameControl.clearCanvas();
        play_again.hidden = "true";
        play_again.className = "";
        send.hidden = "true";
        send.className = "";
        SetupHandlers();
    }
}

function SetupHandlers() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Welcome, " + user + ". Click the screen to begin playing.", (canvas.width / 2), (canvas.height / 2));
    document.getElementById("canvas").addEventListener("click", gameControl.startGame);
}
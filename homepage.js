function ClickHandler(event) {
    var clicked = event.currentTarget;
    switch (clicked.id) { //switch current page
        case "start":
    	   window.location.href = "play.php";
    	   break;
    	
        case "login":
    	   window.location.href = "login.html";
            break;
    	
        case "leaderboard":
    	   window.location.href = "leaderboard.php";
    	   break;
    	
        case "arkanoid":
           window.open("https://en.wikipedia.org/wiki/Arkanoid");
           break;
        
        default:
    	   break;
    }
}

var selected = null;

function MOHandler(event) { //change color for button which is hovered on
    current = event.currentTarget;
    if (selected != null) {
    	selected.style.color = selected.TC;
    	selected.style.backgroundColor = selected.BG;
    }
    selected = current;
    selected.style.backgroundColor = "white";
    selected.style.color = "black";
}


function SetHandlers() {
    buttons = document.getElementsByClassName("myButton");
    for (i = 0; i < buttons.length; i++) {
    	buttons[i].onclick = ClickHandler;
    	buttons[i].onmouseover = MOHandler;
    	buttons[i].BG = buttons[i].style.backgroundColor;
    	buttons[i].TC = buttons[i].style.color;
    }
}

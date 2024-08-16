function check_input() { //input validation before credentials submit
    if (username.value.includes(",") || password.value.includes(",")) {
		send_data.disabled = true;
		errors.innerHTML = "Error: username and/or password cannot include character \",\"";
	} else {
		send_data.disabled = false;
		errors.innerHTML = "";
	}
}

function SetHandlers() {
    document.getElementById("username").onkeyup = check_input;
    document.getElementById("password").onkeyup = check_input;
}

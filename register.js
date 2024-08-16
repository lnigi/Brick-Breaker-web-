function check_input() { //check that no "," is used in input fields to avoid corrupting database
	error_text.style.color = "red";
    if (username.value.includes(",") || pass.value.includes(",") || check_pass.value.includes(",")) {
		submit_account.disabled = true;
		error_text.innerHTML = "ERROR: username and/or password cannot include character \",\"";
	} else {
		submit_account.disabled = false;
		error_text.innerHTML = "";
	}
}

function pass_check() { //check that password and repeated password are matching
	if (!(pass.value === check_pass.value)) { //use "===" to check exact match for strings
		submit_account.disabled = true;
		error_text.style.color = "red";
		error_text.innerHTML = "ERROR: passwords are not matching!"
	} else {
		submit_account_account.disabled = false;
		error_text.style.color = "white";
		error_text.innerHTML = "Passwords matching!"
	}
}

function SetHandlers() {
    document.getElementById("username").addEventListener("keyup", check_input);
    document.getElementById("pass").addEventListener("keyup", check_input);
	document.getElementById("check_pass").addEventListener("keyup", check_input);
	document.getElementById("pass").addEventListener("keyup", pass_check);
	document.getElementById("check_pass").addEventListener("keyup", pass_check); 
}


<?php
  session_start();
  $login_status = null;
  echo "<script> sessionStorage.setItem(\"user\", \"NOT LOGGED IN\")</script>"; //user data (stored to play game) ---> default: set user as not logged in
  if (isset($_REQUEST['user']) && isset($_REQUEST['pass'])) { //if login http request has been received
    $username = $_REQUEST['user'];
    $passwd = $_REQUEST['pass'];
  } else if (isset($_SESSION['username'])) { //check if user is already logged in
    $username = $_SESSION['username'];
    $login_status = true;
  }

  define("NOT_LOGGED", 'Not Logged In - Login to save your score!!'); //define PHP constant
  if ($login_status == null) {$currentUser = NOT_LOGGED;}

  function check_database($user, $pass) { //check .txt database, line by line, for credentials
    $f_handle = fopen("users.txt", "r"); //line structure:   <USERNAME>,<PASSWORD>\n
    while ($line = fgets($f_handle)) {  //read new line
      $line = explode(",", $line); //separate username and password
      if ($line[0] == $user && substr($line[1],0,strlen($line[1])-1) == $pass) {
        fclose($f_handle);
        return true;
      }
    }
    fclose($f_handle);
    return false;
  }

  if ((!is_null($username) && !is_null($passwd)) || $login_status) { //check login and credentials status
    if (!(check_database($username, $passwd)) && is_null($login_status)) { //if user is not already logged in and login credentials are not valid
      $currentUser = NOT_LOGGED;
      $login_status = ($username == "logout")? true : false; //logout successful if $login_status == true
    } else if ($login_status){ //if user is already logged in keep current username
      $currentUser = $username;
      echo "<script> sessionStorage.setItem(\"user\", \"$username\")</script>"; //save for later use in game
    }else { //if login is successful, save current user
      $currentUser = $username;
      $_SESSION['username'] = $username; //save current user in session
      echo "<script> sessionStorage.setItem(\"user\", \"$username\")</script>"; //save for later use in game
      $login_status = true;
    }
  } else { //if login conditions are not respected, stay logged out and update $currentUser
    $currentUser = NOT_LOGGED;
  }
?>

<!doctype HTML>
<head>
  <script src="homepage.js"></script>

   <style>
     .myButton {width: 30%; 
          height: 10%;
          display: flex;
          margin: 0 auto; 
          justify-content: center;
          align-items: center;
          background-color: #373737;
          font-size: 30px;
          color: white;
	    }
     .textsetup {font-size:20px; color: white}
  </style>
  <!--margin: Specifying auto as the second parameter basically tells the browser
     to automatically determine the left and right margins itself, which it does by
     setting them equally.
     It guarantees that the left and right margins will be set to the same size. 
     
     Percentage setting for width and height: set size as percentage of all available space for div
   -->

   <title>Brick Breaker - Homepage</title>
   
</head>


<body style="background-color: black" onload="SetHandlers()">
  <h1 style="color: white; display: flex; justify-content: center; align-items: center">Welcome to Brick Breaker!</h1>
  
  <br>

  <div class="myButton" id="start">Start Game</div>

  <br>
    
  <div class="myButton" id="login"><?php echo ($login_status && ($username != "logout"))?("Switch Account"):("Login");?></div>

  <br>

  <div class="myButton" id="leaderboard">Leaderboard</div>

  <br>

  <div class="myButton" id="arkanoid">Inspiration: Arkanoid</div>

  <br>

  <div>
    <div class="textsetup">Currently logged in as: </div>
    <div class="textsetup" <?php echo ($currentUser == NOT_LOGGED) ? ("style=\"color: red\""):("");?>><?php echo "$currentUser";?></div>
    <br>
    <span class="textsetup" <?php echo "style=\"color: red\""?>><?php if (is_null($login_status)) { //error message for wrong login
      echo "";
    } else if (!$login_status) {
      echo "ERROR: INCORRECT LOGIN CREDENTIALS";
    } ?></span>
    <br>
    <div class="textsetup">
      <form action="homepage.php" method="post">
        <button type="submit" name="user" value="logout" style="background-color: #373737; color: white">Logout</button>
        <select hidden="true" name="pass" default="">
          <option></option>
        </select>
      </form>
    </div>
  </div>
</body>
<?php if ($_REQUEST['user'] == "logout") { //if logout is requested delete all data for current session
  $_SESSION = array(); //deletes variables saved in SESSION
  if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time()-42000, '/'); //delete session ID cookie on server
  }
  session_destroy();
  echo "<script> sessionStorage.setItem(\"user\", \"NOT LOGGED IN\")</script>"; //save for later use in game
 }?>

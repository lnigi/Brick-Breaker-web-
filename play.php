<?php 
	session_start();
	$username = $_SESSION['username']; //check for username server-side to ensure correct submit
?>

<!doctype HTML>
<head>
	<title>Brick Breaker - Playing </title>
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
	</style>

</head>


<body style="background-color: black; color: white" onload="SetupHandlers()">

<div id="game" style="width: 100%; height: 100%">
	<canvas id="canvas"></canvas>
</div>

<div>
	<h3 id="score_text" style="display: flex; justify-content: center; align-content: center; text-align: center;">YOUR SCORE: 0</h3>
</div>

<div>
	<h3 id="lives_text" style="display: flex; justify-content: center; align-content: center; text-align: center;">LIVES: 3</h3>
</div>

<br> <br>
<form action="save_score.php" method="get">
	<select name="user" id="user_save" hidden="true">
		<option id="user_save_opt"><?php echo $username;?></option>
	</select>
	<select name="score" hidden="true" id="score_save">
		<option id="score_save_opt"></option>
	</select>
	<input type="submit" id="send" hidden="true">
</form>

<div id="play_again" hidden="true">Play Again?</div>

<br> <br>
<a href="homepage.php" style="color: white">Return to Home Page</a>

<script src="play.js"></script>
</body>
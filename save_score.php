<?php 
    session_start();

    $_REQUEST['user'] = "test";
    $_REQUEST['score'] = 32;

    $username = $_REQUEST['user'];
    $score = $_REQUEST['score'];

    function read_database() {
        $data = array();
        $f_handle = fopen("leaderboard.txt", "r"); //line structure:   <USERNAME>,<SCORE>\n
        rewind($f_handle);
        while ($line = fgets($f_handle)) {
            $line = explode(",", $line); //stores the database in an array
            $data[$line[0]] = substr($line[1],0,strlen($line[1])-1); //save: $leaderboard[username] => score
        }
        fclose($f_handle);
        return $data;
    }

    function update_database($data) {
        $f_handle = fopen("leaderboard.txt", "w"); //line structure:   <USERNAME>,<SCORE>\n
        rewind($f_handle);
        foreach ($data as $user => $points) {
            $txt = "$user".","."$points"."\n";
            fwrite($f_handle, $txt);
        }
        fclose($f_handle);
        return;
    }

    $leaderboard = read_database();

    if (isset($leaderboard[$username])) {
        $leaderboard[$username] = ($score > $leaderboard[$username]) ? ($score):($leaderboard[$username]); //check if new score is higher and eventually replace old score
    } else {
        $leaderboard[$username] = $score; //add new score if no score is already saved for user
    }

    arsort($leaderboard); //sort in descending order

    update_database($leaderboard);

?>

<!doctype HTML>
<head>
    <title><?php echo "Saving score...";?></title>
</head>


<body style="background-color: black; color: white; justify-content: center; align-content: center;">
    <h1> <?php echo "Score successfully saved! Please click the link to check the leaderboard:"?> </h1>
    <a style="font-size: 20px; color: white" href="leaderboard.php">To leaderboard</a>
</body>
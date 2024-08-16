<!DOCTYPE html>

<head>
    <title>Brick Breaker - LEADERBOARD</title>
    <style>
        .column_title {border: 3px solid white; 
                        font-size: 23px; color: white; width: 30%;
                        text-align: center;}
        .table_entry {color: white; font-size: 17px; 
                      text-align: center; border: 1px solid #CCCCCC;
                      border-spacing: 0px; border-collapse: collapse;}

    </style>
</head>


<body style="background-color: black; color: white">
    <h1 style="display: flex; justify-content: center; align-content: center;">LEADERBOARD</h1>
    <table style="display: flex; justify-content: center; align-content: center; border: 3 px solid white; border-collapse: collapse">
        <tr style="border-color: #888888;">
            <th class="column_title">POSITION</th>
            <th class="column_title">USERNAME</th>
            <th class="column_title">SCORE</th>
        </tr>

        <?php //print leaderboard
            $counter = 1;
            
            $f_handle = fopen("leaderboard.txt", "r"); //line structure:   <USERNAME>,<SCORE>\n
            while (($line = fgets($f_handle)) && ($counter < 11)) {
                $line = explode(",", $line);
                $points = substr($line[1],0,strlen($line[1])-1);
                echo "<tr>";
                echo "<td class=\"table_entry\">"."$counter"."</td>"; //position
                echo "<td class=\"table_entry\">"."$line[0]"."</td>"; //username
                echo "<td class=\"table_entry\">"."$points"."</td>"; //score
                echo "</tr>";
                $counter += 1;
            }
            fclose($f_handle);
        ?>
    </table>

    <a href="homepage.php" style="color: white">Back to Home page</a>
</body>


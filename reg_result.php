<?php 
    session_start();

    $username = $_REQUEST['user'];
    $passwd = $_REQUEST['pass'];
    $success = null;

    function check_database($user, $pass) {
        $f_handle = fopen("users.txt", "r"); //line structure:   <USERNAME>,<PASSWORD>\n
        rewind($f_handle);
        while ($line = fgets($f_handle)) {
        $line = explode(",", $line);
          if ($line[0] == $user && (substr($line[1],0,strlen($line[1])-1)) == $pass) {
            fclose($f_handle);
            return true;
          }
        }
        fclose($f_handle);
        return false;
    }

    function add_to_database($user, $pass) {
        if (!check_database($user, $pass)) {
            $file = file_put_contents('users.txt', $user.",".$pass.PHP_EOL, FILE_APPEND | LOCK_EX); //fopen(). fwrite() login data with mutex lock on append, fclose()
            return true;
        } else {
            return false;
        }
    }

    $success = add_to_database($username, $passwd);

?>

<!doctype HTML>
<head>
    <title><?php echo ($success)?("Registrationb - Success"):("Registration - ERROR");?></title>
</head>


<body style="background-color: black; color: white; justify-content: center; align-content: center; <?php echo (!$success)?("color: red"):("") ?>">
    <h1> <?php echo ($success)?("Registration successfully completed!"):("Registration failed, please try again.") ?> </h1>
    <a style="font-size: 20px; color: white" href="login.html" style="color: white">Please, return to login page.</a>
</body>
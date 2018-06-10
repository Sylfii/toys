<?php
    session_start();

    $database = $_FILES['database']['tmp_name'];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $host = "localhost";
    $base = "bank";
    $table = "bank_tbl";

    $_SESSION['username'] = $username;
    $_SESSION['password'] = $password;

    // check csv file
    if (empty($database)) {
        throw_error("File doesn't exsist.");
    }

    // connect mysql
    $connection = mysqli_connect($host, $username, $password);
    if (!$connection) {
        throw_error("Connection failed: " . mysqli_connect_error());
    }

    // if a database is existed, delete it
    $sqlCommand = "DROP DATABASE IF EXISTS $base";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error checking database: $connection->error");
    }

    // create a database.
    $sqlCommand = "CREATE DATABASE IF NOT EXISTS $base";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error creating database: $connection->error");
    }

    // create a table
    mysqli_select_db($connection, $base);
    $sqlCommand = "CREATE TABLE $table(ids INT NOT NULL PRIMARY KEY AUTO_INCREMENT)";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error creating table: $connection->error");
    }

    // start read from csv
    $csv_handle = fopen($database, 'r');
    $fields = fgetcsv($csv_handle, 1000, ";");
    if (!$fields) {
        throw_error("Error: Empty file");
    }

    // use the first data to add data's fields into table
    $typeInt = " INT NOT NULL";
    $typeChar = " VARCHAR(20) NOT NULL";
    $sample = fgetcsv($csv_handle, 1000, ";");
    foreach($sample as $key=>$data) {
        // Can't add a field named 'default', change it
        if ($fields[$key] == "default") {
            $fields[$key] = "defaults";
        }
        // Can't add a field with '.'
        $fields[$key] = str_replace('.', '_', $fields[$key]);

        $sqlCommand = "ALTER TABLE $table ADD $fields[$key]";
        if(is_numeric($data)){                      // if data is nubmer
            $sqlCommand = $sqlCommand . $typeInt;
            $sample[$key] = (int)$data;
        }
        else {                                      // if data is string
            $sqlCommand = $sqlCommand . $typeChar;
            $sample[$key] = "'$data'";
        }

        if ($connection->query($sqlCommand) === FALSE) {
            throw_error("Error add field: $connection->error $sqlCommand");
        }
    }

    // add the first data into table
    $field = "(" .implode(", ", $fields) . ")";
    $value = "(" .implode(", ", $sample) . ")";
    if ($connection->query("INSERT INTO $table $field VALUES $value") === FALSE) {
        throw_error("Error insert: $connection->error");
    }

    // add the rest data
    while ($line = fgetcsv($csv_handle, 1000, ";")) {
        foreach($line as $key=>$data) {
            if (is_numeric($data)) {
                $line[$key] = (int)$data;
            }
            else {
                $line[$key] = "'$data'";
            }
        }
        $value = "(" .implode(", ", $line) . ")";
        if ($connection->query("INSERT INTO $table $field VALUES $value") === FALSE) {
            throw_error("Error insert: $connection->error");
        }
    }

    fclose($csv_handle);
    mysqli_close($connection);

    // return succuess message
    $successinfo = array("success" => $fields);
    echo json_encode($successinfo);

//This functions is used to return error message
function throw_error($info) {
    $errorinfo = array("error" => $info);
    die(json_encode($errorinfo));
}
?>

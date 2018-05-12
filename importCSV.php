<?php
    $database = $_FILES['database']['tmp_name'];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $host = "localhost";

    if (empty($database)) {
        throw_error("File doesn't exsist.");
    }

    $connection = mysqli_connect($host, $username, $password);
    if (!$connection) {
        throw_error("Connection failed: " . mysqli_connect_error());
    }

    $sqlCommand = "DROP DATABASE IF EXISTS bank";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error checking database: $connection->error");
    }

    $sqlCommand = "CREATE DATABASE IF NOT EXISTS bank";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error creating database: $connection->error");
    }
    $sqlCommand = "DROP DATABASE IF EXISTS bank";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error checking database: $connection->error");
    }

    $sqlCommand = "CREATE DATABASE IF NOT EXISTS bank";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error creating database: $connection->error");
    }

    mysqli_select_db($connection, 'bank');
    $sqlCommand = "CREATE TABLE bank_tbl(ids INT NOT NULL PRIMARY KEY AUTO_INCREMENT)";
    if ($connection->query($sqlCommand) === FALSE) {
        throw_error("Error creating table: $connection->error");
    }

    $csv_handle = fopen($database, 'r');
    $fields = fgetcsv($csv_handle, 1000, ";");
    if (!$fields) {
        throw_error("Error: Empty file");
    }

    $typeInt = " INT NOT NULL";
    $typeChar = " VARCHAR(20) NOT NULL";
    $sample = fgetcsv($csv_handle, 1000, ";");
    foreach($sample as $key=>$data) {
        // Can't add a field named 'default', change it
        if ($fields[$key] == "default") {
            $fields[$key] = "defaults";
        }
        $fields[$key] = str_replace('.', '_', $fields[$key]);

        $sqlCommand = "ALTER TABLE bank_tbl ADD $fields[$key]";
        if(is_numeric($data)){
            $sqlCommand = $sqlCommand . $typeInt;
            $sample[$key] = (int)$data;
        }
        else {
            $sqlCommand = $sqlCommand . $typeChar;
            $sample[$key] = "'$data'";
        }

        if ($connection->query($sqlCommand) === FALSE) {
            throw_error("Error add field: $connection->error $sqlCommand");
        }
    }

    $field = "(" .implode(", ", $fields) . ")";
    $value = "(" .implode(", ", $sample) . ")";
    if ($connection->query("INSERT INTO bank_tbl $field VALUES $value") === FALSE) {
        throw_error("Error insert: $connection->error");
    }

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
        if ($connection->query("INSERT INTO bank_tbl $field VALUES $value") === FALSE) {
            throw_error("Error insert: $connection->error");
        }
    }

    $successinfo = array("success" => $fields);
    echo json_encode($successinfo);


function throw_error($info) {
    $errorinfo = array("error" => $info);
    die(json_encode($errorinfo));
}
?>

<?php
    header('Access-Control-Allow-Origin: *');
    session_start();

    $username = $_SESSION['username'];
    $password = $_SESSION['password'];
    $host = "localhost";
    $base = "bank";
    $table = "bank_tbl";

    $connection = mysqli_connect($host, $username, $password);
    if (!$connection) {
        throw_error("Connection failed: " . mysqli_connect_error());
    }

    mysqli_select_db($connection, $base);

    $key = $_GET["key"];
    $constraints = $_POST["constraints"];
    $sqlCommand = "SELECT $key, COUNT(*) FROM $table ";
    if ($constraints) {
        $sqlCommand .= "WHERE ($constraints) ";
    }
    $sqlCommand .= "GROUP BY $key";
    $query = mysqli_query($connection, $sqlCommand);
    if (!$query) {
        die;
    }

    http_response_code(200);
    header("Content-type: application/json");

    $data = array();
    for ($i = 0; $i < mysqli_num_rows($query); $i++) {
        $data[] = mysqli_fetch_assoc($query);
    }
    mysqli_close($connection);
    echo json_encode($data);

function throw_error($info) {
    $errorinfo = array("error" => $info);
    die(json_encode($errorinfo));
}
?>

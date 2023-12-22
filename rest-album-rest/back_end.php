<?php
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Method:*");
    header("Access-Control-Allow-Headers:*");

    $method = $_SERVER['REQUEST_METHOD'];

    $servername = "127.0.0.1:3306";
    $username = "u583832022_api_vrzn";
    $password = "=OCqbuo~x3M";
    $dbname = "u583832022_db_vrzn";
    
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    function sanitizeInput($conn, $input) {
        return $conn->real_escape_string($input);
    }

    switch ($method) {
        case 'POST':
            $action = isset($_POST['action']) ? $_POST['action'] : '';

            switch ($action) {
                case 'POST':
                    $album_name = 
                        sanitizeInput($conn, $_POST['album_name']);
                    $artist = 
                        sanitizeInput($conn, $_POST['artist']);
                    $language = 
                        sanitizeInput($conn, $_POST['language']);
                    $track_number = 
                        sanitizeInput($conn, $_POST['track_number']);
                    $genre = 
                        sanitizeInput($conn, $_POST['genre']);

                    $sql = "INSERT INTO album 
                            (album_name, artist, language, track_number, genre) 
                            VALUES 
                            ('$album_name', '$artist', '$language', 
                            '$track_number', '$genre')";
                    $conn->query($sql);

                    echo 
                    json_encode(array("message" => "Created successfully"));
                    break;

                case 'PATCH':
                    $albumId = 
                        sanitizeInput($conn, $_POST['albumId']);
                    $album_name = 
                        sanitizeInput($conn, $_POST['album_name']);
                    $artist = 
                        sanitizeInput($conn, $_POST['artist']);
                    $language = 
                        sanitizeInput($conn, $_POST['language']);
                    $track_number = 
                        anitizeInput($conn, $_POST['track_number']);
                    $genre = 
                        sanitizeInput($conn, $_POST['genre']);

                    $sql = "UPDATE album 
                            SET album_name='$album_name', 
                                artist='$artist', 
                                language='$language', 
                                track_number='$track_number', 
                                genre='$genre'
                            WHERE id='$albumId'";
                    $conn->query($sql);

                    echo json_encode(array("message" => "Album updated"));
                    break;

                case 'DELETE':
                    $albumId = sanitizeInput($conn, $_POST['albumId']);

                    $sql = "DELETE FROM album WHERE id='$albumId'";

                    if ($conn->query($sql) === TRUE) {
                        echo 
                        json_encode(array("message" => "Album deleted"));
                    } else {
                        http_response_code(500);
                        echo 
                        json_encode(array("message" => $conn->error));
                    }
                    break;

                default:
                    http_response_code(400);
                    echo 
                    json_encode(array("message" => "Invalid action"));
                    break;
            }
            break;

        case 'GET':
            $result = $conn->query("SELECT * FROM album");
            $albums = array();
            while ($row = $result->fetch_assoc()) {
                $albums[] = $row;
            }
            echo json_encode($albums);
            break;

        default:
            http_response_code(405);
            echo json_encode(array("message" => "Method Not Allowed"));
            break;
    }

    $conn->close();
?>

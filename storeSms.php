<?php 

require_once 'connectdb.php';

// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }
// echo "Connected successfully\n";

$phone = $_GET['phone'];
$latitude = $_GET['lat'];
$longitude = $_GET['lon'];
$type = $_GET['type'];

echo $location;

$sql = "INSERT INTO smsstore1 (name,phonenu,lon,lat,type) VALUES ('Ramindu','".$phone."','".$longitude."','".$latitude."','".$type."')";

if ($conn->query($sql) === TRUE) {
    echo "success";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

require_once 'lib/SmsReceiver.php';
require_once 'lib/SMSSender.php';
require_once 'connectdb.php';

define('SERVER_URL', 'https://api.dialog.lk/sms/send');	
define('APP_ID', 'APP_015755');
define('APP_PASSWORD', '################');

$msg = "Ramindu is in a trouble ".$type."! Call him on ".$phone;
$add = 'tel:B%3C4nlVyF/kOJu8JNY5ozodtRQFTLfqBGDq27KyYcxaxOUK8sc8n+ee+z4Pt0ol/MMys';
$sender = new SMSSender( SERVER_URL, APP_ID, APP_PASSWORD); 
$sender->sms($msg, $add);

echo $msg.' sent';

?>

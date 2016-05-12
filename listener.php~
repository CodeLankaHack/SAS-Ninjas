<?php

require_once 'lib/SmsReceiver.php';
require_once 'lib/SMSSender.php';
require_once 'connectdb.php';

define('SERVER_URL', 'https://api.dialog.lk/sms/send');	
define('APP_ID', 'APP_015755');
define('APP_PASSWORD', '8aa7ec636c0e6e8acdb91d05da00a747');

echo 'test1';

    $receiver = new SmsReceiver(); 

    $content = $receiver->getMessage(); // get the message content
    $address = $receiver->getAddress(); // get the sender's address
    $requestId = $receiver->getRequestID(); // get the request ID
    $applicationId = $receiver->getApplicationId(); // get application ID
    $encoding = $receiver->getEncoding(); // get the encoding value
    $version = $receiver->getVersion(); // get the version

	$sql = "INSERT INTO smsstore1 (name,phonenu,lon,lat) VALUES ('Ramindu','".$address."','".$content."','".$content."')";	
	if ($conn->query($sql) === TRUE) {
    echo "success";
	} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
	}

	$sender = new SMSSender( SERVER_URL, APP_ID,  APP_PASSWORD); 
	$sender->sms( $address, $address);

	echo 'test2';

?>
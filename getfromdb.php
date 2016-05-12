<?php
$servername = "localhost";
$username = "chandimac";
$password = "CH@n6!Mac";
$dbname = "radi_auto";

// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// echo "Connected successfully";

$sql = "SELECT * FROM PublicNotification ORDER BY incidentDateTime DESC LIMIT 1";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
      // output data of each row
      while($row = $result->fetch_assoc()) {
          $alertquery = $row["firelocation"];
      }

  } else {
      echo "0 results";
  }

echo $alertquery;

$url="http://api.dialog.lk:8080/sms/send"
sendSMS($url,"There might be a wild fire near ".$alertquery[0] ". Please be CAUTIOUS!!!","0771231234","APP_000001","password");
function sendSMS ($url,$message,$addresses,$appid,$password){
  $req = array("message"=>$message,
    "destinationAddresses"=>$addresses,
    "applicationId"=>$appid,
    "password"=>$password
  );
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
  curl_setopt($ch, CURLOPT_POSTFIELDS,  json_encode($req));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $res = curl_exec($ch);
  curl_close($ch);
  return json_decode($res);
}
function recieveSMS(){
  $req = json_decode(file_get_contents('php://input'));
  $res = array('statusCode'=>'S1000','statusDetail'=>'Process completed successfully.');
  header('Content-type: application/json');
  return json_encode($res);
}

?>
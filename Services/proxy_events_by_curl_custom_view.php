<?php
$url = "http://webservices.rm.ingv.it/fdsnws/event/1/query?format=text";
$col_sep = "|";

// create curl resource
$ch = curl_init();

// set url
curl_setopt($ch, CURLOPT_URL, $url); 

//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);     

// split result lines and load into array
$result = preg_split("/\r\n|\n|\r/", $output);

// exit if empty result
if (count($result) < 1) exit; 

// select headers
$headers = explode($col_sep, $result[0]);

// customization: columns we don't want to see
$disabled_headers = array(
    "#EventID",
    "Author",
    "Catalog",
    "Contributor",
    "ContributorID",
    "MagType",
    "MagAuthor",
    "EventLocationName",
    "EventType"
); 

$toJSON = array();
for($i=1; $i<count($result)-1; $i++) {
    $row = explode($col_sep, $result[$i]);
    $toJSONrow = array();
    for($j=0; $j<count($headers); $j++) {
        if (!in_array($headers[$j], $disabled_headers)) {
            $value = isset($row[$j]) ? $row[$j] : '';
            $toJSONrow[$headers[$j]] = $value;
            // customization
            if ($headers[$j] == "Magnitude" and floatval($row[$j]) > 2) {
                $toJSONrow[$headers[$j]] = "<span class='font-weight-bold text-danger'>" . $value . "</span>"; // red color for events with mag > 2
            } 
            if ($headers[$j] == "Time") {
                $toJSONrow[$headers[$j]] = str_replace("T", " ", substr($toJSONrow[$headers[$j]], 0, 19)); // customize time format
            }
        }
    }
    array_push($toJSON, $toJSONrow);
}

// return result in the JSON format
echo json_encode($toJSON, JSON_NUMERIC_CHECK);
?>
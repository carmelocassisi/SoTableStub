<?php

	require_once "../php/globalvars.php";
	
	$rows = array();
	
	try {
		// Get the contents of the JSON file 
		$strJsonFileContents = file_get_contents("../" . JSON_CONFIG_FILE);
		//echo $strJsonFileContents;
	
		// Convert to array 
		$array = json_decode($strJsonFileContents, true);
		//var_dump($array)
		ksort($array);
		foreach($array["scenarios"] as $item) {
			if (!isset($item["private"]) or (isset($item["private"]) and $item["private"] == false)) {
				// pushArray represents a scenario by Name, Description, Services
				$pushArray = array(
					"Name" => "<a href='./?scenario=" . $item["ID"] . "'>" . $item["ID"] . "</a>",
					"Description" => isset($item["Description"]) ? $item["Description"] : null,
				);
				// Services field is formatted as an html list (to be used in the main page)
				if (isset($item["services"]) and is_array($item["services"])) {
					$pushArray["Services"] = "<ul>";
					foreach($item["services"] as $service) {
						$pushArray["Services"] .= "<li><a href='./?scenario=" . $item["ID"] . "&service=" . $service["ID"] . "'>" . $service["Name"] . "</a></li>";
					}
					$pushArray["Services"] .= "</ul>";
				}
				array_push($rows, $pushArray);
			}
		}
		
	} catch (Exception $e) {}
	
	echo json_encode($rows, JSON_NUMERIC_CHECK);
?>
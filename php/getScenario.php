<?php

	require_once "globalvars.php";
	
	$scenario = empty($_GET["scenario"]) ? "HOME" : $_GET["scenario"];

	$rows = null;

	try {
		// Get the contents of the JSON file 
		$strJsonFileContents = file_get_contents("../" . JSON_CONFIG_FILE);
		//echo $strJsonFileContents;
		
		// Convert to array 
		$array = json_decode($strJsonFileContents, true);
		//var_dump($array);
		foreach($array["scenarios"] as $item) {
			if (strcmp($item["ID"], $scenario) == 0) {
				$rows = $item;
			}
		}
		
	} catch (Exception $e) {}
	
	echo json_encode($rows, JSON_NUMERIC_CHECK);
?>
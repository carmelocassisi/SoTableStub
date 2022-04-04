<?php

	header('Access-Control-Allow-Origin: *');
	
	$rows = array();
	
	try {
		$rows = "Failure";
	} catch (Exception $e) {
		$rows["error"] = $e->getMessage();
	}

	echo json_encode($rows);
?>
<?php 
	require_once("php/JSONSchemaValidation.php");
	$myJSONSchemaValidation = new JSONSchemaValidation();
	$check = $myJSONSchemaValidation->getResult();
	$scenario = isset($_GET["scenario"]) ? $_GET["scenario"] : '';
	$service = isset($_GET["service"]) ? $_GET["service"] : null; 
?>
<html>
	<head>
		<title>SoTableStub</title>
		<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<!-- JQuery -->
		<script src='js/DataTables/jQuery-3.6.0/jquery-3.6.0.min.js' type='text/javascript'></script>
		<!-- DataTables -->
		<link rel="stylesheet" type="text/css" href="js/DataTables/datatables.min.css"/>
		<script type="text/javascript" src="js/DataTables/datatables.min.js"></script>
		<script type="text/javascript" src="js/DataTables/Bootstrap-5-5.0.1/js/bootstrap.bundle.min.js"></script>
		<link href='js/DataTables/Bootstrap-5-5.0.1/css/bootstrap.min.css' rel='stylesheet' type='text/css'>
		<!-- Custom -->
		<script src='js/SOWebTable.js?<?php echo rand();?>' type='text/javascript'></script>
		<script src='js/SOWebTableManager.js?<?php echo rand();?>' type='text/javascript'></script>	
		<link href='css/style.css' rel='stylesheet' type='text/css'>
		<link href='css/tabs.css' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div class="container-fluid">
			<h1 class='header display-6 bg-dark text-white' style='padding:1em'>
				<a href='.' id='home-link' style='vertical-align:middle'>
					<svg style='vertical-align:middle; width:1em; height:1em' xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
						<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
					</svg>
				</a>	
				<span style='vertical-align:middle' class='title'>SoTableStub</span>
				<div class='subtitle fs-5 text-left fst-italic'>A generic and responsive tool for the visualization of tabular data</div>
				<div class='header-info fs-6 text-left'></div>
			</h1>
			<?php if ($check["schema_validation"]["status"]) { ?>
			<script>
				var manager;
				var scenario = '<?php echo $scenario; ?>';
				var service = '<?php echo $service; ?>';
				$(document).ready(function(){
					document.title = scenario;
					manager = new SOWebTableManager({
						"scenario": scenario,
						"defaultServiceID": service
					});
				});
			</script>
			<div class='main'>
				<?php if (!$check["duplicate_ids"]["status"]) { ?>
					<div class="alert alert-warning" role="alert">
						<?php 
							echo "<div><b>Warning</b>: ";
							echo $check["duplicate_ids"]["message"];
							echo "</div>";
						?>
					</div>
				<?php } ?>
				<div class="tab" style="display:none"></div>
			</div>
			<?php } else { ?>
			<div class='main'>
				<div class="alert alert-danger" role="alert">
					<?php 
						echo "<h5>";
						echo $check["schema_validation"]["message"];
						echo "</h5>";
						echo "<pre>";
						var_dump($check["schema_validation"]["errors"]);
						echo "</pre>";
					?>
				</div>
			</div>
			<?php }?>
		</div>
	</body>
</html>
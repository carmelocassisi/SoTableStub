<?php

require_once "php/vendor/autoload.php";
require_once "globalvars.php";

class JSONSchemaValidation {

    public function getResult() {

        $result = array(
            "schema_validation" => array(),
            "duplicate_ids" => null
        );
        
        $config = json_decode(file_get_contents(JSON_CONFIG_FILE));
        
        // Validate
        $validator = new JsonSchema\Validator;
        $validator->validate($config, (object)array('$ref' => 'file://' . realpath('schema.json')));
        
        if ($validator->isValid()) {
            $result["schema_validation"]["status"] = true;
            $result["schema_validation"]["message"] = "The supplied JSON validates against the schema.";
        } else {
            $result["schema_validation"]["status"] = false;
            $result["schema_validation"]["message"] = "Your '" . JSON_CONFIG_FILE . "' file does not validate. Violations:";
            $result["schema_validation"]["errors"] = $validator->getErrors();
        }
        
        if ($result["schema_validation"]["status"])
            $result["duplicate_ids"] = $this->checkIDs($config);
        
        return $result;
    }
    
    // Check on duplicated IDs
    function checkIDs($data) {
        $scenariosIDs = array();
        foreach($data->scenarios as $scenario) {
            array_push($scenariosIDs, $scenario->ID);
    
            $serviceIDs = array();
            foreach($scenario->services as $service) {
                array_push($serviceIDs, $service->ID);
            }
    
            $checkDuplicates = $this->has_dupes($serviceIDs);
            if (!$checkDuplicates["status"]) {
                return array("status" => false, "message" => sprintf("Found duplicate ID on scenario '%s', services: '%s'", $scenario->ID, $checkDuplicates['duplicate']));
            }
        }
    
        $checkDuplicates = $this->has_dupes($scenariosIDs);
        if (!$checkDuplicates["status"]) {
            return array("status" => false, "message" => sprintf("Found duplicate ID on scenarios: '%s'", $checkDuplicates['duplicate']));
        }
    
        return array("status" => true, "message" => "OK. No duplicated IDs found");
    }
    
    
    function has_dupes($array) {
        $dupe_array = array();
        foreach ($array as $val) {
            if (!array_key_exists($val, $dupe_array)){
                $dupe_array[$val] = 0;
            }
            if (++$dupe_array[$val] > 1) {
                return array("status" => false, "duplicate" => $val);
            }
        }
        return array("status" => true);
    }
}
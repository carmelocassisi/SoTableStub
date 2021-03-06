# SoTableStub
A general purpose and responsive tool for the visualization of tabular data.  

## Description
The SoTableStub application allows you to create customized and general-purpose scenarios for viewing data in table format.  
This tool can read from **JSON** (default) or **text** data (like CSV, Comma Separated Values) where columns are separated by any text separator (i.e. ',' for CSV).  
  
Server side application code was written in PHP, while JavaScript language runs on the client side. In particular, *DataTables* library (https://datatables.net/) is used to build tables, while Bootstrap is used to design pages.
  
The application does not need the support of an RDBMS because the structure information, such as info about data to be displayed, are stored in a local configuration JSON file, called *config.json*.  
The project structure is very simple and is based on two main concepts, which are translated and transferred within the configuration file:  
- **Scenario**: a scenario is intended as a container that aggregates data from different sources within the same view.  
- **Service**: a service is the source of a dataset.  
The configuration file, therefore, contains a list of scenarios which, in turn, contain the list of services used to retrieve data to be displayed, with the related display options.
  
A **JSON schema** (https://json-schema.org/), called *schema.json* in the project folder, was provided in order to help the application administrators to correctly configure the *config.json* file.  
In addition to this, the tool has been equipped with a validator, which verifies that the configuration file follows the structure defined in the JSON schema. For this purpose, a PHP library,distributed under the MIT license on GitHub at: https://github.com/justinrainbow/json-schema, was imported into the project.

## Requirements
- PHP 5.3 version or successive (https://www.php.net/)  
- DataTables 1.11.4 (https://datatables.net/), with the following dependencies:
  - jQuery 3.6 (https://jquery.com/)
  - Bootstrap 5 (https://getbootstrap.com/)

## Configuration
The main page *index.php* is managed and generated by a *config.json* file.  
The main section, called **scenarios**, list all scenarios of data you want to plan.  
Every scenario contains a list of **services** under the homonym voice.  
  
The *config.json* file will be validated by a *schema.json* (**JSON Schema** - https://json-schema.org/).  
The *schema.json* provides the directives to compiles the *config.json* correctly, by defining the JSON document structure and all mandatory properties.  
The validation is run by using the JSON schema validator PHP code provided at https://github.com/justinrainbow/json-schema.  
If the *config.json* fails the test, the main page will return an alerting or warning message.  

## Use
For each dataset to show, add a service section into the data scenario section you want to create, by defining:  
- ID (*mandatory*)  
- Name (*mandatory*)  
- URL   

Each scenario can be shown by calling the following URL on the web server hosting your SoTableStub instance (if *index.php* is treated a default page by your web server):  
> http://*\<myWebServerAddress\>*/SoTableStub/?scenario=*\<myScenarioID\>*  
  
For example, the main page (http://*\<myWebServerAddress\>*/SoTableStub/) is the wrapper link of the following: 
> http://*\<myWebServerAddress\>*/SoTableStub/?scenario=HOME
define({ "api": [
  {
    "type": "get",
    "url": "/rides/:id",
    "title": "Fetch Ride Detail",
    "version": "1.0.0",
    "name": "GetRideDetail",
    "group": "Rides",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Rides Unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8010/rides/1",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success Response": [
          {
            "group": "Success Response",
            "type": "Object[]",
            "optional": false,
            "field": "rides",
            "description": "<p>Array of Object Ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.rideId",
            "description": "<p>The Unique ID of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.startLat",
            "description": "<p>Start Latitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.startLong",
            "description": "<p>Start Longitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.endLat",
            "description": "<p>End Latitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.endLong",
            "description": "<p>End Longitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.riderName",
            "description": "<p>Rider name of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.driverName",
            "description": "<p>Driver name of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.driverVehicle",
            "description": "<p>Driver vehicle of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Datetime",
            "optional": false,
            "field": "rides.created",
            "description": "<p>Time of the ride was started in format [YYYY-MM-DD HH:mm:ss]</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"rideID\": 1,\n        \"startLat\": 0,\n        \"startLong\": 0,\n        \"endLat\": 0,\n        \"endLong\": 0,\n        \"riderName\": \"Darwin\",\n        \"driverName\": \"Driver1\",\n        \"driverVehicle\": \"Honda CBR\",\n        \"created\": \"2020-07-19 10:14:16\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error Code": [
          {
            "group": "Error Code",
            "optional": false,
            "field": "SERVER_ERROR",
            "description": "<p>There is something wrong with database server</p>"
          },
          {
            "group": "Error Code",
            "optional": false,
            "field": "RIDES_NOT_FOUND_ERROR",
            "description": "<p>The <code>id</code> of the rides was not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Server-Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  error_code: 'SERVER_ERROR',\n  message:'Unknown error'\n}",
          "type": "json"
        },
        {
          "title": "Rides-Not-Found-Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  error_code: 'RIDES_NOT_FOUND_ERROR',\n  message:'Could not find any rides'\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/app.js",
    "groupTitle": "Rides"
  },
  {
    "type": "get",
    "url": "/rides",
    "title": "Fetch All Rides",
    "version": "1.0.0",
    "name": "GetRides",
    "group": "Rides",
    "success": {
      "fields": {
        "Success Response": [
          {
            "group": "Success Response",
            "type": "Object[]",
            "optional": false,
            "field": "rides",
            "description": "<p>Array of Object Ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.rideId",
            "description": "<p>The Unique ID of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.startLat",
            "description": "<p>Start Latitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.startLong",
            "description": "<p>Start Longitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.endLat",
            "description": "<p>End Latitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.endLong",
            "description": "<p>End Longitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.riderName",
            "description": "<p>Rider name of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.driverName",
            "description": "<p>Driver name of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.driverVehicle",
            "description": "<p>Driver vehicle of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Datetime",
            "optional": false,
            "field": "rides.created",
            "description": "<p>Time of the ride was started in format [YYYY-MM-DD HH:mm:ss]</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"rideID\": 1,\n        \"startLat\": 0,\n        \"startLong\": 0,\n        \"endLat\": 0,\n        \"endLong\": 0,\n        \"riderName\": \"Darwin\",\n        \"driverName\": \"Driver1\",\n        \"driverVehicle\": \"Honda CBR\",\n        \"created\": \"2020-07-19 10:14:16\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error Code": [
          {
            "group": "Error Code",
            "optional": false,
            "field": "SERVER_ERROR",
            "description": "<p>There is something wrong with database server</p>"
          },
          {
            "group": "Error Code",
            "optional": false,
            "field": "RIDES_NOT_FOUND_ERROR",
            "description": "<p>No rides found in this system</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Server-Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  error_code: 'SERVER_ERROR',\n  message:'Unknown error'\n}",
          "type": "json"
        },
        {
          "title": "Rides-Not-Found-Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  error_code: 'RIDES_NOT_FOUND_ERROR',\n  message:'Could not find any rides'\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/app.js",
    "groupTitle": "Rides"
  },
  {
    "type": "post",
    "url": "/rides",
    "title": "Start a New Ride",
    "version": "1.0.0",
    "name": "NewRides",
    "group": "Rides",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "Number",
            "size": "-90 - 90",
            "optional": false,
            "field": "start_lat",
            "description": "<p>Start latitude of the ride</p>"
          },
          {
            "group": "Body",
            "type": "Number",
            "size": "-180 - 180",
            "optional": false,
            "field": "start_long",
            "description": "<p>Start longitude of the ride</p>"
          },
          {
            "group": "Body",
            "type": "Number",
            "size": "-90 - 90",
            "optional": false,
            "field": "end_lat",
            "description": "<p>End latitude of the ride</p>"
          },
          {
            "group": "Body",
            "type": "Number",
            "size": "-180 - 180",
            "optional": false,
            "field": "end_long",
            "description": "<p>End longitude of the ride</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "rider_name",
            "description": "<p>Rider name of the ride</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "driver_name",
            "description": "<p>Driver name of the ride</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "driver_vehicle",
            "description": "<p>Driver Vehicle of the ride</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"start_lat\":0,\n    \"start_long\":0,\n    \"end_lat\":0,\n    \"end_long\":0,\n    \"rider_name\":\"Darwin\",\n    \"driver_name\":\"Driver1\",\n    \"driver_vehicle\":\"Honda CBR\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success Response": [
          {
            "group": "Success Response",
            "type": "Object[]",
            "optional": false,
            "field": "rides",
            "description": "<p>Array of Object Ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.rideId",
            "description": "<p>The Unique ID of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.startLat",
            "description": "<p>Start Latitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.startLong",
            "description": "<p>Start Longitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.endLat",
            "description": "<p>End Latitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Number",
            "optional": false,
            "field": "rides.endLong",
            "description": "<p>End Longitude of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.riderName",
            "description": "<p>Rider name of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.driverName",
            "description": "<p>Driver name of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "String",
            "optional": false,
            "field": "rides.driverVehicle",
            "description": "<p>Driver vehicle of the ride</p>"
          },
          {
            "group": "Success Response",
            "type": "Datetime",
            "optional": false,
            "field": "rides.created",
            "description": "<p>Time of the ride was started in format [YYYY-MM-DD HH:mm:ss]</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"rideID\": 1,\n        \"startLat\": 0,\n        \"startLong\": 0,\n        \"endLat\": 0,\n        \"endLong\": 0,\n        \"riderName\": \"Darwin\",\n        \"driverName\": \"Driver1\",\n        \"driverVehicle\": \"Honda CBR\",\n        \"created\": \"2020-07-19 10:14:16\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error Code": [
          {
            "group": "Error Code",
            "optional": false,
            "field": "VALIDATION_ERROR",
            "description": "<p>One or many rules of the validation has not been passed</p>"
          },
          {
            "group": "Error Code",
            "optional": false,
            "field": "SERVER_ERROR",
            "description": "<p>There is something wrong with database server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Validation-Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  error_code: 'VALIDATION_ERROR',\n  message:'Rider name must be a non empty string'\n}",
          "type": "json"
        },
        {
          "title": "Server-Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  error_code: 'SERVER_ERROR',\n  message:'Unknown error'\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/app.js",
    "groupTitle": "Rides"
  },
  {
    "type": "get",
    "url": "/health",
    "title": "Health check Web Server",
    "version": "1.0.0",
    "name": "HealthCheck",
    "group": "Utility",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "healthy",
            "description": "<p>Health status of the web server</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n    healthy:true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/app.js",
    "groupTitle": "Utility"
  }
] });

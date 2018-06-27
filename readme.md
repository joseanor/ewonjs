## ewonjs Interface Library

The eWON JS library provides direct and proxied access to your eWON devices<br>
via both stateful and stateless sessions.

A few things you can do with this library: 

* Access account information
* Access device information
* Retrieve live tag data from your devices
* Retrieve historical data directly from your eWON
    * Relative time 
    * Absolute time
* Execute BASIC scripts directly on your eWON


## Getting Started

Add ewonjs to your library by running: 

```javascript
    npm install --save jj11909/ewonjs
```


### Initializing a client
This library supports both stateful and stateless API sessions. <br>

#### Creating a session

```javascript
var ewon = require('@jj11909/ewonjs');

var client = new ewon.EwonClient(account, username, password, developerid);
```
<br>

After creating a client, if you would like to create a stateful session <br>
you must first login to the API. 

### Login to account

```javascript
/*
Sample Response:
Valid - 
    {t2msession: 'sessionid', success: true}

Invalid - 
    { message: 'Invalid credentials', code: 403, success: false }
*/
client.login().then((response) => {
    if(response.success) {
        // Login was valid
    }
})
```

<br>

### Creating a STATEFUL session
After logging into the account you can now create a stateful session. 
This will negate the need to use your username and password the entire
duration of the session. This will also give you login/logout capabilities. 

```javascript
client.login().then((response) => {
    if(response.success) {
        //Important Line
        client.updateSession(response.t2msession)
    }
})
```
<br><br>

### Terminating a session
You can end a session at any time by simply calling logout. 

```Javascript
client.logout();
```
<br><br>

### Retrieving Account Information

To access account information (company info, account type, pools, etc) <br>
call to account. A JSON Object of your account information will be returned.

```javascript
client.account().then((response) => {
    //Handle response
})
```

<br><br>

### Retrieve Account Devices

Retrieve all eWONs in your account including their LAN properties. Request
returns a JSON array of devices

```javascript
client.getDevices().then((response) => {
    for(var ewon in response.ewons) {
        console.log(ewon.name)
    }
})
```
<br><br>

### Retrieving a Single Device

To retrieve a single device you must pass the name of the desired device to 
the getDevice request. 

```javascript
var mydevicename = "myewon";
client.getDevice(mydevicename).then((response) => {
    console.log(response);
})

```
<br><br>

## Interfacing Directly with Device
In order to interface directly with the device, you must instantiate an<br>
eWON object. 

<b> Required Parameters:</b>
* Device name
* Talk2M Client
* Device Username
* Device Password

```javascript
var ewon = new ewon.Ewon(devicename, client, deviceusername, devicepassword);

```
<br><br>
### Retrieving Live Tag Data
By interfacing directly with the eWON we are able to retrieve<br>
live tag data from your systems.In order to simplify usage, the <br>
semi-colon delimited data will automatically be converted to a JSON array<br>
for you.

```javascript

ewon.getLiveTags().then((response) => {
    for(var tag in response) {
        console.log(response[tag].tagvalue)
    }
})

```

<br><br>

### Update Tag Data
You also have the ability to update your tag data. The updateTags option <br>
will accept either a single tag (JSON Object) or a JSONArray of tags. 

```javascript
var tags = [
    {"tagname": "tagname", "tagvalue": 0},
    {"tagname": "othertagname", "tagvalue": 20}
]

ewon.updateTags(tags);

// OR

var tag = {"tagname" : "mytag", "tagvalue" : 100}
ewon.updateTags(tag)
```

<br><br>

### Historical Data
If you are not using the Data Mailbox, you still have access to the historical data<br>
stored on your unit. You can request the relative historical endpoint to retrieve <br>
the historical data relative to a timeframe. <br><br>

NOTE: This is read directly from the eWON and can easily result in increased data costs<br>
and can take a while to parse. It is recommended to use the Data Mailbox for your historical <br>
data. 

```javascript
var interval = 10; 
/*
  This requests takes in 4 parameters. 
  A start interval and unit (seconds, hours, minutes, days)
  An end interval and unit
*/
ewon.getHistoricalRelative(interval, ewon.relative_units.hours, 0, ewon.relative_units.seconds).then((response) => {
    /*
        By default, the data is exported from the eWON in a CSV (semicolon) however in 
        order to make it easier to use, ewonjs will convert this data to a JSON array. 
    */
})

```
<br>


## TODO:
* Add script functionality
* Add Data Mailbox Functionality

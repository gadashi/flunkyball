//CLient ID:21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com
//Client secret:1bYKj5bZZtcInTejJgB3ujDU
//API key: AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k
//Table Id: 1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4


function read(gameID) {
  var params = {
    spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',
    range: 'aktiveSpiele!A' + (gameID * 4 +1) + ':L'+(gameID * 4 +4),
    //valueRenderOption: '',
    //dateTimeRenderOption: '',
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
    populateNames(response.result,gameID);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function writeData(data){

  var params = {
          // The ID of the spreadsheet to update.
          spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.
        };

        var batchUpdateValuesRequestBody = {

          "data": [
                    {
                      "range": "aktiveSpiele!A" + (1 + numberOfGames * 4) +":L"+ (numberOfGames * 4 +4),
                      "values": [data],
                    }
                  ],
                  valueInputOption: 'RAW',
                };

        var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
        request.then(function(response) {
          // TODO: Change code below to process the `response` object:
          console.log(response.result);
        }, function(reason) {
          console.error('error: ' + reason.result.error.message);
        });

}

function UpdateCell(rows,cols,data) {
  console.log(cols + rows);
   var params = {
     // The ID of the spreadsheet to update.
     spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.

     // The A1 notation of the values to update.
     range: 'aktiveSpiele!' + cols + rows +":"+ cols + rows ,  // TODO: Update placeholder value.
    
     // How the input data should be interpreted.
     valueInputOption: 'RAW',  // TODO: Update placeholder value.
   };

   var valueRangeBody = {
     'values': [[data]],// TODO: Add desired properties to the request body. All existing properties
     // will be replaced.
   };

   var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
   request.then(function(response) {
     // TODO: Change code below to process the `response` object:
     console.log(response.result);
   }, function(reason) {
     console.error('error: ' + reason.result.error.message);
   });
 }

function initClient() {
  var API_KEY = 'AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k';

  var CLIENT_ID = '21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com';
  //   'https://www.googleapis.com/auth/spreadsheets'
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    var query = window.location.search;

    if (query.substring(0, 1) == '?') {
      query = query.substring(1);
    }
    read(query);
  }
}

function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function populateNames(Names,gameID){
  //Teamnames:
  document.getElementById("Teamnames").innerHTML = Names.values[3][0] + " vs. " + Names.values[3][6];

  for(var i = 0; i < Names.values[3].length; i++){
    if(i != 0 && i != 6){
      document.getElementById('Spieler' + i).innerHTML = Names.values[3][i];
    }
  }
  row = gameID * 4 + 1;
  numberOfThrows = Names.values[0].length;
}

var row =0;
var numberOfThrows = 1;
var Alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L",
                "M","N","O","P","Q","R","S","T","U","V","W","X",
                "Y","Z"];
var finishedPlayers = [],
    numberOfHits = 0;
function miss(id){
var col="";
var findCol = numberOfThrows;
  while(findCol >= 0){
    col += Alphabet[findCol%26];
    findCol -= 26;
  }
  numberOfThrows++;
  console.log(row,col,id,numberOfThrows);
  UpdateCell(row,col,id);
  UpdateCell(row + 1,col,0);
  UpdateCell(row +2,col,0);

}

function done(id){
finishedPlayers.push([id,numberOfHits]);
   var col="";
  var findCol = numberOfThrows;
    while(findCol >= 0){
      col += Alphabet[findCol%26];
      findCol -= 26;
    }
  var updateCellValue = "";
  for(var i=0; i<finishedPlayers.length;i++){
    updateCellValue += finishedPlayers[i][0]+ ",";
  }
  UpdateCell(row+ 1,col,0);
  console.log(finishedPlayers);

}
function hit(id){
  numberOfHits++;
  var col="";
  var findCol = numberOfThrows;
    while(findCol >= 0){
      col += Alphabet[findCol%26];
      findCol -= 26;
    }
    numberOfThrows++;
    console.log(row,col,id,numberOfThrows);
    UpdateCell(row,col,0);
    UpdateCell(row+ 1,col,0);
    UpdateCell(row+2,col,id);

}
window.onload = function(){
  handleSignInClick();
}

//CLient ID:21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com
//Client secret:1bYKj5bZZtcInTejJgB3ujDU
//API key: AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k
//Table Id: 1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4

function read() {
  var params = {
       // The ID of the spreadsheet to retrieve data from.
       spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.

       // The A1 notation of the values to retrieve.
       ranges: ['allGames','allPlayers!A1:A100'],  // TODO: Update placeholder value.

     };

     var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
     request.then(function(response) {
       console.log(response.result);
       //find all active Games
       activeGames(response.result.valueRanges[0].values);
       //access data: response.result.valueRanges[0].values
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
                      "values": data,
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
    read();
  }
}

function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function activeGames(gameData){
  var div = document.getElementById("activeGames");
  var text ="";
  //loop through all games and find all that are not finished
  for(var numGames = 0; numGames < gameData.length; numGames += 4){
    if(gameData[numGames+3][1] != 1 && gameData[numGames+3][7] != 1){
      //means this game is active
      text += "<a href='javascript:sendData(" + numGames/4 + ");'>" +
              gameData[numGames][1] + " gegen " + gameData[numGames][7]+
              "</a><br>";
    }
  }
  div.innerHTML = text;
}

function selectPlayer(buttonID){
  div=document.getElementById("PlayerSelection");
  var text="";
}

function sendData(gameID){
  window.location = "Spiel.html?" + gameID;
}

window.onload = function(){
  handleSignInClick();
}

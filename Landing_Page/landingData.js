var result;

function loadData(){
  var params = {
          // The ID of the spreadsheet to retrieve data from.
          spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.

          // The A1 notation of the values to retrieve.
          ranges: ['allGames','allPlayers!A1:A100'],  // TODO: Update placeholder value.

        };

        var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
        request.then(function(response) {
          // TODO: Change code below to process the `response` object:
          result = response.result;
          respond(response.result.valueRanges[1]);
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
    loadData();
  }
}

function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function respond(results){
  respondPlayer(result);
}

function respondPlayer(result){
  var div = document.getElementById("Spieler");
    var text ="";
    text += "<table style='width:100%; height:100%;'>";
    for(var rows = 0; rows<4;rows++){
      text += "<tr>";
      for (var cols = 0; cols < 10; cols++) {
        text += '<th>'  ;
        text += result.values[rows][cols];
        text += '</th>';
      }
      text += "</tr>";
    }
    text += "</table>";
    div.innerHTML = text;
}

window.onload = function(){
  handleSignInClick();
}

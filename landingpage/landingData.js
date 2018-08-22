var result;

function loadData(){
  var params = {
          // The ID of the spreadsheet to retrieve data from.
          spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.

          // The A1 notation of the values to retrieve.
          ranges: ['allGames','allPlayers'],  // TODO: Update placeholder value.

        };

        var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
        request.then(function(response) {
          // TODO: Change code below to process the `response` object:
          console.log(response.result);
          result = response.result;
          respond(response.result);

        }, function(reason) {
          console.error('error: ' + reason.result.error.message);
        });

}

function initClient() {
  var API_KEY = 'AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k';

  var CLIENT_ID = '21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com';
  //   'https://www.googleapis.com/auth/spreadsheets'
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

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
    console.log("signed in");
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
  displayData(results.valueRanges[0],4,"Spiele")
  displayData(results.valueRanges[1],4,"Spieler");
}

function displayData(result,length,id){
  var div = document.getElementById(id);
    var text ="";
    text += "<table style='width:100%; height:100%;'>";
    for(var rows = 0; rows<length;rows++){
      text += "<tr>";
      var count = 0;
      id == "Spieler" ? count = 10 : count = 13;
      console.log(count, result.values[rows].length);
      for (var cols = 0; cols < count; cols++) {
        text += '<th>'  ;
        if(result.values[rows][cols] == undefined){
        text += "0";
        }
        else{
          text += result.values[rows][cols];
        }
        text += '</th>';
         
      }
      text += "</tr>";
    }
    text += "</table>";
    div.style.height = 50 * length + "px";
    div.innerHTML = text;
}

function showAll(id){
  var data;
  if(id == "Spiele"){
    data = result.valueRanges[0];
  } else {
    data = result.valueRanges[1];
  }
  console.log(data,data.values.length,id);
  displayData(data,data.values.length,id);
}

window.onload = function(){
  handleSignInClick();
}

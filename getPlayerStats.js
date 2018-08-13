
//CLient ID:21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com
//Client secret:1bYKj5bZZtcInTejJgB3ujDU
//API key: AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k
//Table Id: 1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4
var result1;
function makeApiCall() {
  var params = {
    spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',
    range: 'Tabellenblatt1',
    //valueRenderOption: '',
    //dateTimeRenderOption: '',
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
    respond(response.result);
    result1 = response.result;
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
    makeApiCall();
  }
}

function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function respond(result){
  var div = document.getElementById("Spieler");
  if(result.values.length > 0){
    var text ="";
    text += "<table style='width:100%; height:100%;'>";

    for(var rows = 0; rows<4;rows++){
      text += "<tr>";
      for (var cols = 0; cols <10; cols++) {
        text += '<th>'  ;
        text += result.values[rows][cols];
        text += '</th>';
      }
      text += "</tr>";
    }
    text += "</table>";
    div.innerHTML = text;
    
      var div = document.getElementById("Spiele");
      var text ="";
      text += "<table style='width:100%; height:100%;'>";

      for(var rows = 0; rows<4;rows++){
        text += "<tr>";
        for (var cols = 10; cols < 30; cols++) {
          text += '<th>'  ;
          text += result.values[rows][cols];
          text += '</th>';
        }
        text += "</tr>";
      }
      text += "</table>";
      div.innerHTML = text;
  }
}

function buttonExpand(){
  console.log(result1);
  var div = document.getElementById("Spieler");
  if(result1.values.length > 0){
    var text ="";
    text += "<table style='width:100%; height:100%;'>";

    for(var rows = 0; rows<result1.values[0].length;rows++){
      text += "<tr>";
      div.height += 50;
      for (var cols = 0; cols < 10; cols++) {
        console.log(rows, cols);
        text += '<th>'  ;
        text += result1.values[rows][cols];
        text += '</th>';
      }
      text += "</tr>";
    }
    text += "</table>";
    div.innerHTML = text;
  }
}

window.onload = function(){
  handleSignInClick();
}

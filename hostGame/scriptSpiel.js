//CLient ID:21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com
//Client secret:1bYKj5bZZtcInTejJgB3ujDU
//API key: AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k
//Table Id: 1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4


function read(gameID) {
  var params = {
    spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',
    range: 'aktiveSpiele!A' + (gameID * 4 +1) + ':L'(gameID * 4 +4),
    //valueRenderOption: '',
    //dateTimeRenderOption: '',
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
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

window.onload = function(){
  handleSignInClick();
}

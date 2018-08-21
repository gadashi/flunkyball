//CLient ID:21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com
//Client secret:1bYKj5bZZtcInTejJgB3ujDU
//API key: AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k
//Table Id: 1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4

var PlayerData;
function read(gameID) {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.
    // The A1 notation of the values to retrieve.
    ranges: ['allGames!A' + (gameID * 4 +1) + ':M'+(gameID * 4 +4),"allPlayers"],  // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
    populateNames(response.result.valueRanges[0],gameID);
    PlayerData = response.result.valueRanges[1].values;
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}



function updateCell(rows,cols,data) {
  console.log(cols + rows);
   var params = {
     // The ID of the spreadsheet to update.
     spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.

     // The A1 notation of the values to update.
     range: 'allGames!' + cols + rows +":"+ cols + rows ,  // TODO: Update placeholder value.

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

 function updatePlayers() {
    var params = {
      // The ID of the spreadsheet to update.
      spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',
      // The A1 notation of the values to update.
      range: 'allPlayers!A1:J' ,  // TODO: Update placeholder value.
      // How the input data should be interpreted.
      valueInputOption: 'RAW',  // TODO: Update placeholder value.
    };

    var valueRangeBody = {
      'values': PlayerData ,// TODO: Add desired properties to the request body. All existing properties
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

var GameData;
var row =0;
var hits1, hits2;
function populateNames(Names,gameID){
  //Teamnames:
  document.getElementById("Teamnames").innerHTML = Names.values[0][1] + " vs. " + Names.values[0][7];

  //write the names of the Players over the buttons if there are only 4 players hide the buttons
  for(var i = 2; i < 13; i++){
    if(i != 7){
      if(Names.values[0][i] == undefined){
        console.log(document.getElementById('Spieler' + i ).parentElement);
        document.getElementById('Spieler' + i ).parentElement.style.display ="none";
      }
      else{
        document.getElementById('Spieler' + i).innerHTML = Names.values[0][i];
      }
    }

  }
  GameData = Names.values;
  row = gameID * 4 + 1;
  hits1 = Names.values[2][1];
  hits2 = Names.values[2][7];

}

var Alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L",
                "M","N","O","P","Q","R","S","T","U","V","W","X",
                "Y","Z"];

function miss(id){
  var whichTeam = 0;
  if(id > 6){
    whichTeam = 6;
  }
  if(GameData[1][id] == undefined){
    GameData[1][id] = 1;
  }
  else{
      GameData[1][id]++;
  }
  document.getElementById("miss" + id).innerHTML = "X <br> (" + GameData[1][id] + ')';
  col = Alphabet[id];
  updateCell(row + 1,col,GameData[1][id]);
}

function endGame(winner){
  //update each Players stats

  for(var i = 2; i < 13; i++){
    if(i == 7){i++;}
      var name = GameData[0][i];
      for(var numPlayers = 1; numPlayers < PlayerData.length;numPlayers++){
        if(PlayerData[numPlayers][0] == name){
          //found the player in the database now give him data
          //add a game
          PlayerData[numPlayers][1] -= -1;
          //if he won add a victory
          PlayerData[numPlayers][2] -= -GameData[3][winner];
          //update number of throws
          PlayerData[numPlayers][4] -= -(GameData[1][i] -( GameData[2][i] * (-1)));
          //update number of hits
          PlayerData[numPlayers][5] -= -GameData[2][i];
          //check how many times it hits him to win
          if(GameData[3][winner] == 1){
            PlayerData[numPlayers][7] -= -GameData[2][winner];
          }
        }
      }
  }
  updatePlayers();
}

function checkIfOver(){
  var t1Ready, t2Ready,t1Players,t2Players;
  for(var i = 2; i < 7; i++){
    if(GameData[3][i] !== undefined){
      t1Players++;
    }
    if(GameData[3][i + 6] !== undefined){
      t2Players++;
    }
  }
  for(var i = 2; i < 7; i++){
    if(GameData[3][i] !== undefined){
      t1Ready++;
    }
    if(GameData[3][i + 6] !== undefined){
      t2Ready++;
    }
  }
  if(t1Ready == t1Players){
    return 1;
  }
  if(t2Ready == t2Players){
    return 2;
  }
  return 0;
}

function done(id){

  var value =hits1;
  if(id > 6){
    value =  hits2;
  }

  document.getElementById("done" + id).style.backgroundColor = "grey";
  col = Alphabet[id];
  updateCell(row + 3,col,value);
  GameData[3][id] = value;
  if(checkIfOver() == 1){
    endGame(1);
  }
  else if(checkIfOver() == 2){
    endGame(7);
  }
}

function hit(id){
  var whichTeam = 0;
  if(id > 6){
    whichTeam = 6;
     hits2++;
  }
  else{
   hits1++;
  }
  if(GameData[2][id] == undefined){
    GameData[2][id] = 1;
  }
  else{
      GameData[2][id]++;
  }

  document.getElementById("hit" + id).innerHTML = " &#10003; <br> (" + GameData[2][id] + ')';

  col = Alphabet[id];
  updateCell(row + 2,col,GameData[2][id]);
}
window.onload = function(){
  handleSignInClick();
}
//CLient ID:21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com
//Client secret:1bYKj5bZZtcInTejJgB3ujDU
//API key: AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k
//Table Id: 1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4

function read() {
  var params = {
       // The ID of the spreadsheet to retrieve data from.
       spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',
       // The A1 notation of the values to retrieve.
       ranges: ['allGames','allPlayers!A2:A'],
     };

     var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
     request.then(function(response) {
       console.log(response.result);
       //find the hidden div and write all the names onto it
       populateHiddenDiv(response.result.valueRanges[1].values)
       //find all active Games and display them on the screen
       activeGames(response.result.valueRanges[0].values);
       //access data: response.result.valueRanges[0].values
     }, function(reason) {
       console.error('error: ' + reason.result.error.message);
     });

}

function writeData(data,newGameID){

  var params = {
          // The ID of the spreadsheet to update.
          spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.
        };

        var batchUpdateValuesRequestBody = {

          "data": [
                    {
                      "range": "allGames!A" + (1 + newGameID * 4) +":M"+ (newGameID * 4 +4),
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
  document.getElementById("beginP").innerHTML = "<button id='beginButton'onclick='prepData("+
  (gameData.length / 4 )+")'> Spiel starten </button>";
}

var lockedPlayers = ["","","","","","","","","",""];
var Players = [];
function populateHiddenDiv(playerNames){
  //find the hidden div and place buttons for all Players in the database
  var div=document.getElementById("PlayerSelection");
  var text="";
  for(var numPlayers = 0; numPlayers < playerNames.length; numPlayers++){
    text += "<button class='playerChoices' id='a" + numPlayers + "' onclick='setPlayer(" + numPlayers + ")'> " + playerNames[numPlayers][0] + "</button>";
    //init an array of Players that were locked in
    if(numPlayers%6==5){
      text += "<br>";
    }
    Players[numPlayers] = playerNames[numPlayers][0];
  }

  div.innerHTML = text;
  numberOfGames = playerNames.length / 4;
}

var selectedPosition = 0;
function selectPlayers(buttonID){
  //display a list of all the Players that can play and save the button that was clicked
  div=document.getElementById("PlayerSelection");
  div.style.left = (buttonID % 5) * 100;
  div.style.display  = "block";
  if(lockedPlayers[buttonID] !== ""){
  document.getElementById(lockedPlayers[buttonID]).style.borderColor = "black";
  }
  selectedPosition = buttonID;
}

function setPlayer(playerID_Array){
  /*
  when a Player is selected update the button it was chosen from.
  Also update the list of locked in players and if this player was in another
  position before remove him from there.
  Also update color of all changed Buttons.
  */
  console.log(lockedPlayers);
  console.log(playerID_Array, selectedPosition);
  //change the color of the button with the previous Player in this position back to green if there was one before
  if(lockedPlayers[selectedPosition] !== ""){
  document.getElementById('a'+lockedPlayers[selectedPosition]).style.borderColor = "green";
  }
  //if another Player is in this position already reset his border color
  if(lockedPlayers[selectedPosition] !== ""){
    document.getElementById('a' + playerID_Array).style.borderColor = "green";
  }

  //if this player was in another position before remove him from that position
  for(var positions = 0; positions < lockedPlayers.length; positions++){
    if(lockedPlayers[positions] == playerID_Array){
      lockedPlayers[positions] = "";
      document.getElementById(positions).innerHTML = "+";
      document.getElementById(positions).style.fontSize = "40px";

    }
  }

  var buttonOfSelectedPosition = document.getElementById(selectedPosition);
  var selectionDiv = document.getElementById("PlayerSelection");

  //set the value of the position of the Player to the ID of the player
  lockedPlayers[selectedPosition] = playerID_Array;

  //update the text of the selected button
  buttonOfSelectedPosition.innerHTML = Players[playerID_Array];
  buttonOfSelectedPosition.style.fontSize = "20px";

  //set the border of the newly selected Player to blue or red
    if(selectedPosition < 5){
      document.getElementById('a'+playerID_Array).style.borderColor = "blue";
    }
    else{
      document.getElementById('a'+playerID_Array).style.borderColor = "red";
    }
    //hide the selection div again
  document.getElementById("PlayerSelection").style.display ="none";


}

function prepData(newGameID){
  var Teams = [],
    today = new Date(),
    dd = today.getDate(),
    mm = today.getMonth()+1,
    yyyy = today.getFullYear(),
    err = false;

  Teams[0] = dd + '.' + mm + '.'+ yyyy;
  Teams[1] = document.getElementById("teamname1").value;
  Teams[7] = document.getElementById("teamname2").value;
  for(i=2; i < 7; i++){
    Teams[i] = lockedPlayers[i-2];
    Teams[i + 6]= lockedPlayers[i+3];
    if((Teams[i] == undefined || Teams[i + 6] == undefined) && (i-2)%6 != 5){
      err = true;
      console.log("truueeee");
    }
  }
  var Data =[Teams,["Daneben"],["Treffer"],["Fertig",0,,,,,,0]];
  if(!err){
  writeData(Data,newGameID);
  //sendData(newGameID);
  }
  else{
  console.log("please select more Players");
  }
}

function sendData(gameID){
  window.location = "Spiel.html?" + gameID;
}

window.onload = function(){
  handleSignInClick();
}

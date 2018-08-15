//CLient ID:21449399299-k4ln8srecgb3u0ejn3vdt80k3eeq1jv6.apps.googleusercontent.com
//Client secret:1bYKj5bZZtcInTejJgB3ujDU
//API key: AIzaSyAh2TO5vxJchkAKTL_dyIR7yOmfzrNpC5k
//Table Id: 1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4
var Players = [];
var lockedPlayers = [];
var numberOfGames = 0;
var Teams = new Array(12);

function read(source) {
  var params = {
    spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',
    range: source + "!A1:A100",
    //valueRenderOption: '',
    //dateTimeRenderOption: '',
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    // TODO: Change code below to process the `response` object:
    console.log(response.result);
    if(source=="Tabellenblatt1"){
      Players = response.result;
      for(var i=0;i<Players.values.length;i++){
        lockedPlayers[i] = 0;
      }
    }
    else if(source=="aktiveSpiele"){
        activeGames(response.result);
    }
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function writeData(daten){

  var params = {
          // The ID of the spreadsheet to update.
          spreadsheetId: '1QC0B1p0LdTS2vE8l-bE8zueFOiBqUctHLeWZSzxWFb4',  // TODO: Update placeholder value.
        };

        var batchUpdateValuesRequestBody = {

          "data": [
                    {
                      "range": "aktiveSpiele!A" + (1 + numberOfGames * 4) +":L"+ (numberOfGames * 4 +4),
                      "values": daten,
                    }
                  ],
                  valueInputOption: 'RAW',
                };
        console.log(daten);
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
    read("Tabellenblatt1"); //TODO: change Tabellenblatt1 to Spieler in here, getPlayerStats and database
    read("aktiveSpiele");
  }
}

function handleSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}



function selectPlayers(PlayerID_inGame){
console.log(Players.values);
  //upon +Button press call the function with the ingame player id as an Argument

  div=document.getElementById("PlayerSelection");

  var text="";
  //create a Buttonpanel from which a Player from the database can be added
  for(var rows = 1; rows < Players.values.length; rows++){
    if(lockedPlayers[rows] != PlayerID_inGame){
      //console.log(Players.values[rows][0]);
      text += "<button class='playerChoices' onclick='setPlayer(" + PlayerID_inGame + "," + rows +")'";
      if(lockedPlayers[rows] != 0 && lockedPlayers[rows]<20){
         text += "style='border-color: blue;'"
      }
      else if(lockedPlayers[rows] != 0 && lockedPlayers[rows]>20){
       text += "style='border-color: red;'"
      }
      text += " >" + Players.values[rows][0] + "</button>";
      if((rows + 1)%6 == 5){
        text += "<br>";
      }
    }

  }
   text += "<button class='playerChoices' >  +  </button>";
  div.style.left = (PlayerID_inGame % 10 - 1) * 100;
  div.style.display  = "block";
  div.innerHTML = text;
}

function setPlayer(playerID_inGame,playerID_Array){
  console.log("called",playerID_inGame,playerID_Array);
  var buttons =document.getElementById(playerID_inGame);

  var playerName = Players.values[playerID_Array][0];

  //if there was a player in this position before remove him from lockedPlayers
  for(var i=0;i<lockedPlayers.length;i++){
    if(lockedPlayers[i] == playerID_inGame){
        lockedPlayers[i]=0;

    break;
    }
  }
  //if a player is already at another position remove him from there
  if(lockedPlayers[playerID_Array]!=0){
  document.getElementById(lockedPlayers[playerID_Array]).innerHTML="+";
  document.getElementById(lockedPlayers[playerID_Array]).style.fontSize="40px";
  }
  lockedPlayers[playerID_Array] = playerID_inGame;
  console.log(lockedPlayers);

    var div= document.getElementById("PlayerSelection");
  div.style.display = "none";
  buttons.innerHTML = playerName;
  document.getElementById(playerID_inGame).style.fontSize = "20px";

  //new
  var Arraypos = playerID_inGame - 10;
  if(Arraypos > 10){
    Arraypos -= 4;
  }
  Teams[Arraypos] = playerName;
}

function activeGames(result){
  numberOfGames = result.values.length / 4 ;

  var div = document.getElementById("activeGames");
  var text ="";
  for(var i = 0;  i<result.values.length; i += 4){
    text += "<a href='javascript:sendData(" + i + ");'>" +
            result.values[i+3][0] + " gegen " + result.values[i+3][6]+
            "</a><br>";

  }
  div.innerHTML = text;
}

function prepData(){

  Teams[0] = document.getElementById("teamname1").value;
  Teams[6] = document.getElementById("teamname2").value;
  var Data = [["Daneben"],["Treffer"],["Fertig"],Teams];
  writeData(Data); 

}

function sendData(gameID){
  window.location = "Spiel.html?" + gameID;
}

window.onload = function(){
  handleSignInClick();
}

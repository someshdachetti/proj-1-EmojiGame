const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const path = require("path");

const database = path.join(__dirname, "cricketMatchDetails.db");

let DATABASE = null;

let start = async () => {
  try {
    DATABASE = await open({
      filename: database,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("SERVER RUNNING AT http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DATABASE ERROR ${e.message}`);
  }
};
start();

const snakeCase_to_camelCase_IN_playerdetails = (databaseObject) => {
  return {
    playerId: databaseObject.player_id,
    playerName: databaseObject.player_name,
  };
};

const snakeCase_to_camelCase_IN_matchesdetails = (databaseobjects) => {
  return {
    matchId: databaseobjects.match_id,
    match: databaseobjects.match,
    year: databaseobjects.year,
  };
};
//API 1
app.get("/players/", async (request, response) => {
  const getplayer = `
    SELECT
     *
    FROM 
    player_details`;

  const x = await DATABASE.all(getplayer);
  response.send(x.map((each) => snakeCase_to_camelCase_IN_playerdetails(each)));
});

//API 2

app.get("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;

    const get_A_Player = `
    
    SELECT
    *
   
    FROM 
    player_details

    WHERE 
    player_id = ${playerId};`;

    const result = await DATABASE.get(get_A_Player);
    response.send(snakeCase_to_camelCase_IN_playerdetails(result));
  } catch (e) {
    console.log(`data BASE error ${e.message}`);
  }
});

// API 3

app.put("/players/:playerId/", async (request, response) => {
  const { playerName } = request.body;
  const { playerId } = request.params;

  const zzz = `
    UPDATE
    player_details
    
    SET 
    player_name = '${playerName}'
   

    WHERE
    player_id = ${playerId};`;

  const z = await DATABASE.run(zzz);
  response.send("Player Details Updated");
});

// API 4

app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;

  try {
    let x = `
        SELECT
        *
        FROM
       match_details
        
        WHERE
        match_id = ${matchId}`;

    let a = await DATABASE.get(x);
    response.send(snakeCase_to_camelCase_IN_matchesdetails(a));
  } catch (e) {
    console.log(`DATABASE ERROR$ ${e.message}`);
  }
});

//API 5

app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;

  let aa = `
        SELECT 
        *    
       
           FROM 
           player_match_score
      NATURAL JOIN player_details

        WHERE
         player_id= ${playerId};`;

  let yyy = await DATABASE.get(aa);
  response.send(
    yyy.map((eachmatch) => snakeCase_to_camelCase_IN_matchesdetails(eachmatch))
  );
});

// API 6

app.get("/matches/:matchId/players/", async (request, response) => {
  const { matchId } = request.params;
  const getMatchPlayersQuery = `
    SELECT
      *
    FROM player_match_score
      NATURAL JOIN player_details
    WHERE
      match_id = ${matchId};`;
  const zz = await DATABASE.all(getMatchPlayersQuery);
  response.send(
    zz.map((each) => snakeCase_to_camelCase_IN_playerdetails(each))
  );
});

//API 7

app.get("/players/:playerId/playerScores/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getmatchPlayersQuery = `
    SELECT
      player_id AS playerId,
      player_name AS playerName,
      SUM(score) AS totalScore,
      SUM(fours) AS totalFours,
      SUM(sixes) AS totalSixes
    FROM player_match_score
      NATURAL JOIN player_details
    WHERE
      player_id = ${playerId};`;
    const playersMatchDetails = await DATABASE.get(getmatchPlayersQuery);
    response.send(playersMatchDetails);
  } catch (e) {
    console.log(`data base ERROR ${e.message}`);
  }
});

module.exports = app;

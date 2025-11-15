import fetch from "node-fetch";
import readline from "readline";

const API_Key = "qiQfLpGuYWpP3BRYT4BIxdEEDLRtmwj3hr4v4IySLdFaceoffGjhRJ35eQ6z11Bs"

async function getEvents(teamName) {
    const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${teamName}/events/2023`,{
        method: "GET",
        headers: {
            "X-TBA-Auth-Key": API_Key,
            "Content-Type": "application/json"
        }
    }
    );
    return await response.json();
}

async function getTeams(events) {
    const teamsData = [];

    if (!Array.isArray(events) || events.length === 0) {
        console.log("No events found for the given team name.");
        process.exit(0);
    }

    for (const event of events) {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${event.key}/teams`, {
            method: "GET",
            headers: {
                "X-TBA-Auth-Key": API_Key,
                "Content-Type": "application/json"
            }
        });

        const teams = await response.json();
        teamsData.push(...teams);  // spread into flat array
    }

    return teamsData;
}


async function getUniqueness(teamsData){
    const uniqueTeams = new Set();
    const uniqueCountries = new Set();
    const uniqueStates = new Set();
    const uniqueCities = new Set();

    
        for(const team of teamsData){
            uniqueTeams.add(team.team_number);
            uniqueCities.add(team.city);
            uniqueStates.add(team.state_prov);
            uniqueCountries.add(team.country);
        }

        return [uniqueTeams, uniqueCities, uniqueStates, uniqueCountries];
    }



async function main() {

    let teamName = process.argv[2];

    if(!teamName){
        console.log("Please provide a team name as an argument.");
        process.exit(0);
    }

    teamName = teamName.trim();
    if(!teamName.startsWith("frc")){
        teamName = "frc" + teamName;
    }
    
    let events = await getEvents(teamName);

    
    const teams = await getTeams(events);
    const [uniqueTeams, uniqueCities, uniqueStates, uniqueCountries] = await getUniqueness(teams);

    console.log("Unique Teams:", uniqueTeams.size);
    console.log("Unique Cities:", uniqueCities.size);
    console.log("Unique States:", uniqueStates.size);
    console.log("Unique Countries:", uniqueCountries.size);





    
}

main();

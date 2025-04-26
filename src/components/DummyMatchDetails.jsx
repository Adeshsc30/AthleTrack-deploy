import React, { useEffect, useState } from "react";
import MatchDetails from "./MatchDetails";
import { useParams } from "react-router-dom";
import GraphicalStats from "./GraphicalStats";
import axios from "axios";

const DummyMatchDetails = () => {
  const { matchId } = useParams();
  const [transformedData, setTransformedData] = useState(null); // Transformed data in dummyData format

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        // Fetch match details using matchId
        const matchResponse = await axios.get(`https://athle-track-backend-ecru.vercel.app/api/match/matches/${matchId}/`);
        const match = matchResponse.data;
        console.log(match)

        // Calculate team1Score and team2Score
        let team1Score = 0;
        let team2Score = 0;

        match.player_stats.forEach((playerStat) => {
          if (playerStat.team_id === match.team_1._id) {
            team1Score += playerStat.points;
          } else if (playerStat.team_id === match.team_2._id) {
            team2Score += playerStat.points;
          }
        });

        // Fetch player details and transform player_stats
        const transformedPlayerStats = await Promise.all(
          match.player_stats.map(async (playerStat) => {
            try {
              const playerResponse = await axios.get(
                `https://athle-track-backend-ecru.vercel.app/api/player/getPlayerById/${playerStat.player_id}`
              );
              const player = playerResponse.data;

              return {
                player_name: player.name,
                team_id: playerStat.team_id === match.team_1._id ? match.team_1.team_details.name : match.team_2.team_details.name,
                points: playerStat.points,
                assists: playerStat.assists,
                rebounds: playerStat.rebounds,
              };
            } catch (error) {
              console.error(`Error fetching player details for ID ${playerStat.player_id}:`, error);
              return null; // Return null if the request fails
            }
          })
        );

        // Filter out any null values
        const filteredPlayerStats = transformedPlayerStats.filter((stat) => stat !== null);

        // Transform match data to match dummyData structure
        const transformedMatchData = {
          team1: match.team_1.team_details.name,
          team2: match.team_2.team_details.name,
          team1Logo: match.team_1.team_details.logo,
          team2Logo: match.team_2.team_details.logo,
          team1Score,
          team2Score,
          playerStats: filteredPlayerStats,
        };

        setTransformedData(transformedMatchData);
      } catch (error) {
        console.error("Error fetching match details:", error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      {transformedData ? (
        <div>
          <MatchDetails
            team1={transformedData.team1}
            team1Logo={transformedData.team1Logo} // Add logo if needed
            points1={transformedData.team1Score}
            team2={transformedData.team2}
            team2Logo={transformedData.team2Logo} // Add logo if needed
            points2={transformedData.team2Score}
            players1={transformedData.playerStats.filter(
              (player) => player.team_id === transformedData.team1
            )}
            players2={transformedData.playerStats.filter(
              (player) => player.team_id === transformedData.team2
            )}
          />
          <GraphicalStats
            team1={transformedData.team1}
            team2={transformedData.team2}
            team1Score={transformedData.team1Score}
            team2Score={transformedData.team2Score}
            playerStats={transformedData.playerStats}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500">
            Loading Match Details...
          </div>
        </div>
      )}
    </div>
  );
};

export default DummyMatchDetails;
import React, { useEffect, useState } from 'react';

const App = () => {
  const [standings, setStandings] = useState({ al: [], nl: [] });

  // Mapping of division IDs to division names
  const divisionNames = {
    '201': 'AL East',
    '202': 'AL Central',
    '200': 'AL West',
    '204': 'NL East',
    '205': 'NL Central',
    '203': 'NL West'
  };

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const [alResponse, nlResponse] = await Promise.all([
          fetch('https://statsapi.mlb.com/api/v1/standings?ver=v1&leagueId=103'),
          fetch('https://statsapi.mlb.com/api/v1/standings?ver=v1&leagueId=104')
        ]);

        const alData = await alResponse.json();
        const nlData = await nlResponse.json();

        const processStandings = (data) => {
          return data.records.map((division) => {
            const divisionName = divisionNames[division.division.id] || 'Unknown Division';
            const sortedTeams = division.teamRecords
              .map((team) => ({
                name: team.team.name,
                wins: team.wins,
                losses: team.losses,
                pct: team.winPercentage
              }))
              .sort((a, b) => b.pct - a.pct); // Sort by winning percentage in descending order

            return {
              divisionName,
              teams: sortedTeams
            };
          });
        };

        setStandings({
          al: processStandings(alData),
          nl: processStandings(nlData)
        });
      } catch (error) {
        console.error('Error fetching standings data:', error);
      }
    };

    fetchStandings();
  }, []);

  return (
    <div>
      <h2>American League Standings</h2>
      {standings.al.map((division, index) => (
        <div key={index}>
          <h3>{division.divisionName}</h3>
          <ul>
            {division.teams.map((team, idx) => (
              <li key={idx}>
                {team.name}: {team.wins}-{team.losses} ({(team.pct * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2>National League Standings</h2>
      {standings.nl.map((division, index) => (
        <div key={index}>
          <h3>{division.divisionName}</h3>
          <ul>
            {division.teams.map((team, idx) => (
              <li key={idx}>
                {team.name}: {team.wins}-{team.losses} ({(team.pct * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
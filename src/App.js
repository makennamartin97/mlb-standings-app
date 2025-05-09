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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">MLB Standings</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* American League */}
          <div>
            <h2 className="text-3xl font-semibold text-blue-500 mb-4">American League Standings</h2>
            {standings.al.map((division, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">{division.divisionName}</h3>
                <ul className="space-y-2 mt-4">
                  {division.teams.map((team, idx) => (
                    <li key={idx} className="flex justify-between text-gray-700">
                      <span>{team.name}</span>
                      <span>{team.wins}-{team.losses} ({(team.pct * 100).toFixed(2)}%)</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* National League */}
          <div>
            <h2 className="text-3xl font-semibold text-blue-500 mb-4">National League Standings</h2>
            {standings.nl.map((division, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">{division.divisionName}</h3>
                <ul className="space-y-2 mt-4">
                  {division.teams.map((team, idx) => (
                    <li key={idx} className="flex justify-between text-gray-700">
                      <span>{team.name}</span>
                      <span>{team.wins}-{team.losses} ({(team.pct * 100).toFixed(2)}%)</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;


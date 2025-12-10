import { api } from "@/services/api";
import type { Game } from "@/types/game";
import { useState, useEffect } from "react";

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    api.get("/games")
      .then(games => setGames(games))
      .catch(e => alert(e));
  }, []);

  return <div>
    <h2>Games</h2>
    <ul>
      {games.map(g => <li key={g.game_id}>{g.title}</li>)}
    </ul>
  </div>;
}

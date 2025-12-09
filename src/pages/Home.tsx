import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Game } from "@/types/game";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    api.get("/games")
      .then(games => setGames(games))
      .catch(e => alert(e));
  }, []);

  return <ul>
    {games.map(g => <li key={g.game_id}>{g.title}</li>)}
  </ul>;
}

import { useAuth } from "@/auth";
import GameCard from "@/components/games/GameCard";
import AlertModal from "@/components/ui/AlertModal";
import { api } from "@/services/api";
import type { Game } from "@/types/game";
import { useState, useEffect } from "react";

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    api.get("/games")
      .then(games => setGames(games))
      .catch(e => {
        setErrorMessage(e?.message || "Failed to load games");
        setShowError(true);
      });
  }, []);

  return <div>
    <h2>Games</h2>
    <ul role="list" className="game-card-list">
      {games.map(g =>
        <li key={g.game_id}>
          <GameCard game={g} owned={user?.game_ids.includes(g.game_id)} />
        </li>
      )}
    </ul>
    <AlertModal
      open={showError}
      title="Error"
      message={errorMessage}
      onClose={() => setShowError(false)}
      variant="error"
    />
  </div>;
}

import Button from "./Button";
import "./GameCard.css";
import type { Game } from "@/types/game";

export default function GameCard({ game }: { game: Game }) {
    return <div className="card game-card">
        <h3 className="game-title">{game.title}</h3>
        <div className="game-details">
            |{game.genres.map(g => <span className="game-genre">{g}|</span>)}
            <span className="game-rating">
                rated {game.average_rating}/10 ({game.review_count} votes)
            </span>
        </div>
        <p className="game-description">{game.description}</p>
        <div className="game-price">{game.price}</div>
        <Button className="game-buy-cta">buy now</Button>
        {/* <div className="game-owned-info">already owned</div> */}
    </div>
}

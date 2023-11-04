import GameBase from '../games/GameBase';
import { GameData } from '../games';
import { WordData } from '../../types';


function GamePage<T extends WordData>({ game }: { game: GameData<T> }) {
  return (
    <GameBase
      category={game.category}
      title={game.name}
      formatter={game.formatter}
      gameComponent={game.component}
      numQuestions={game.questions ?? 10}
      pickWord={game.pickWord}
    />
  );
}

export default GamePage;

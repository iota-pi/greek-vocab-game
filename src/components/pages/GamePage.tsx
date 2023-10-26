import GameBase from '../games/GameBase';
import { GameData } from '../games';
import { BaseData } from '../../types';


function GamePage<T extends BaseData>({ game }: { game: GameData<T> }) {
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

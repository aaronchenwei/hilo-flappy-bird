import * as React from 'react';

import Game from './game/Game';

class App extends React.Component {
  public game: Game;
  public gameContainer: any;

  private refHandler = {
    gameContainer: ref => {
      this.gameContainer = ref;
    },
  };

  public componentDidMount() {
    this.game = new Game({ container: this.gameContainer });
  }

  public render() {
    return <div ref={this.refHandler.gameContainer} />;
  }
}

export default App;

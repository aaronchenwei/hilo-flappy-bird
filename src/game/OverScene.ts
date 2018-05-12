import * as Hilo from 'hilojs';
import merge from 'lodash-es/merge';

export default class OverScene extends Hilo.Container {
  constructor(properties: any) {
    super(properties);
    merge(this, properties);
    this.init(properties);
  }

  public init(properties: any) {
    const board = new Hilo.Bitmap({
      id: 'board',
      image: properties.image,
      rect: [0, 0, 590, 298],
    } as any);

    const gameover = new Hilo.Bitmap({
      id: 'gameover',
      image: properties.image,
      rect: [0, 298, 508, 158],
    } as any);

    const startBtn = new Hilo.Bitmap({
      id: 'start',
      image: properties.image,
      rect: [590, 0, 290, 176],
    } as any);

    const gradeBtn = new Hilo.Bitmap({
      id: 'grade',
      image: properties.image,
      rect: [590, 176, 290, 176],
    } as any);

    const scoreLabel = new Hilo.BitmapText({
      glyphs: properties.numberGlyphs,
      id: 'score',
      letterSpacing: 4,
      scaleX: 0.5,
      scaleY: 0.5,
      text: 0,
    });

    const bestLabel = new Hilo.BitmapText({
      glyphs: properties.numberGlyphs,
      id: 'best',
      letterSpacing: 4,
      scaleX: 0.5,
      scaleY: 0.5,
      text: 0,
    });

    const whiteMask = new Hilo.View({
      alpha: 0.0,
      background: '#fff',
      height: this.height,
      id: 'mask',
      width: this.width,
    });

    board.x = (this.width - board.width) >> 1;
    board.y = (this.height - board.height) >> 1;
    gameover.x = (this.width - gameover.width) >> 1;
    gameover.y = board.y - gameover.height - 20;
    startBtn.x = board.x - 5;
    startBtn.y = (board.y + board.height + 20) >> 0;
    gradeBtn.x = (startBtn.x + startBtn.width + 20) >> 0;
    gradeBtn.y = startBtn.y;
    scoreLabel.x = (board.x + board.width - 140) >> 0;
    scoreLabel.y = board.y + 90;
    bestLabel.x = scoreLabel.x;
    bestLabel.y = scoreLabel.y + 105;

    this.addChild(gameover);
    this.addChild(board);
    this.addChild(startBtn);
    this.addChild(gradeBtn);
    this.addChild(scoreLabel);
    this.addChild(bestLabel);
    this.addChild(whiteMask);
  }

  public show(score: string, bestScore: string) {
    this.visible = true;
    (this.getChildById('score') as Hilo.BitmapText).setText(score);
    (this.getChildById('best') as Hilo.BitmapText).setText(bestScore);
    (this.getChildById('mask') as Hilo.View).alpha = 1;

    Hilo.Tween.to(
      this.getChildById('gameover'),
      { alpha: 1 },
      { duration: 100 }
    );
    Hilo.Tween.to(
      this.getChildById('board'),
      { alpha: 1, y: this.getChildById('board').y - 150 },
      { duration: 200, delay: 200 }
    );
    Hilo.Tween.to(
      this.getChildById('score'),
      { alpha: 1, y: this.getChildById('score').y - 150 },
      { duration: 200, delay: 200 }
    );
    Hilo.Tween.to(
      this.getChildById('best'),
      { alpha: 1, y: this.getChildById('best').y - 150 },
      { duration: 200, delay: 200 }
    );
    Hilo.Tween.to(
      this.getChildById('start'),
      { alpha: 1 },
      { duration: 100, delay: 600 }
    );
    Hilo.Tween.to(
      this.getChildById('grade'),
      { alpha: 1 },
      { duration: 100, delay: 600 }
    );
    Hilo.Tween.to(this.getChildById('mask'), { alpha: 0 }, { duration: 400 });
  }

  public hide() {
    this.visible = false;
    this.getChildById('gameover').alpha = 0;
    this.getChildById('board').alpha = 0;
    this.getChildById('score').alpha = 0;
    this.getChildById('best').alpha = 0;
    this.getChildById('start').alpha = 0;
    this.getChildById('grade').alpha = 0;
    this.getChildById('board').y += 150;
    this.getChildById('score').y += 150;
    this.getChildById('best').y += 150;
  }
}

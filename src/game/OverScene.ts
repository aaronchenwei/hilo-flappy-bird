import * as Hilo from 'hilojs';
import merge from 'lodash-es/merge';

export default class OverScene extends Hilo.Container {
  constructor(properties?: object | undefined) {
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
      height: this.height,
      id: 'mask',
      width: this.width,
    });
    whiteMask.background = '#fff' as any;

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

  public show(score: number, bestScore: number) {
    this.visible = true;
    this.getChildById('score').text = String(score);
    this.getChildById('best').text = String(bestScore);
    this.getChildById('mask').alpha = 1.0;

    Hilo.Tween.from(this.getChildById('gameover'), { alpha: 0 }, { time: 100 });
    Hilo.Tween.from(
      this.getChildById('board'),
      { alpha: 0, y: this.getChildById('board').y + 150 },
      { time: 200, delay: 200 }
    );
    Hilo.Tween.from(
      this.getChildById('score'),
      { alpha: 0, y: this.getChildById('score').y + 150 },
      { time: 200, delay: 200 }
    );
    Hilo.Tween.from(
      this.getChildById('best'),
      { alpha: 0, y: this.getChildById('best').y + 150 },
      { time: 200, delay: 200 }
    );
    Hilo.Tween.from(
      this.getChildById('start'),
      { alpha: 0 },
      { time: 100, delay: 600 }
    );
    Hilo.Tween.from(
      this.getChildById('grade'),
      { alpha: 0 },
      { time: 100, delay: 600 }
    );
    Hilo.Tween.to(this.getChildById('mask'), { alpha: 0 }, { time: 400 });
  }
}

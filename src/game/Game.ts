import * as Hilo from 'hilojs';

import Asset from './Asset';
import Bird from './Bird';
import Holdbacks from './Holdbacks';
import OverScene from './OverScene';
import ReadyScene from './ReadyScene';

export default class Game {
  public properties: any;

  public width: number = 0;
  public height: number = 0;
  public scale: number = 1.0;

  public asset: Asset;
  public stage: Hilo.Stage;
  public ticker: Hilo.Ticker;
  public state: string | null = null;
  public score: number;

  public ground: Hilo.Bitmap;
  public currentScore: Hilo.BitmapText;
  public bird: Bird;
  public holdbacks: Holdbacks;
  public gameReadyScene: ReadyScene;
  public gameOverScene: OverScene;

  constructor(properties: Hilo.IStageProperties) {
    this.properties = properties;
    this.init();
  }

  public init() {
    this.asset = new Asset();
    this.asset.on('complete', (e: any) => {
      this.asset.off('complete');
      this.initStage();
    });
    this.asset.load();
  }

  public initStage() {
    this.width = 720;
    this.height = 1280;
    this.scale = 0.5;

    // 舞台
    this.stage = new Hilo.Stage({
      container: this.properties.container,
      height: this.height,
      renderType: 'webgl',
      scaleX: this.scale,
      scaleY: this.scale,
      width: this.width,
    });
    // document.body.appendChild(this.stage.canvas);

    // 启动计时器
    this.ticker = new Hilo.Ticker(60);
    this.ticker.addTick(Hilo.Tween);
    this.ticker.addTick(this.stage);
    this.ticker.start();

    // 绑定交互事件
    this.stage.enableDOMEvent(
      (Hilo.event as Hilo.EventType).POINTER_START,
      true
    );
    this.stage.on(
      (Hilo.event as Hilo.EventType).POINTER_START,
      this.onUserInput.bind(this)
    );

    // Space键控制
    document.addEventListener('keydown', e => {
      if (e.keyCode === 32) {
        this.onUserInput(e);
      }
    });

    // 舞台更新
    this.stage.onUpdate = this.onUpdate.bind(this);

    // 初始化
    this.initBackground();
    this.initScenes();
    this.initHoldbacks();
    this.initBird();
    this.initCurrentScore();

    // 准备游戏
    this.gameReady();
  }

  public initBackground() {
    // 背景
    const bgWidth = this.width * this.scale;
    const bgHeight = this.height * this.scale;

    this.properties.container.insertBefore(
      Hilo.createElement('div', {
        id: 'bg',
        style: {
          background: 'url(images/bg.png) no-repeat',
          backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
          height: bgHeight + 'px',
          position: 'absolute',
          width: bgWidth + 'px',
        },
      }),
      this.stage.canvas
    );

    // 地面
    this.ground = new Hilo.Bitmap({
      id: 'ground',
      image: this.asset.ground,
    } as any);
    this.ground.addTo(this.stage);

    // 设置地面的y轴坐标
    this.ground.y = this.height - this.ground.height;

    // 移动地面
    Hilo.Tween.to(this.ground, { x: -60 }, { time: 300, loop: true });
  }

  public initCurrentScore() {
    // 当前分数
    this.currentScore = new Hilo.BitmapText({
      glyphs: this.asset.numberGlyphs,
      id: 'score',
      text: 0,
    });
    this.currentScore.addTo(this.stage);

    // 设置当前分数的位置
    this.currentScore.x = (this.width - this.currentScore.width) >> 1;
    this.currentScore.y = 180;
  }

  public initBird() {
    this.bird = new Bird({
      atlas: this.asset.birdAtlas,
      groundY: this.ground.y - 12,
      id: 'bird',
      startX: 100,
      startY: this.height >> 1,
    });
    this.bird.addTo(this.stage, this.ground.depth - 1);
  }

  public initHoldbacks() {
    this.holdbacks = new Holdbacks({
      groundY: this.ground.y,
      height: this.height,
      id: 'holdbacks',
      image: this.asset.holdback,
      startX: this.width * 2,
    });
    this.holdbacks.addTo(this.stage, this.ground.depth - 1);
  }

  public initScenes() {
    // 准备场景
    this.gameReadyScene = new ReadyScene({
      height: this.height,
      id: 'readyScene',
      image: this.asset.ready,
      width: this.width,
    });
    this.gameReadyScene.addTo(this.stage);

    // 结束场景
    this.gameOverScene = new OverScene({
      height: this.height,
      image: this.asset.over,
      numberGlyphs: this.asset.numberGlyphs,
      visible: false,
      width: this.width,
    });
    this.gameOverScene.addTo(this.stage);

    // 绑定开始按钮事件
    this.gameOverScene
      .getChildById('start')
      .on((Hilo.event as Hilo.EventType).POINTER_START, (e: any) => {
        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
        this.gameReady();
      });
  }

  public onUserInput(e: any) {
    if (this.state !== 'over') {
      // 启动游戏场景
      if (this.state !== 'playing') {
        this.gameStart();
      }
      // 控制小鸟往上飞
      this.bird.startFly();
    }
  }

  public onUpdate(delta: any) {
    if (this.state === 'ready') {
      return;
    }

    if (this.bird.isDead) {
      this.gameOver();
    } else {
      this.currentScore.setText(String(this.calcScore()));
      // 碰撞检测
      if (this.holdbacks.checkCollision(this.bird)) {
        this.gameOver();
      }
    }
  }

  public gameReady() {
    this.gameOverScene.hide();
    this.state = 'ready';
    this.score = 0;
    this.currentScore.visible = true;
    this.currentScore.setText(String(this.score));
    this.gameReadyScene.visible = true;
    this.holdbacks.reset();
    this.bird.getReady();
  }

  public gameStart() {
    this.state = 'playing';
    this.gameReadyScene.visible = false;
    this.holdbacks.startMove();
  }

  public gameOver() {
    if (this.state !== 'over') {
      // 设置当前状态为结束over
      this.state = 'over';
      // 停止障碍的移动
      this.holdbacks.stopMove();
      // 小鸟跳转到第一帧并暂停
      this.bird.goto(0 as any, true);
      // 隐藏屏幕中间显示的分数
      this.currentScore.visible = false;
      // 显示结束场景
      this.gameOverScene.show(
        String(this.calcScore()),
        String(this.saveBestScore())
      );
    }
  }

  public calcScore() {
    const count = this.holdbacks.calcPassThrough(this.bird.x);
    this.score = count;
    return count;
  }

  public saveBestScore() {
    const score = this.score;
    let best = 0;

    if (Hilo.browser.supportStorage) {
      const localBest = localStorage.getItem('hilo-flappy-best-score');
      best = localBest !== null ? parseInt(localBest, 10) : 0;
    }

    if (score > best) {
      best = score;
      localStorage.setItem('hilo-flappy-best-score', String(score));
    }
    return best;
  }
}

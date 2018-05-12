import * as Hilo from 'hilojs';
import merge from 'lodash-es/merge';

export default class Bird extends Hilo.Sprite {
  public startX: number = 0; // 小鸟的起始x坐标
  public startY: number = 0; // 小鸟的起始y坐标
  public groundY: number = 0; // 地面的坐标
  public gravity: number = 0; // 重力加速度
  public flyHeight: number = 0; // 小鸟每次往上飞的高度
  public initVelocity: number = 0; // 小鸟往上飞的初速度

  public isDead: boolean = true; // 小鸟是否已死亡
  public isUp: boolean = false; // 小鸟是在往上飞阶段，还是下落阶段
  public flyStartY: number = 0; // 小鸟往上飞的起始y轴坐标
  public flyStartTime: number = 0; // 小鸟飞行起始时间

  public tween: any[] | Hilo.Tween;

  constructor(properties: any) {
    super(properties);
    merge(this, properties);

    this.addFrame(properties.atlas.getSprite('bird'));
    this.interval = 6;
    this.pivotX = 43;
    this.pivotY = 30;

    this.gravity = 10 / 1000 * 0.3;
    this.flyHeight = 80;
    this.initVelocity = Math.sqrt(2 * this.flyHeight * this.gravity);
  }

  public getReady() {
    // 设置起始坐标
    this.x = this.startX;
    this.y = this.startY;

    this.rotation = 0;
    this.interval = 6;
    this.play();
    this.tween = Hilo.Tween.to(
      this,
      { y: this.y + 10, rotation: -8 },
      { duration: 400, reverse: true, loop: true }
    );
  }

  public startFly() {
    this.isDead = false;
    this.interval = 3;
    this.flyStartY = this.y;
    this.flyStartTime = +new Date();

    if (this.tween && this.tween instanceof Hilo.Tween) {
      this.tween.stop();
    }
  }

  public onUpdate = () => {
    if (this.isDead) {
      return;
    }

    // 飞行时间
    const time = +new Date() - this.flyStartTime;
    // 飞行距离
    const distance =
      this.initVelocity * time - 0.5 * this.gravity * time * time;
    // y轴坐标
    const y = this.flyStartY - distance;

    if (y <= this.groundY) {
      // 小鸟未落地
      this.y = y;
      if (distance > 0 && !this.isUp) {
        // 往上飞时，角度上仰20度
        this.tween = Hilo.Tween.to(this, { rotation: -20 }, { duration: 200 });
        this.isUp = true;
      } else if (distance < 0 && this.isUp) {
        // 往下跌落时，角度往下90度
        this.tween = Hilo.Tween.to(
          this,
          { rotation: 90 },
          { duration: this.groundY - this.y }
        );
        this.isUp = false;
      }
    } else {
      // 小鸟已经落地，即死亡
      this.y = this.groundY;
      this.isDead = true;
    }
  };
}

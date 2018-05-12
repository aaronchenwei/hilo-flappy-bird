import * as Hilo from 'hilojs';
import merge from 'lodash-es/merge';

export default class ReadyScene extends Hilo.Container {
  constructor(properties: any) {
    super(properties);
    merge(this, properties);
    this.init(properties);
  }

  public init(properties: any) {
    // 准备Get Ready!
    const getready = new Hilo.Bitmap({
      image: properties.image,
      rect: [0, 0, 508, 158],
    });

    // 开始提示tap
    const tap = new Hilo.Bitmap({
      image: properties.image,
      rect: [0, 158, 286, 246],
    });

    // 确定getready和tap的位置
    tap.x = (this.width - tap.width) >> 1;
    tap.y = (this.height - tap.height + 40) >> 1;
    getready.x = (this.width - getready.width) >> 1;
    getready.y = (tap.y - getready.height) >> 0;

    this.addChild(tap);
    this.addChild(getready);
  }
}

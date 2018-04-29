import * as Hilo from 'hilojs';
import EventMixin from 'hilojs/event/EventMixin';
import mixin from 'lodash-es/mixin';

export default class Asset implements Hilo.EventMixin {
  public queue: Hilo.LoadQueue;
  public bg: object;
  public ground: any;
  public ready: any;
  public over: any;
  public numberGlyphs: any;
  public birdAtlas: any;
  public holdback: any;

  public fire: (type: string, detail: object) => boolean;
  public off: (type: string, listener?: any | undefined) => object;
  public on: (
    type: string,
    listener: any,
    once?: boolean | undefined
  ) => object;

  constructor() {
    mixin(this, EventMixin);
  }

  public load() {
    const resources = [
      { id: 'bg', src: 'images/bg.png' },
      { id: 'ground', src: 'images/ground.png' },
      { id: 'ready', src: 'images/ready.png' },
      { id: 'over', src: 'images/over.png' },
      { id: 'number', src: 'images/number.png' },
      { id: 'bird', src: 'images/bird.png' },
      { id: 'holdback', src: 'images/holdback.png' },
    ];

    this.queue = new Hilo.LoadQueue();
    this.queue.add(resources as Hilo.ILoadSource[]);
    this.queue.on('complete', this.onComplete.bind(this));
    this.queue.start();
  }

  public onComplete(e) {
    this.bg = this.queue.getContent('bg');
    this.ground = this.queue.getContent('ground');
    this.ready = this.queue.getContent('ready');
    this.over = this.queue.getContent('over');
    this.holdback = this.queue.getContent('holdback');

    this.birdAtlas = new Hilo.TextureAtlas({
      frames: [[0, 120, 86, 60], [0, 60, 86, 60], [0, 0, 86, 60]],
      image: this.queue.getContent('bird'),
      sprites: {
        bird: [0, 1, 2],
      },
    });

    const numberImg = this.queue.getContent('number');
    this.numberGlyphs = {
      0: { image: numberImg, rect: [0, 0, 60, 91] },
      1: { image: numberImg, rect: [61, 0, 60, 91] },
      2: { image: numberImg, rect: [121, 0, 60, 91] },
      3: { image: numberImg, rect: [191, 0, 60, 91] },
      4: { image: numberImg, rect: [261, 0, 60, 91] },
      5: { image: numberImg, rect: [331, 0, 60, 91] },
      6: { image: numberImg, rect: [401, 0, 60, 91] },
      7: { image: numberImg, rect: [471, 0, 60, 91] },
      8: { image: numberImg, rect: [541, 0, 60, 91] },
      9: { image: numberImg, rect: [611, 0, 60, 91] },
    };

    this.queue.off('complete');
    this.fire('complete', {});
  }
}

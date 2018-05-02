import * as Hilo from 'hilojs';
import EventMixin from 'hilojs/event/EventMixin';
import mixin from 'lodash-es/mixin';

export default class Asset implements Hilo.EventMixin {
  public bg: object;
  public ground: object;
  public ready: object;
  public over: object;
  public numberGlyphs;
  public holdback: object;
  public birdAtlas: Hilo.TextureAtlas;
  public queue: Hilo.LoadQueue;

  public on: (
    type: string,
    listener: any,
    once?: boolean | undefined
  ) => object;
  public off: (type: string, listener?: any | undefined) => object;
  public fire: (type: string, detail: object) => boolean;

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

  public onComplete() {
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

    const numberImage = this.queue.getContent('number');
    this.numberGlyphs = {
      0: { image: numberImage, rect: [0, 0, 60, 91] },
      1: { image: numberImage, rect: [61, 0, 60, 91] },
      2: { image: numberImage, rect: [121, 0, 60, 91] },
      3: { image: numberImage, rect: [191, 0, 60, 91] },
      4: { image: numberImage, rect: [261, 0, 60, 91] },
      5: { image: numberImage, rect: [331, 0, 60, 91] },
      6: { image: numberImage, rect: [401, 0, 60, 91] },
      7: { image: numberImage, rect: [471, 0, 60, 91] },
      8: { image: numberImage, rect: [541, 0, 60, 91] },
      9: { image: numberImage, rect: [611, 0, 60, 91] },
    };

    this.queue.off('complete');
    this.fire('complete', {});
  }
}

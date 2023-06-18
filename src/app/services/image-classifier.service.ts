import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
// const mobilenet = require('@tensorflow-models/mobilenet');

@Injectable({
  providedIn: 'root',
})
export class ImageClassifierService {
  model: mobilenet.MobileNet | undefined;

  constructor() {
    tf.setBackend('webgl');
    this.loadModel();
  }

  async loadModel(): Promise<void> {
    this.model = await mobilenet.load();
  }

  async classifyImage(
    imageElement:
      | HTMLImageElement
      | ImageData
      | HTMLCanvasElement
      | HTMLVideoElement
  ): Promise<
    Array<{
      className: string;
      probability: number;
    }>
  > {
    if (this.model) {
      return await this.model.classify(imageElement);
    } else {
      throw new Error('Model not loaded');
    }
  }
}

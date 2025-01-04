import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Injectable({
  providedIn: 'root',
})
export class ImageClassifierService {
  public model: mobilenet.MobileNet | null = null;
  private modelLoadPromise?: Promise<void>;

  async initModel(): Promise<void> {
    tf.setBackend('webgl');
    await this.loadModel();
  }

  private async loadModel(): Promise<void> {
    this.model = await mobilenet.load();
    console.log('Mobilenet geladen');
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
    if (!this.model) {
      await this.modelLoadPromise;
    }

    if (this.model) {
      return this.model.classify(imageElement);
    } else {
      throw new Error('Model not loaded');
    }
  }
}

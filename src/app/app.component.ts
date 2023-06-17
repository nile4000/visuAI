import { Component } from '@angular/core';
import {createModel, compileModel, trainModel, predict} from '../app/model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  images: any[] = [];
  model: any;
  title = 'visuAI';

  constructor() {
    this.model = createModel();
    compileModel(this.model);
  }

  handleFile(event: any) {
    // Convert file to image and preprocess for your model
    for (let file of event.target.files) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(e.target.result);
        // Here you would also preprocess and add the image to your training data
      }
      reader.readAsDataURL(file);
    }
  }

  async train() {
    // Here you should convert your training data to tensors
    // and then call trainModel with your training data
    // For example:
    // const xs = convertImagesToTensors(this.images);
    // const ys = createLabelsForImages(this.images);
    // await trainModel(this.model, xs, ys);
  }

  predict() {
    // Here you should use your model to predict the class of new images
    // For example:
    // const inputTensor = convertImageToTensor(newImage);
    // const prediction = predict(this.model, inputTensor);
    // console.log(prediction);
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageClassifierService } from 'src/app/services/image-classifier.service';


@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss'],
})
export class UploadImagesComponent implements OnInit {
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];
  previews: string[] = [];
  imageInfos?: Observable<any>;
  predictions: { className: string; probability: number; }[] | undefined;

  constructor(
    private imageClassifierService: ImageClassifierService
  ) {}

  ngOnInit(): void {
  }

  async selectFiles(event: any): Promise<void> {
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          this.previews.push(e.target.result);
          const img = new Image();
          img.src = e.target.result;
          await img.decode(); // Wait for image to load
          this.predictClass(img);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  async predictClass(img: any) {
    if (this.imageClassifierService.model) {
      this.predictions = await this.imageClassifierService.classifyImage(img);
    } else {
      console.error('Model not loaded');
    }
  }
}

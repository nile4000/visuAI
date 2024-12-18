import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { UploadImagesComponent } from './components/upload-images/upload-images.component';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploadImagesComponent, MatCard, MatCardContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'visuAI';
  currentYear: number = new Date().getFullYear();
}

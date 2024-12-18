import { PercentPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { ImageClassifierService } from 'src/app/services/image-classifier.service';

interface Prediction {
  className: string;
  probability: number;
}

@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [
    MatToolbar,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    PercentPipe,
  ],
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss'],
})
export class UploadImagesComponent {
  // Signals für den Zustand
  selectedFiles = signal<FileList | undefined>(undefined);
  selectedFileNames = signal<string[]>([]);
  previews = signal<string[]>([]);
  predictions = signal<Prediction[] | undefined>(undefined);

  imageInfos?: Observable<any | undefined>;

  private imageClassifierService = inject(ImageClassifierService);

  /**
   * Wird aufgerufen, wenn eine oder mehrere Dateien über das Input ausgewählt werden.
   * Liest die Dateien ein, erstellt Vorschaubilder und führt Klassifizierungen durch.
   */
  async selectFiles(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      return;
    }

    // Dateien in ein Array umwandeln
    const fileArray = Array.from(files);

    this.selectedFiles.set(files);
    this.selectedFileNames.set([]);
    this.previews.set([]);
    this.predictions.set(undefined);

    const imagePromises: Promise<HTMLImageElement>[] = [];

    for (const file of fileArray) {
      // Namen hinzufügen
      this.selectedFileNames.update((names) => [...names, file.name]);
      // Bild laden und Promise speichern
      imagePromises.push(this.loadImage(file));
    }

    try {
      // Warten bis alle Bilder geladen sind
      const images = await Promise.all(imagePromises);

      const predictionResults: Prediction[] = [];
      for (const img of images) {
        const preds = await this.predictClass(img);
        if (preds) {
          predictionResults.push(...preds);
        }
      }

      this.predictions.set(predictionResults);
    } catch (error) {
      console.error('Fehler beim Verarbeiten der Bilder:', error);
    }
  }

  /**
   * Lädt eine Bilddatei ein, erstellt ein Vorschaubild (DataURL) und gibt das fertige HTMLImageElement zurück.
   */
  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          // Vorschau hinzufügen
          this.previews.update((previews) => [...previews, result]);

          const img = new Image();
          img.src = result;
          img
            .decode()
            .then(() => resolve(img))
            .catch((err) =>
              reject(`Fehler beim Dekodieren des Bildes: ${err}`)
            );
        } else {
          reject('Fehler: Reader result ist kein string.');
        }
      };

      reader.onerror = (e) => {
        reject(`Fehler beim Lesen der Datei ${file.name}: ${e}`);
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Klassifiziert ein bereits geladenes HTMLImageElement über den ImageClassifierService.
   * Gibt eine Liste von Vorhersagen (Predictions) zurück.
   */
  private async predictClass(
    img: HTMLImageElement
  ): Promise<Prediction[] | undefined> {
    if (!this.imageClassifierService.model) {
      console.error(
        'Das Modell ist noch nicht geladen. Bitte versuchen Sie es später erneut.'
      );
      return undefined;
    }

    try {
      return await this.imageClassifierService.classifyImage(img);
    } catch (error) {
      console.error('Fehler bei der Klassifizierung:', error);
      return undefined;
    }
  }
}

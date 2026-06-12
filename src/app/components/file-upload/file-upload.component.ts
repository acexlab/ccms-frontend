/*
 * File: file-upload.component.ts
 * Description: Standalone file uploader component with client-side type and size validation.
 * To Implement: Provide robust error alerts.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="upload-wrapper">
      <label class="upload-label">{{ label }}</label>
      
      <div class="upload-controls">
        <input 
          type="file" 
          #fileInput 
          style="display: none" 
          [accept]="acceptedTypes" 
          (change)="onFileChange($event)"
        />
        
        <button 
          type="button" 
          mat-stroked-button 
          color="primary" 
          (click)="fileInput.click()"
        >
          <mat-icon>upload</mat-icon>
          Choose File
        </button>

        <span class="selected-name" *ngIf="selectedFile">
          {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024) | number:'1.1-2' }} MB)
        </span>
        <span class="placeholder-name" *ngIf="!selectedFile">
          No file selected
        </span>
      </div>

      <div class="error-msg" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .upload-wrapper {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }
    .upload-label {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .upload-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .selected-name {
      font-size: 13px;
      color: #2e7d32;
      font-weight: 500;
    }
    .placeholder-name {
      font-size: 13px;
      color: #70757a;
      font-style: italic;
    }
    .error-msg {
      color: #f44336;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }
  `]
})
export class FileUploadComponent {
  @Input() label: string = 'Upload File';
  @Input() acceptedTypes: string = '.pdf,.jpg,.jpeg,.png';
  @Input() maxSizeMb: number = 5;

  @Output() fileSelected = new EventEmitter<File>();

  selectedFile: File | null = null;
  errorMessage: string | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.errorMessage = null;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate File Size
      const fileSizeMb = file.size / 1024 / 1024;
      if (fileSizeMb > this.maxSizeMb) {
        this.errorMessage = `File exceeds max size of ${this.maxSizeMb} MB.`;
        this.selectedFile = null;
        return;
      }

      // Validate File Type
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedList = this.acceptedTypes.split(',').map(ext => ext.trim().toLowerCase());
      
      if (!acceptedList.includes(extension)) {
        this.errorMessage = `Invalid file type. Allowed: ${this.acceptedTypes}`;
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.fileSelected.emit(file);
    }
  }
}

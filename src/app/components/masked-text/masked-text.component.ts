/*
 * File: masked-text.component.ts
 * Description: Component rendering pre-masked database strings with a security tooltip indicator.
 * To Implement: Style layout inline.
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-masked-text',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <span class="masked-container" matTooltip="Sensitive data is masked for security">
      <span class="masked-val">{{ value }}</span>
      <mat-icon class="lock-icon">lock</mat-icon>
    </span>
  `,
  styles: [`
    .masked-container {
      display: inline-flex;
      align-items: center;
      background-color: #f1f3f4;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: help;
      border: 1px dashed #dadce0;
    }
    .masked-val {
      font-family: monospace;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .lock-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      margin-left: 6px;
      color: #70757a;
    }
  `]
})
export class MaskedTextComponent {
  @Input() value: string = '';
}
// Note: Obfuscation masking happens on the API side before data transfer occurs.

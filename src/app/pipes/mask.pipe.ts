/*
 * File: mask.pipe.ts
 * Description: Standalone template pipe masking sensitive identifiers defensively.
 * To Implement: Keep in sync with backend DataMaskingHelper logic.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask',
  standalone: true
})
export class MaskPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    if (value.length <= 4) {
      return '*'.repeat(value.length);
    }
    return '****' + value.slice(-4);
  }
}

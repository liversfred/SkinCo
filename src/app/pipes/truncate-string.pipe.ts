import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateString',
})
export class TruncateStringPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...See More' : value;
  }
}
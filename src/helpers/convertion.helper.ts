import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertionHelper {
  convertDataType(value: string | number): number {
    if (typeof value === 'string') {
      return Number(value);
    } else if (typeof value === 'number') {
      return value;
    }
  }
}

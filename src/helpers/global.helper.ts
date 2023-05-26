import { Injectable } from '@nestjs/common';
import '../../config/env';

@Injectable()
export class GlobalHelper {
  formatDateTime(param: Date) {
    const day = String(param.getDate()).padStart(2, '0');
    const month = String(param.getMonth() + 1).padStart(2, '0');
    const year = String(param.getFullYear());
    const hours = String(param.getHours()).padStart(2, '0');
    const minutes = String(param.getMinutes()).padStart(2, '0');
    const seconds = String(param.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  convertToNumber(value: string | number): number {
    if (typeof value === 'string') {
      return Number(value);
    } else if (typeof value === 'number') {
      return value;
    }
  }

  generatePagination(
    serviceName: string,
    page: number,
    limit: number,
    totalPages: number,
    totalItems: number,
  ): object {
    return {
      first: `${process.env.BASE_URL}/${serviceName}?limit=${limit}&page=1`,
      previous:
        page > 1
          ? `${process.env.BASE_URL}/${serviceName}?limit=${limit}&page=${
              page - 1
            }`
          : null,
      current: `${process.env.BASE_URL}/${serviceName}?limit=${limit}&page=${page}`,
      next:
        page < totalPages
          ? `${process.env.BASE_URL}/${serviceName}?limit=${limit}&page=${
              page + 1
            }`
          : null,
      last: `${process.env.BASE_URL}/${serviceName}?limit=${limit}&page=${totalPages}`,
      itemsPerPage: limit,
      totalItems,
      currentPage: page,
      totalPages,
    };
  }
}

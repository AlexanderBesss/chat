import { PaginationDto } from './pagination.dto';

export interface ResponseList<T> {
  data: T[];
  pagination: PaginationDto;
}

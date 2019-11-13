export abstract class PagedResultDto<T> {
  totalCount: number;
  items: T[];
}

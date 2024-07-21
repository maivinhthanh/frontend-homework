export interface FilterCriteria<T> {
  filters: {
    searchText?: string;
  } & T;
  paging: {
    page: number;
    pageSize: number;
  };
  sorts?: {
    descending: boolean;
    field: string;
  }[];
}

export interface ErrorCriteria {
  message: string;
  status: string;
}
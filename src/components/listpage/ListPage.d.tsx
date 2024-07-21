import { PropsWithChildren, ReactNode } from 'react';

export interface ListPageProp extends PropsWithChildren {
  typeList: ReactNode;
  filter: ReactNode;
  titleAddButton: string;
  actionAdd: () => void;
}
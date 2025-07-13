import { ITimestamp } from './common.type';

export type TCategory = {
  id: string;
  name: string;
};

export interface IProduct extends ITimestamp {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: TCategory['id'];
  images: string[];
  order?: number;
  createdBy?: string;
  imageUrl?: string;
}

export type TUpdateProduct = {
  data: Partial<
    Omit<IProduct, 'id' | 'images' | 'createdAt' | 'updatedAt' | 'createdBy'>
  >;
  keepImageUrls: string[];
  newImageFiles?: File[];
};

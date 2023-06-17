export class CreateProductDto {
  categoryIdId: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export class UpdateProductDto {
  categoryIdId?: number;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}

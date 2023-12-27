import { Injectable } from '@nestjs/common';
import DatabaseClient from '@/infra/persistance/DatabaseClient';
import { Product } from '@/domain/products/Product';
import IProductRepository, {
  FindProductOptions,
  SaveProductOptions,
  WrongRangeError,
} from '@/domain/products/IProductRepository';
import { ProductId } from '@/domain/products/ProductId';

@Injectable()
export default class ProductRepository implements IProductRepository {
  constructor(private readonly client: DatabaseClient) {}

  async findProducts({ pageOption, ids }: FindProductOptions) {
    const skip = pageOption
      ? (pageOption.page - 1) * pageOption.pageSize
      : undefined;
    const take = pageOption ? pageOption.pageSize : undefined;

    if (pageOption && (pageOption.page < 1 || pageOption.pageSize < 1)) {
      throw new WrongRangeError('Page and pageSize must be greater than 0');
    }

    const whereCondition =
      ids && ids.length > 0 ? { id: { in: ids.map((id) => id.key) } } : {};

    const productEntities = await this.client.product.findMany({
      skip, // skip과 take는 pageOption이 있을 때만 적용됩니다.
      take,
      where: whereCondition,
      orderBy: {
        registedAt: 'desc',
      },
    });

    const products = productEntities.map((entity) =>
      Product.create({
        id: new ProductId(entity.id),
        name: entity.name,
        price: entity.price,
        quantity: entity.quantity,
      }),
    );

    return products;
  }

  async save({ products }: SaveProductOptions) {
    if (!Array.isArray(products)) {
      products = [products];
    }

    for (const product of products) {
      const { id, name, price, quantity, registedAt } = product;

      await this.client.product.upsert({
        where: { id: id.key },
        update: {
          name,
          price,
          quantity,
          registedAt,
        },
        create: {
          id: id.key,
          name,
          price,
          quantity,
          registedAt,
        },
      });
    }

    return products;
  }
}

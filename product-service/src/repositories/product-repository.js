import { randomUUID } from 'crypto';
import { query, createTransaction } from '../services/db-client';

const selectProductsBaseQuery = `
    select id, count, price, title, description
    from products
             left join stocks s on products.id = s.product_id
`;
const insertProductQuery = `insert into products(id, title, price, description) values ($1, $2, $3, $4) returning *`;
const insertStockQuery = `insert into stocks(product_id, count) values ($1, $2) returning *`;

export const findProducts = () => {
  return query(selectProductsBaseQuery);
};

export const findProductById = async (productId) => {
  const product = await query(`${selectProductsBaseQuery} where id = $1`, [productId]);
  return product[0];
};

export const createProductWithStocks = async ({ title, price, description, count = 0 }) => {
  const transaction = await createTransaction();
  const uuid = randomUUID();

  try {
    await transaction.begin();
    const product = await transaction.query(insertProductQuery, [uuid, title, price || null, description || null]);
    const stock = await transaction.query(insertStockQuery, [uuid, count]);
    await transaction.commit();
    return { ...product[0], count: stock[0].count };
  } catch (e) {
    await transaction.rollback();
    throw e;
  } finally {
    transaction.release();
  }
}
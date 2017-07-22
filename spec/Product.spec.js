import Product from '../models/Product';

describe('Product', () => {
    it('sets up properties correctly', () => {
        const id = 'ult_small';
        const name = 'Unlimited 1GB';
        const price = 24.9;

        const Item = new Product({
            id,
            name,
            price
        });

        expect(Item.id).toBe(id);
        expect(Item.name).toBe(name);
        expect(Item.price).toBe(price);
    });
});

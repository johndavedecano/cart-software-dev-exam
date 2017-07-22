import PromoCode from '../models/PromoCode';

describe('PromoCode', () => {
    it('sets up properties correctly', () => {
        const id = 'FJHGBNK76';
        const discount = 10;
        const Promo = new PromoCode({
            id,
            discount
        });
        expect(Promo.id).toBe(id);
        expect(Promo.discount).toBe(discount);
    });
});

import PricingRule from '../models/PricingRule';
import { QUANTITY_DISCOUNT } from '../models/RuleTypes';

describe('PricingRule', () => {
    it('sets up properties correctly', () => {
        const productId = 'FJHGBNK76';
        const discountFor = 10;
        const discountGet = 5;

        const Rule = new PricingRule({
            productId,
            discountFor,
            discountGet,
            type: QUANTITY_DISCOUNT
        });

        expect(Rule.productId).toBe(productId);
        expect(Rule.discountFor).toBe(discountFor);
        expect(Rule.discountGet).toBe(discountGet);
        expect(Rule.type).toBe(QUANTITY_DISCOUNT);
    });
});

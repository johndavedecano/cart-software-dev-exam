import { Map } from 'immutable';
import PricingRule from '../models/PricingRule';
import PricingRules from '../models/PricingRules';
import { QUANITY_DISCOUNT } from '../models/RuleTypes';

const ERROR_MESSAGE = 'Invalid pricing rule given';

describe('PricingRules', () => {
    it('should be able to add items to pricing rules definitions', () => {
        const productId = 'FJHGBNK76';
        const discountFor = 10;

        const Rule = new PricingRule({
            productId,
            discountFor,
            type: QUANITY_DISCOUNT
        });

        const Rules = new PricingRules();

        Rules.addPricingRule(Rule);
        Rules.addPricingRule(Rule);

        expect(Rules.getItems().size).toBe(1);
        expect(Rules.getItems()).toBeInstanceOf(Map);
        expect(Rules.getItem(Rule.productId)).toBe(Rule);
        expect(() => Rules.getItem('notexisting')).toThrowError(ERROR_MESSAGE);
    });
});

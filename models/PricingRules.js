import { Map } from 'immutable';

export default class PricingRules {
    items = Map();

    addPricingRule(code) {
        this.items = this.items.set(code.productId, code);

        return this;
    }
    getItems() {
        return this.items;
    }
    getItem(productId) {
        const code = this.items.get(productId);

        if (!code) {
            throw new Error('Invalid pricing rule given');
        }

        return code;
    }
}

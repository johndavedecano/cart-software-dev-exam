import { Map } from 'immutable';

export default class Promos {
    items = Map();

    addPromoCode(code) {
        this.items = this.items.set(code.id, code);

        return this;
    }
    getItem(id) {
        const code = this.items.get(id);

        if (!code) {
            throw new Error('Invalid promo code given');
        }

        return code;
    }
    getItems() {
        return this.items;
    }
    isValid(id) {
        return this.items.has(id);
    }
}

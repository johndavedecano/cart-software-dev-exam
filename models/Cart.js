import { Map, List } from 'immutable';
import {
    QUANTITY_DISCOUNT,
    BULK_ORDER_DISCOUNT,
    ADDON_FREEBIES
} from './RuleTypes';

export default class Cart {
    products = Map();

    items = Map();

    promos = Map();

    rules = Map();

    addons = Map();

    total = 0;

    currentPromoCode = null;

    /**
     * @param {*} product 
     * @param {*} promoCode 
     */
    add(product, promoCode = null) {
        const items = this.items.get(product.id) || List();

        this.items = this.items.set(product.id, items.push(product.price));

        this.setPromoCode(promoCode);

        this.checkForAddon(product);

        this.products = this.products.set(product.id, product);

        return this.items;
    }

    /**
     * @param {*} product 
     */
    checkForAddon(product) {
        const rule = this.rules.get(product.id);

        if (rule && rule.type === ADDON_FREEBIES) {
            const addonProduct = this.addons.get(product.id);
            this.add(addonProduct);
        }

        return;
    }

    /**
     * @param {*} forProductId 
     * @param {*} product 
     */
    setAddon(forProductId, product) {
        this.addons = this.addons.set(forProductId, product);

        return this.addons;
    }

    /**
     * @param {*} prices 
     */
    getTotalPrices(prices) {
        if (prices.size === 0) {
            return 0;
        }

        if (prices.size === 1) {
            return prices.first();
        }

        return prices.size * prices.first();
    }

    /**
     * @param {*} promoCode 
     */
    setPromoCode(promoCode) {
        if (this.promos.has(promoCode)) {
            this.currentPromoCode = this.promos.get(promoCode);
        }
    }

    /**
     * @param {*} promos 
     */
    setPromos(promos) {
        this.promos = Map(promos);

        return this;
    }

    /**
     * @param {*} rules 
     */
    setPricingRules(rules) {
        this.rules = Map(rules);

        return this;
    }

    /**
     * Gets the grand total amount for all the items in the cart
     * Less all the discounts and promotions.
     * 
     * @return Number
     */
    getTotal() {
        this.total = this.setTotalAmount(this.items);

        return this.total;
    }

    /**
     * Gets the items. This is just raw uncalculated items.
     * 
     * @return Immutable.Map
     */
    getItems() {
        return this.items;
    }

    /**
     * Gets the order summary
     * 
     * @return Immutable.Map
     */
    getSummary() {
        let items = Map();

        this.items.map((prices, id) => {
            if (this.rules.has(id)) {
                const rule = this.rules.get(id);
                items = items.set(
                    id,
                    Map({
                        id,
                        name: this.products.getIn([id, 'name']),
                        quantity: prices.size,
                        amount: this.applyPricingRules(rule, prices)
                    })
                );
            } else {
                items = items.set(
                    id,
                    Map({
                        id,
                        name: this.products.getIn([id, 'name']),
                        quantity: prices.size,
                        amount: this.getTotalPrices(prices)
                    })
                );
            }
        });

        return Map({
            items,
            total: this.getTotal()
        });
    }

    /**
     * Loops through all the items and apply discount that is specified.
     * 
     * @param {*} items 
     */
    setTotalAmount(items) {
        let total = 0;

        items.map((prices, id) => {
            if (this.rules.has(id)) {
                const rule = this.rules.get(id);
                total = total + this.applyPricingRules(rule, prices);
            } else {
                total = total + this.getTotalPrices(prices);
            }
        });

        return this.getDiscountedAmount(total);
    }

    /**
     * Gets the total amount in the cart less the discount.
     * 
     * @param {*} total 
     */
    getDiscountedAmount(total) {
        let discount = 0;

        if (this.currentPromoCode) {
            discount = total / 100 * this.currentPromoCode.discount;
        }

        return total - discount;
    }

    /**
     * Chooses which pricing rule to be applied.
     * 
     * @param {*} rule 
     * @param {*} prices 
     */
    applyPricingRules(rule, prices) {
        switch (rule.type) {
        case QUANTITY_DISCOUNT:
            return this.applyQuanityDiscount(rule, prices);
        case BULK_ORDER_DISCOUNT:
            return this.applyBulkOrderDiscount(rule, prices);
        default:
            return this.getTotalPrices(prices);
        }
    }

    /**
     * Apply discount quantity rule.
     * 
     * @param {*} rule 
     * @param {*} prices 
     */
    applyQuanityDiscount(rule, prices) {
        const total = this.getTotalPrices(prices);

        if (prices.size === 0) {
            return 0;
        }

        if (prices.size < rule.discountFor) {
            return total;
        }

        const discountMultiplier = Math.abs(prices.size / rule.discountFor);
        const discountedAmount = prices.first() * discountMultiplier;

        return total - discountedAmount;
    }

    /**
     * Apply bulk discount rule. Only apply if the quantity is
     * greater than discountFor given by the rule.
     * 
     * @param {*} rule 
     * @param {*} prices 
     */
    applyBulkOrderDiscount(rule, prices) {
        const total = this.getTotalPrices(prices);

        if (prices.size > rule.discountFor) {
            return (prices.first() - rule.discountGet) * prices.size;
        }

        return total;
    }
}

import { Record } from 'immutable';

const PricingRuleRecord = Record({
    // The product ID of the discount will be applied to.
    productId: undefined,
    // The quantity of the product in order for the discount to be applied.
    discountFor: 0,
    // Tells how much we are going to less from each prices.
    discountGet: 0,
    /**
        QUANTITY_DISCOUNT - Get discount by quantity e.g buy 1 take 1
        BULK_ORDER_DISCOUNT - Get discount by purching in bulk.
        ADDON_FREEBIES - Gets a freebie item with or without charge.
     */
    type: undefined
});

export default class PricingRule extends PricingRuleRecord {}

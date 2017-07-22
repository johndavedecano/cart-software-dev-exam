import { Map } from 'immutable';
import Product from '../models/Product';
import PricingRule from '../models/PricingRule';
import PricingRules from '../models/PricingRules';
import PromoCode from '../models/PromoCode';
import Promos from '../models/Promos';
import Cart from '../models/Cart';

import {
    QUANTITY_DISCOUNT,
    BULK_ORDER_DISCOUNT,
    ADDON_FREEBIES
} from '../models/RuleTypes';

const CATALOGUE = Map({
    ult_small: new Product({
        id: 'ult_small',
        name: 'Unlimited 1GB',
        price: 24.9
    }),
    ult_medium: new Product({
        id: 'ult_medium',
        name: 'Unlimited 2GB',
        price: 29.9
    }),
    ult_large: new Product({
        id: 'ult_large',
        name: 'Unlimited 5GB',
        price: 44.9
    }),
    '1gb': new Product({ id: '1gb', name: '1 GB Data-pack', price: 9.9 })
});

describe('Cart', () => {
    it('Scenario 1', () => {
        // Create Pricing Rules
        const CurrentPricingRules = new PricingRules();
        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_small',
                discountFor: 3,
                type: QUANTITY_DISCOUNT
            })
        );

        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_large',
                discountFor: 3,
                discountGet: 10,
                type: BULK_ORDER_DISCOUNT
            })
        );

        const ShoppingCart = new Cart();

        // Make sure that the pricing rules gets set.
        ShoppingCart.setPricingRules(CurrentPricingRules.getItems());
        expect(ShoppingCart.rules).toBe(CurrentPricingRules.getItems());

        ShoppingCart.add(CATALOGUE.get('ult_small'));
        ShoppingCart.add(CATALOGUE.get('ult_small'));
        ShoppingCart.add(CATALOGUE.get('ult_small'));
        ShoppingCart.add(CATALOGUE.get('ult_large'));
        // Well make sure that the items gets really added.
        expect(ShoppingCart.items.has('ult_small')).toBe(true);
        expect(ShoppingCart.items.has('ult_large')).toBe(true);
        expect(ShoppingCart.getTotal()).toBe(94.69999999999999);
    });

    it('Scenario 2', () => {
        // Create Pricing Rules
        const CurrentPricingRules = new PricingRules();
        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_small',
                discountFor: 3,
                type: QUANTITY_DISCOUNT
            })
        );

        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_large',
                discountFor: 3,
                discountGet: 5, // cuts off 5 dollars on each item if the items is larger than 3
                type: BULK_ORDER_DISCOUNT
            })
        );

        const ShoppingCart = new Cart();

        // Make sure that the pricing rules gets set.
        ShoppingCart.setPricingRules(CurrentPricingRules.getItems());
        expect(ShoppingCart.rules).toBe(CurrentPricingRules.getItems());

        ShoppingCart.add(CATALOGUE.get('ult_small'));
        ShoppingCart.add(CATALOGUE.get('ult_small'));

        ShoppingCart.add(CATALOGUE.get('ult_large'));
        ShoppingCart.add(CATALOGUE.get('ult_large'));
        ShoppingCart.add(CATALOGUE.get('ult_large'));
        ShoppingCart.add(CATALOGUE.get('ult_large'));

        // Well make sure that the items gets really added.
        expect(ShoppingCart.items.has('ult_small')).toBe(true);
        expect(ShoppingCart.items.has('ult_large')).toBe(true);
        expect(ShoppingCart.getTotal()).toBe(209.39999999999998);
    });

    it('Scenario 3 Addons', () => {
        // Create Pricing Rules
        const CurrentPricingRules = new PricingRules();
        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_small',
                discountFor: 3,
                type: QUANTITY_DISCOUNT
            })
        );

        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_large',
                discountFor: 3,
                discountGet: 5, // cuts off 5 dollars on each item if the items is larger than 3
                type: BULK_ORDER_DISCOUNT
            })
        );

        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_medium',
                discountFor: 1,
                type: ADDON_FREEBIES
            })
        );

        const ShoppingCart = new Cart();

        // Make sure that the pricing rules gets set.
        ShoppingCart.setPricingRules(CurrentPricingRules.getItems());
        expect(ShoppingCart.rules).toBe(CurrentPricingRules.getItems());

        ShoppingCart.setAddon(
            'ult_medium',
            CATALOGUE.get('1gb').set('price', 0) // Price here is zero but can still be set to diferent prices.
        );

        ShoppingCart.add(CATALOGUE.get('ult_small'));
        ShoppingCart.add(CATALOGUE.get('ult_medium'));
        ShoppingCart.add(CATALOGUE.get('ult_medium'));

        expect(ShoppingCart.getTotal()).toBe(84.69999999999999);
    });

    it('Scenario 4 Coupon Discount', () => {
        // Create Promo Codes
        const CurrentPromos = new Promos();
        const CurrentPromoCode = new PromoCode({
            id: 'I<3AMAYSIM',
            discount: 10
        });
        CurrentPromos.addPromoCode(CurrentPromoCode);
        // Make sure that promo code is added.
        expect(CurrentPromos.isValid(CurrentPromoCode.id)).toBe(true);

        // Create Pricing Rules
        const CurrentPricingRules = new PricingRules();
        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_small',
                discountFor: 3,
                type: QUANTITY_DISCOUNT
            })
        );

        CurrentPricingRules.addPricingRule(
            new PricingRule({
                productId: 'ult_large',
                discountFor: 3,
                discountGet: 5, // cuts off 5 dollars on each item if the items is larger than 3
                type: BULK_ORDER_DISCOUNT
            })
        );

        const ShoppingCart = new Cart();

        // Make sure that the promos gets set.
        ShoppingCart.setPromos(CurrentPromos.getItems());
        expect(ShoppingCart.promos).toBe(CurrentPromos.getItems());

        // Make sure that the pricing rules gets set.
        ShoppingCart.setPricingRules(CurrentPricingRules.getItems());
        expect(ShoppingCart.rules).toBe(CurrentPricingRules.getItems());

        ShoppingCart.add(CATALOGUE.get('ult_small'), 'I<3AMAYSIM');
        ShoppingCart.add(CATALOGUE.get('1gb'));

        expect(ShoppingCart.getTotal()).toBe(31.319999999999997);
    });
});

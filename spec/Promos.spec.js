import { Map } from 'immutable';
import PromoCode from '../models/PromoCode';
import Promos from '../models/Promos';

const ERROR_MESSAGE = 'Invalid promo code given';

describe('Promos', () => {
    it('adds a valid promo code', () => {
        const Code = new PromoCode({
            id: 'FJ56886JGHL',
            discount: 10
        });

        const ValidPromos = new Promos();

        ValidPromos.addPromoCode(Code).addPromoCode(Code);
        // We expect promo code with the ID of 1 to be added.
        expect(ValidPromos.isValid(Code.id)).toBe(true);
        // We expect one because we do not want duplicate codes be added.
        expect(ValidPromos.getItems().size).toBe(1);
        // We expect our items to be a Map not a List nor other types.
        expect(ValidPromos.getItems()).toBeInstanceOf(Map);
        // We expect that we get a valid code using the given ID.
        expect(ValidPromos.getItem(Code.id)).toBe(Code);
        // We expect this should throw an error
        expect(() => ValidPromos.getItem('notexisting')).toThrowError(
            ERROR_MESSAGE
        );
    });
});

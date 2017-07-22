import { Record } from 'immutable';

const PromoCodeRecord = Record({
    id: undefined,
    discount: 0
});

export default class PromoCode extends PromoCodeRecord {}

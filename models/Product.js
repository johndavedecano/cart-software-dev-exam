import { Record } from 'immutable';

const ProductRecord = Record({
    id: undefined,
    name: undefined,
    price: 0
});

export default class Product extends ProductRecord {}

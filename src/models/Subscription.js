export default class Subscription {
    contractId
    subscriber
    coverages = []

    constructor(init) {
        Object.assign(this, init);
    }
}
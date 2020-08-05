export default class Subscriber {
    member
    dependents = []

    constructor(init) {
        Object.assign(this, init);
    }
}
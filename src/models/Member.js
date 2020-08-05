export default class Member {
    identifier
    relationship = 'SPOUSE'
    personInfo
    addresses = []
    eligibility = []
    providers = []
    responsiblePerson
    billingInfo
    employerInfo
    contacts = []

    constructor(init) {
        Object.assign(this, init);
    }
}
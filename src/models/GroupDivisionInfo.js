export default class GroupDivisionInfo {
    groupId
    divisionId
    effectiveDate
    endDate
    insuranceType
    subscriptions = []

    constructor(init) {
        Object.assign(this, init);
    }
}
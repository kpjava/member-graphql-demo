export default class CoverageInfo {
    effectiveDate
    endDate
    groupLevel3
    groupLevel4
    coverageType
    rateCode
    termReasonCode

    constructor(init) {
        Object.assign(this, init);
    }
}
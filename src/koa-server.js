const fs = require('fs');
const Koa = require('koa');
const koaGQL = require('koa-graphql');
const {buildSchema} = require('graphql');

const port = 3300;
const app = new Koa();

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf-8'));

const people = [
  {
    personId: '---1---',
    firstName: 'John',
    lastName: 'Doe',
    suffix: undefined,
    title: undefined,
    dateOfBirth: '2001-01-01',
    SSN: 'xxx-xx-xxxx',
  },
  {
    personId: '---2---',
    firstName: 'Jane',
    lastName: 'Doe',
    suffix: undefined,
    title: undefined,
    dateOfBirth: '2002-02-02',
    SSN: 'xxx-xx-xxxx',
  }
]
const coverages = [
  {
    effectiveDate: '2020-01-01',
    endDate: '9999-12-31',
  },
  {
    effectiveDate: '2020-02-01',
    endDate: '9999-12-31',
  }
];

const subscriptions = [
  {
    contractId: '000001',
    subscriberId: '0000000001',
    subscriberAltId: 'N/A',
    coverages: [coverages[0], coverages[1]],
  },
  {
    contractId: '000001',
    subscriberId: '0000000001',
    subscriberAltId: 'N/A',
    coverages: [coverages[0], coverages[1]],
  }
]

const members = [
  {
    memberId: '01',
    identifiers: {
      caseId: 'case1',
      memberClass: 'mc',
      exchangePlanId: '',
      groupReceiverId: '',
      exchangeGroupId: ''
    },
    person: people[0],
  },
  {
    memberId: '02',
    identifiers: {
      caseId: 'case1',
      memberClass: 'mc',
      exchangePlanId: '',
      groupReceiverId: '',
      exchangeGroupId: ''
    },
    person: people[1],
  }
];

const memberSubscriptions = [
  {
    subscription: subscriptions[0],
    member: members[0],
    role: 'SUBSCRIBER'
  },
  {
    subscription: subscriptions[1],
    member: members[1],
    role: 'SPOUSE'
  }
]

const rootValue = {
  family: ({contractId}) => {
    const result = [];
    for (ms of memberSubscriptions) {
      if (ms.subscription.contractId === contractId) {
        result.push(ms.member);
      }
    }
    return result;
  },
  singleMemberSearch: ({firstName, lastName, dateOfBirth}) => {
    for (ms of memberSubscriptions) {
      if (ms.member.person.firstName !== firstName) continue;
      if (ms.member.person.lastName !== lastName) continue;
      if (ms.member.person.dateOfBirth !== dateOfBirth) continue;
      return ms;
    }
  },

  memberSearchByEnrolleeId: ({firstName, lastName, dateOfBirth, enrolleeId}) => {
    const subscriberId = enrolleeId.slice(0, 10);
    const subscriber = subscribers
      .filter(s => s.subscriberId === subscriberId || s.member.person.SSN === enrolleeId)
      .pop();
    if (subscriber) {
      for (dependent of subscriber.dependents) {
        if (firstName && dependent.person.firstName !== firstName) continue;
        if (lastName && dependent.person.lastName !== lastName) continue;
        if (dependent.person.dateOfBirth !== dateOfBirth) continue;
        return dependent;
      }
      if (firstName && subscriber.member.person.firstName !== firstName) return;
      if (lastName && subscriber.member.person.lastName !== lastName) return;
      if (subscriber.member.person.dateOfBirth !== dateOfBirth) return;
      return subscriber.member;
    }
  },

  subscriber: ({subscriberId}) => {
    return subscribers.filter(s => s.subscriberId === subscriberId);
  }
};

app.use(koaGQL({
  schema,
  rootValue,
  graphiql: true
}));



app.listen(port, () => console.info(`Koa GraphQL Server listening on http://localhost:${port}/graphql...`));
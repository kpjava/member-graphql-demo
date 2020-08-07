const fs = require('fs');
const Koa = require('koa');
const koaGQL = require('koa-graphql');
const {buildSchema} = require('graphql');

const port = 3300;
const app = new Koa();

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf-8'));

const coverages = [
  {
    contractId: 'cid-000001',
    effectiveDate: '2020-01-01',
    endDate: '9999-12-31',
  },
  {
    contractId: 'cid-000002',
    effectiveDate: '2020-02-01',
    endDate: '9999-12-31',
  }
];

const identifiers = [
  {
    name: 'PERSONID',
    value: 'personID-1'
  },
  {
    name: 'SSN',
    value: 'xxx-xx-xxx1',
  },
  {
    name: 'PERSONID',
    value: 'personID-2'
  },
  {
    name: 'SSN',
    value: 'xxx-xx-xxx2',
  }
];

function identifiersWithFilter(identifiers) {
  return ({name}) => {
    return identifiers.filter(i => i.name === name);
  }
}

const members = [
  {
    memberId: '01',
    identifiers: identifiersWithFilter([identifiers[0], identifiers[1]]),
    firstName: 'John',
    lastName: 'Doe',
    suffix: undefined,
    title: undefined,
    dateOfBirth: '2001-01-01',
    role: 'SUBSCRIBER'
  },
  {
    memberId: '02',
    identifiers: identifiersWithFilter([identifiers[2], identifiers[3]]),
    firstName: 'Jane',
    lastName: 'Doe',
    suffix: undefined,
    title: undefined,
    dateOfBirth: '2002-02-02',
    role: 'SPOUSE'
  }
];

const memberSubscriptions = [
  {
    member: members[0],
    coverages: [coverages[0], coverages[1]],
  },
  {
    member: members[1],
    coverages: [coverages[0], coverages[1]],
  },
]

const familySubscriptions = [
  {
    subscriber: members[0],
    dependents: [members[1]],
    coverages: [coverages[0], coverages[1]],
  },
]

const rootValue = {
  memberFamily: ({contractId, memberId}) => {
    for (let fs of familySubscriptions) {
      if (contractId && fs.coverages.some(c => c.contractId === contractId)) {
        return fs;
      }
      else if (memberId) {
        if (fs.subscriber.memberId === memberId)
          return fs;
        if (fs.dependents.some(m => m.memberId === memberId))
          return fs;
      }
    }
  },
  memberSearch: ({firstName, lastName, dateOfBirth, networkId}) => {
    const results = [];
    for (let ms of memberSubscriptions) {
      if (ms.member.firstName !== firstName) continue;
      if (ms.member.lastName !== lastName) continue;
      if (ms.member.dateOfBirth !== dateOfBirth) continue;
      results.push(ms);
    }
    return results;
  }
};

app.use(koaGQL({
  schema,
  rootValue,
  graphiql: true
}));



app.listen(port, () => console.info(`Koa GraphQL Server listening on http://localhost:${port}/graphql...`));
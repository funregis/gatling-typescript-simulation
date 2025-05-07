import {
  atOnceUsers,
  getParameter,
  global,
  scenario,
  simulation,
  jmesPath,
  StringBody,
  nothingFor,
  rampUsers
} from '@gatling.io/core';
import { http, status } from '@gatling.io/http';
import { DevConfig } from './config/dev';
import { UatConfig } from './config/uat';
import { PreprodConfig } from './config/preprod';
import { HttpUtils } from './utils/HttpUtils';
import userState from '../json/UserState.json';
import { LogUtils } from './utils/LogUtils';
const environment = getParameter('env', 'dev');

// Ajoute la gestion du nouvel environnement
let config;
if (environment === 'uat') {
  config = new UatConfig();
} else if (environment === 'preprod') {
  config = new PreprodConfig();
} else {
  config = new DevConfig();
}
const log = new LogUtils();

const userSiret = userState.siret;
const token = userState.accessToken;

log.logInfo(`--- Lancement Simulation dossier sur env : ${environment.toUpperCase()} ---`);

const scn = scenario('Scenario with Shared Token')
  .exec((session) => session.set('accessToken', token).set('userSiret', userSiret)) // injecte le siret dans la session
  .exec(
    http('Api1')
      .get(
        `ressource1`
      )
      .check(status().is(200), jmesPath('response[*].siret').saveAs('siretsArray'))
  )
  .exec(
    http('Api2')
      .post(`ressource2`)
      .body(
        StringBody(
          (session) =>
            `{
           "sirets": ${session.get("attribute")}
           }`
        )
      )
      .check(status().is(200))
  )
  .pause(5)
  .exec(
    http('API3')
      .post(`ressource3`)
      .body(
        StringBody(
          (session) =>
            `{
        "sirets": ${session.get("siretsArray")},
        "categorieDossier": "Toutes",
        "page": 0,
        "orderBy": "DESC",
        "orderByColumn": "dateCreation",
        "dossierASolder": false,
        "dateDecisionOperateur": "="
        }`
        )
      )
      .check(status().is(200))
  )
  .pause(5);
const assertion = global().failedRequests().count().lt(1.0);

export default simulation((setUp) => {
  setUp(
    scn.injectOpen(
        atOnceUsers(1),
        nothingFor(10),
        rampUsers(100).during(40),
        nothingFor(10),
        rampUsers(200).during(60),
        nothingFor(10),
        rampUsers(300).during(100),
        nothingFor(10),
    )
  ).protocols(HttpUtils.httpConfig(config))
      .assertions(assertion)
    .maxDuration({amount: 10, unit: 'minutes'});
});
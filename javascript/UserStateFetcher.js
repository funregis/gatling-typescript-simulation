import fetch from 'node-fetch';
import {writeFileSync} from 'fs';
import {UatConfig} from '../target/uat.js';
import {PreprodConfig} from '../target/preprod.js';
import {DevConfig} from '../target/dev.js';

const argEnv = process.argv[2];

let config;
switch (argEnv) {
    case 'uat':
        config = new UatConfig();
        break;
    case 'preprod':
        config = new PreprodConfig();
        break;
    case 'dev':
        config = new DevConfig();
        break;
    default:
        console.error(`Argument invalide ou non trouvé  ${argEnv}. Les valeurs autorisées 'uat', 'preprod', 'dev'.`);
        process.exit(1);
}

// --- Récupération du token ---
const url = `${config.keycloakUrl}/protocol/openid-connect/token`;
console.log(`Récupération du token sur l'env ${argEnv.toUpperCase()} , sur l'url ${url}`);
const params = new URLSearchParams();
params.append('client_id', config.clientId);
params.append('username', config.username);
params.append('password', config.password);
params.append('grant_type', 'password');

const response = await fetch(url, {
    method: 'POST',
    body: params,
});
if (!response.ok) {
    console.error('Erreur d\'authentification', await response.text());
    process.exit(1);
}
const data = await response.json();
const accessToken = data.access_token;

// --- Appel unique à l'API User Account Info ---
const userAccountUrl = `${config.keycloakUrl}/account`;
const userInfoResponse = await fetch(userAccountUrl, {
    headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    },
});
if (!userInfoResponse.ok) {
    console.error('Erreur récupération User Account Info', await userInfoResponse.text());
    process.exit(1);
}
const userInfo = await userInfoResponse.json();

const siret =
    userInfo?.attributes?.siret &&
    Array.isArray(userInfo.attributes.siret) &&
    userInfo.attributes.siret.length > 0
        ? userInfo.attributes.siret[0]
        : undefined;

if (!siret) {
    console.error("Aucun siret trouvé dans la réponse userInfo.");
    process.exit(1);
}

const credentialsData = {
    accessToken,
    siret,
};

writeFileSync(
    './json/UserState.json',
    JSON.stringify(credentialsData, null, 2),
    'utf-8'
);

console.log('Token et siret principal enregistrés dans UserState.json.');
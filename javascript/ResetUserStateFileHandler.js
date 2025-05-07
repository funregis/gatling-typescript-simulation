import { writeFileSync } from 'fs';

/**
 * Nettoyage du fichier UserState.json
 */
console.log('Nettoyage UserState.json');
writeFileSync('./json/UserState.json', JSON.stringify({accessToken: '', siret: ''}, null, 2), 'utf-8');
console.log('UserState.json vidé');
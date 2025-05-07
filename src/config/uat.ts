import { EnvConfig } from './EnvConfig';

export class UatConfig implements EnvConfig {
  baseUrl = '';
  keycloakUrl = '';
  clientId = '';
  username = '';
  password = '';
  logLevel = 'INFO';
  origin = '';
}

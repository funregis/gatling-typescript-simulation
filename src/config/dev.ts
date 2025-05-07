import { EnvConfig } from './EnvConfig';

export class DevConfig implements EnvConfig {
  baseUrl = '';
  keycloakUrl = '';
  clientId = '';
  username = '';
  password = '';
  logLevel = 'DEBUG';
  origin = ''
}

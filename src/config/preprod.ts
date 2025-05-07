import { EnvConfig } from './EnvConfig';

export class PreprodConfig implements EnvConfig {
  baseUrl = '';
  keycloakUrl = '';
  clientId = '';
  username = '';
  password = '';
  logLevel = '';
  origin = '';
}

import { http, status } from "@gatling.io/http";
import { jmesPath } from "@gatling.io/core";
import { EnvConfig } from "../config/EnvConfig";

export class HttpUtils {
  static httpConfig(config: EnvConfig) {
    return http
      .baseUrl(config.baseUrl)
      .authorizationHeader("bearer #{accessToken}")
      .originHeader(config.origin)
      .acceptHeader("application/json")
      .contentTypeHeader("application/json")
      .userAgentHeader(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
      );
  }
}

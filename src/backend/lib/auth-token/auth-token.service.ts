import jsonwebtoken from "jsonwebtoken";
import { IAccountUser } from "shared/types";
import {
  ConfigKeys,
  configService,
  ConfigService,
} from "../config/config.service";

export class AuthTokenService {
  private authToken: string;

  private tokenValiditityDurationInDays: number;

  constructor(private readonly _configService: ConfigService) {
    this.authToken = this._configService.getConfigValue(
      ConfigKeys.AUTH_TOKEN_KEY
    );
    this.tokenValiditityDurationInDays = this._configService.getConfigValue(
      ConfigKeys.TOKEN_VALIDITY_DURATION_IN_DAYS
    );
  }

  async verify(token: string): Promise<Omit<IAccountUser, "password">> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, this.authToken, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded as IAccountUser);
      });
    });
  }

  sign(payload: Omit<IAccountUser, "password">): string {
    return jsonwebtoken.sign(payload, this.authToken, {
      expiresIn: `${this.tokenValiditityDurationInDays}d`,
    });
  }
}

export const authTokenService = new AuthTokenService(configService);

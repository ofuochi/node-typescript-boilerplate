import { injectable } from "inversify";
import { Document } from "mongoose";
import { DbClient } from "../db_client";
import { dbClient } from "../../../domain/constants/decorators";
import { BaseRepository } from "./generic_repository";
import { Account } from "../../../domain/model/account";
import { IAccountRepository } from "../../../domain/interfaces/repositories";

export interface AccountModel extends Account, Document {}

@injectable()
export class AccountRepository extends BaseRepository<Account, AccountModel>
	implements IAccountRepository {
	public constructor(@dbClient dbClient: DbClient) {
		super(dbClient, "Accounts", {
			username: String,
			email: String,
			password: String,
			roles: [String]
		});
	}
}

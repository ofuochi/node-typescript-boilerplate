import { injectable } from "inversify";

import { ITenantService } from "../../domain/interfaces/services";

@injectable()
export default class TenantService implements ITenantService {
    create(
        name: string,
        description: string
    ): Promise<{ id: string; name: string; isActive: boolean }> {
        throw new Error("Method not implemented.");
    }
}

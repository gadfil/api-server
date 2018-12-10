import {EntityManager} from "typeorm/entity-manager/EntityManager";
import {Account} from "../modules/account";

export interface ResolverMap {
    [key: string]: {
        [key: string]: (
            parent: any,
            args: any,
            context: { account: Account },
            info: any
        ) => any
    }
}
import {EntityManager} from "typeorm/entity-manager/EntityManager";

export interface ResolverMap {
    [key: string]: {
        [key: string]: (
            parent: any,
            args: any,
            context: { user: number; manager: EntityManager },
            info: any
        ) => any
    }
}
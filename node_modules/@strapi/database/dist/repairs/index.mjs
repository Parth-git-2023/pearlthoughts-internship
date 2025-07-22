import { removeOrphanMorphType } from './operations/remove-orphan-morph-types.mjs';
import { asyncCurry } from '../utils/async-curry.mjs';

const createRepairManager = (db)=>{
    return {
        removeOrphanMorphType: asyncCurry(removeOrphanMorphType)(db)
    };
};

export { createRepairManager };
//# sourceMappingURL=index.mjs.map

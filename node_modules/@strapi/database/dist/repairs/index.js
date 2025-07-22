'use strict';

var removeOrphanMorphTypes = require('./operations/remove-orphan-morph-types.js');
var asyncCurry = require('../utils/async-curry.js');

const createRepairManager = (db)=>{
    return {
        removeOrphanMorphType: asyncCurry.asyncCurry(removeOrphanMorphTypes.removeOrphanMorphType)(db)
    };
};

exports.createRepairManager = createRepairManager;
//# sourceMappingURL=index.js.map

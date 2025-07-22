'use strict';

var index = require('./utils/index.js');

const destroy = async ({ strapi })=>{
    const scheduledJobs = index.getService('scheduling', {
        strapi
    }).getAll();
    for (const [, job] of scheduledJobs){
        job.cancel();
    }
};

exports.destroy = destroy;
//# sourceMappingURL=destroy.js.map

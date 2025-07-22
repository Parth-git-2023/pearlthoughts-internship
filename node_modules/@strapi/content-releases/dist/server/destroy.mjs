import { getService } from './utils/index.mjs';

const destroy = async ({ strapi })=>{
    const scheduledJobs = getService('scheduling', {
        strapi
    }).getAll();
    for (const [, job] of scheduledJobs){
        job.cancel();
    }
};

export { destroy };
//# sourceMappingURL=destroy.mjs.map

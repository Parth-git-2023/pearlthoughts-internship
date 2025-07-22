/// <reference types="node" />
import type { GetRecentDocuments } from '../../../../shared/contracts/homepage';
declare const createHomepageController: () => {
    getRecentDocuments(ctx: import("koa").Context): Promise<GetRecentDocuments.Response>;
};
export { createHomepageController };
//# sourceMappingURL=homepage.d.ts.map
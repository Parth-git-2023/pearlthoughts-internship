class Dialect {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    configure(conn) {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async initialize(_nativeConnection) {
    // noop
    }
    getTables() {
        throw new Error('getTables not implemented for this dialect');
    }
    getSqlType(type) {
        return type;
    }
    canAlterConstraints() {
        return true;
    }
    usesForeignKeys() {
        return false;
    }
    useReturning() {
        return false;
    }
    supportsUnsigned() {
        return false;
    }
    supportsOperator() {
        return true;
    }
    async startSchemaUpdate() {
    // noop
    }
    async endSchemaUpdate() {
    // noop
    }
    transformErrors(error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(error.message);
    }
    canAddIncrements() {
        return true;
    }
    constructor(db, client){
        this.schemaInspector = {};
        this.db = db;
        this.client = client;
    }
}

export { Dialect as default };
//# sourceMappingURL=dialect.mjs.map

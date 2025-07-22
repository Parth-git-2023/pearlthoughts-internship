import NotNullError from '../../errors/not-null.mjs';
import Dialect from '../dialect.mjs';
import PostgresqlSchemaInspector from './schema-inspector.mjs';

class PostgresDialect extends Dialect {
    useReturning() {
        return true;
    }
    async initialize(nativeConnection) {
        // Don't cast DATE string to Date()
        this.db.connection.client.driver.types.setTypeParser(this.db.connection.client.driver.types.builtins.DATE, 'text', (v)=>v);
        // Don't parse JSONB automatically
        this.db.connection.client.driver.types.setTypeParser(this.db.connection.client.driver.types.builtins.JSONB, 'text', (v)=>v);
        this.db.connection.client.driver.types.setTypeParser(this.db.connection.client.driver.types.builtins.NUMERIC, 'text', parseFloat);
        // If we're using a schema, set the default path for all table names in queries to use that schema
        // Ideally we would rely on Knex config.searchPath to do this for us
        // However, createConnection must remain synchronous and if the user is using a connection function,
        // we do not know what their schema is until after the connection is resolved
        const schemaName = this.db.getSchemaName();
        if (schemaName) {
            await this.db.connection.raw(`SET search_path TO "${schemaName}"`).connection(nativeConnection);
        }
    }
    usesForeignKeys() {
        return true;
    }
    getSqlType(type) {
        switch(type){
            case 'timestamp':
                {
                    return 'datetime';
                }
            default:
                {
                    return type;
                }
        }
    }
    transformErrors(error) {
        switch(error.code){
            case '23502':
                {
                    throw new NotNullError({
                        column: 'column' in error ? `${error.column}` : undefined
                    });
                }
            default:
                {
                    super.transformErrors(error);
                }
        }
    }
    constructor(db){
        super(db, 'postgres');
        this.schemaInspector = new PostgresqlSchemaInspector(db);
    }
}

export { PostgresDialect as default };
//# sourceMappingURL=index.mjs.map

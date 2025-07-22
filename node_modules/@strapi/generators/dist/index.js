'use strict';

var node_path = require('node:path');
var nodePlop = require('node-plop');

// Starts the Plop CLI programmatically
const runCLI = async ()=>{
    const { Plop, run } = await import('plop');
    Plop.prepare({
        configPath: node_path.join(__dirname, 'plopfile.js')
    }, (env)=>{
        const argv = process.argv.slice(2); // Extract command-line arguments
        Plop.execute(env, argv, (env, argv)=>{
            const options = {
                ...env,
                dest: node_path.join(process.cwd(), 'src')
            };
            return run(options, argv, true); // Pass the third argument 'true' for passArgsBeforeDashes
        });
    });
};
// Runs a generator programmatically without prompts
const generate = async (generatorName, options, { dir = process.cwd(), plopFile = 'plopfile.js' } = {})=>{
    const plop = nodePlop(node_path.join(__dirname, plopFile), {
        destBasePath: node_path.join(dir, 'src'),
        force: false
    });
    const generator = plop.getGenerator(generatorName);
    await generator.runActions(options, {
        onSuccess () {},
        onFailure () {},
        onComment () {}
    });
};

exports.generate = generate;
exports.runCLI = runCLI;
//# sourceMappingURL=index.js.map

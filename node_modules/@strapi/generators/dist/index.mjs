import { join } from 'node:path';
import nodePlop from 'node-plop';

// Starts the Plop CLI programmatically
const runCLI = async ()=>{
    const { Plop, run } = await import('plop');
    Plop.prepare({
        configPath: join(__dirname, 'plopfile.js')
    }, (env)=>{
        const argv = process.argv.slice(2); // Extract command-line arguments
        Plop.execute(env, argv, (env, argv)=>{
            const options = {
                ...env,
                dest: join(process.cwd(), 'src')
            };
            return run(options, argv, true); // Pass the third argument 'true' for passArgsBeforeDashes
        });
    });
};
// Runs a generator programmatically without prompts
const generate = async (generatorName, options, { dir = process.cwd(), plopFile = 'plopfile.js' } = {})=>{
    const plop = nodePlop(join(__dirname, plopFile), {
        destBasePath: join(dir, 'src'),
        force: false
    });
    const generator = plop.getGenerator(generatorName);
    await generator.runActions(options, {
        onSuccess () {},
        onFailure () {},
        onComment () {}
    });
};

export { generate, runCLI };
//# sourceMappingURL=index.mjs.map

'use strict';

var inquirer = require('inquirer');
var axios = require('axios');
var fp = require('lodash/fp');
var cliApi = require('../services/cli-api.js');
var strapiInfoSave = require('../services/strapi-info-save.js');
var token = require('../services/token.js');
require('chalk');
require('fast-safe-stringify');
require('ora');
require('cli-progress');
var getProjectNameFromPkg = require('./utils/get-project-name-from-pkg.js');
var action$1 = require('../login/action.js');
var projectQuestions_utils = require('./utils/project-questions.utils.js');

async function handleError(ctx, error) {
    const { logger } = ctx;
    logger.debug(error);
    if (error instanceof axios.AxiosError) {
        const errorMessage = typeof error.response?.data === 'string' ? error.response.data : null;
        switch(error.response?.status){
            case 403:
                logger.error(errorMessage || 'You do not have permission to create a project. Please contact support for assistance.');
                return;
            case 400:
                logger.error(errorMessage || 'Invalid input. Please check your inputs and try again.');
                return;
            case 503:
                logger.error('Strapi Cloud project creation is currently unavailable. Please try again later.');
                return;
            default:
                if (errorMessage) {
                    logger.error(errorMessage);
                    return;
                }
                break;
        }
    }
    logger.error('We encountered an issue while creating your project. Please try again in a moment. If the problem persists, contact support for assistance.');
}
async function createProject(ctx, cloudApi, projectInput) {
    const { logger } = ctx;
    const spinner = logger.spinner('Setting up your project...').start();
    try {
        const { data } = await cloudApi.createProject(projectInput);
        await strapiInfoSave.save({
            project: data
        });
        spinner.succeed('Project created successfully!');
        return data;
    } catch (e) {
        spinner.fail('An error occurred while creating the project on Strapi Cloud.');
        throw e;
    }
}
var action = (async (ctx)=>{
    const { logger } = ctx;
    const { getValidToken, eraseToken } = await token.tokenServiceFactory(ctx);
    const token$1 = await getValidToken(ctx, action$1.promptLogin);
    if (!token$1) {
        return;
    }
    const cloudApi = await cliApi.cloudApiFactory(ctx, token$1);
    const { data: config } = await cloudApi.config();
    const projectName = await getProjectNameFromPkg.getProjectNameFromPackageJson(ctx);
    const defaultAnswersMapper = projectQuestions_utils.questionDefaultValuesMapper({
        name: projectName,
        nodeVersion: projectQuestions_utils.getProjectNodeVersionDefault
    });
    const questions = defaultAnswersMapper(config.projectCreation.questions);
    const defaultValues = {
        ...config.projectCreation.defaults,
        ...projectQuestions_utils.getDefaultsFromQuestions(questions)
    };
    const projectAnswersDefaulted = fp.defaults(defaultValues);
    const projectAnswers = await inquirer.prompt(questions);
    const projectInput = projectAnswersDefaulted(projectAnswers);
    try {
        return await createProject(ctx, cloudApi, projectInput);
    } catch (e) {
        if (e instanceof axios.AxiosError && e.response?.status === 401) {
            logger.warn('Oops! Your session has expired. Please log in again to retry.');
            await eraseToken();
            if (await action$1.promptLogin(ctx)) {
                return await createProject(ctx, cloudApi, projectInput);
            }
        } else {
            await handleError(ctx, e);
        }
    }
});

module.exports = action;
//# sourceMappingURL=action.js.map

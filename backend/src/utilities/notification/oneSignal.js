// const Config = require('config');
const { utils } = require('../../core');

const OneSignalErrors = {
    UNSUBSCRIBED_USER: 'All included players are not subscribed',
    INVALID_EXTERNAL_USER_IDS: {
        key: 'invalid_external_user_ids',
        msg: 'Invalid External User Id',
    },
    INVALID_PLAYER_IDS: {
        key: 'invalid_player_ids',
        msg: 'Invalid Player Id',
    },
};

const makeRequest = async(config = {}, logger) => {

    config.headers = config.headers || {};
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers['Cache-Control'] = 'no-cache';
    config.forever = true;
    config.maxAttempts = 3;
    config.retryDelay = 200;

    let options = {
        url: config.baseUrl,
        headers: {
            ...config.headers
        },
        method: config.method,
        data: config.json,
    };
   return await utils.axiosClient(options);
};

const OneSignal = {};

OneSignal.init = (config) => {
    OneSignal.Config = {
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        appId: config.appId
    };
    OneSignal.Config.authorization = `Basic ${OneSignal.Config.apiKey}`;
};

/**
 *
 * @param userIds
 * @param playerIds
 * @param segments
 * @param body
 * @param data
 * @param logger
 * @returns {*|Promise<{invalid_external_user_ids: [], errors: *}>|PromiseLike<{invalid_external_user_ids: [], errors: *}>}
 */
OneSignal.sendNotification = (userIds, playerIds, segments, body, data, logger) => {
    // if ((userIds && !Array.isArray(userIds))
    //     || (playerIds && !Array.isArray(playerIds))
    //     || (segments && !Array.isArray(segments))
    //     || !body
    //     || !logger
    //     || !OneSignal.Config
    // ) {
    //     throw new Error('Invalid params');
    // }

    const config = {
        baseUrl: `${OneSignal.Config.baseUrl}/notifications`,
        json: {
            app_id: OneSignal.Config.appId,
            contents: {
                en: body.contents,
            },
            headings: {
                en: body.title,
            },
        },
        headers: {
            Authorization: OneSignal.Config.authorization,
        },
        method: 'POST',
    };

    if (segments) {
        segments = segments.map((segment) => OneSignal.SEGMENTS[segment]);
        config.json.included_segments = segments;
    }

    if (userIds) {
        config.json.include_external_user_ids = userIds;
    }

    if (playerIds) {
        config.json.include_player_ids = playerIds;
    }

    if (data) {
        config.json.data = data;
    }
    return makeRequest(config, logger)
        .then((result) => {
            let invalid_external_user_ids = [];
            if (result) {
                if (result.errors) {
                    if (
                        Array.isArray(result.errors)
                        && result.errors.includes(OneSignalErrors.UNSUBSCRIBED_USER)
                    ) {
                        logger.warn(result.errors);
                    } else if (
                        result.errors.constructor.name === 'Object'
                        && (
                            OneSignalErrors.INVALID_EXTERNAL_USER_IDS.key in result.errors
                            || OneSignalErrors.INVALID_PLAYER_IDS.key in result.errors
                        )
                    ) {
                        logger.warn(result.errors);
                        invalid_external_user_ids = result.errors.invalid_external_user_ids
                            || result.errors.invalid_player_ids;
                    } else {
                        logger.error(result.errors);
                    }
                } else {
                    logger.info(`Recipients: ${result.recipients}`);
                }
            }
            return {
                invalid_external_user_ids,
                errors: result.errors,
            };
        });
};

/**
 *
 * @type {{TEST_USERS: string, ENGAGED_USERS: string, INACTIVE_USERS: string, ACTIVE_USERS: string, SUBSCRIBED_USERS: string}}
 */
OneSignal.SEGMENTS = {
    SUBSCRIBED_USERS: 'Subscribed Users',
    ACTIVE_USERS: 'Active Users',
    ENGAGED_USERS: 'Engaged Users',
    INACTIVE_USERS: 'Inactive Users',
    TEST_USERS: 'Test users',
};

module.exports = OneSignal;
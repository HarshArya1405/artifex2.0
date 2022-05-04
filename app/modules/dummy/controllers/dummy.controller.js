// Libs and utils

// Services
const HttpStatusConstants = require('../../../config/constant/httpStatusConstants');
const dummyViewServiceV1 = require('../v1/services/dummy.service');
const dummyViewServiceV2 = require('../v2/services/dummy.service');

// Configs
const { mergedEnvironmentConfig } = require('../../../config/env.config');

const helloDummy = async (req, res, next) => {
  console.log("here")
  try {
    let dummyData = dummyViewServiceV1.dummyResponse
    let responseData = {
        data:dummyData,
        statusCode: HttpStatusConstants.STATUS_CODE_GENERALIZED_SUCCESS,
        message: serviceError?.message ?? 'Failed to handle request',
        error: serviceError,
        result: {
          currentDateTime,
        },
      };
  } catch (controllerError) {
    console.log(`[Dummy COntrollerController] ControllerError `, controllerError);
    let responseData = {
      statusCode: HttpStatusConstants.STATUS_CODE_SERVER_EXCEPTION_ENCOUNTERED,
      message: controllerError?.message ?? 'Failed to handle request',
      error: controllerError,
    };
  }

  return res.send(responseData);
};

module.exports = {
  helloDummy,
};

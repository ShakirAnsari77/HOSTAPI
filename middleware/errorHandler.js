// const { constants } = require("../constants")
// const errorHandler = (err, req, res, next) => {
//     const statusCode = res.statusCode ? res.statusCode : 500;

//     switch (statusCode) {
//         case constants.VALIDATION_ERROR:
//             res.json({ title: "Validation Failed", message: err.message, stackTrace: err.stack })
//             break;

//         case constants.NOT_FOUND:
//             res.json({ title: "Not Found", message: err.message, stackTrace: err.stack })
//             break

//         case constants.UNAUTHORIZED:
//             res.json({ title: "Unauthorized", message: err.message, stackTrace: err.stack })
//             break

//         case constants.FORBIDDEN:
//             res.json({ title: "Forbidden", message: err.message, stackTrace: err.stack })
//             break

//         case constants.SERVER_ERRR:
//             res.json({ title: "Server Error", message: err.message, stackTrace: err.stack })
//             break

//         default:
//             console.log("No Error, All good!")
//             break;
//     }

// };

// module.exports = errorHandler



const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const errorTitle = getErrorTitle(statusCode);
  const errorResponse = {
    title: errorTitle,
    message: err.message,
    stackTrace: err.stack,
  };

  res.status(statusCode).json(errorResponse);
};

const getErrorTitle = (statusCode) => {
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      return "Validation Failed";

    case constants.NOT_FOUND:
      return "Not Found";

    case constants.UNAUTHORIZED:
      return "Unauthorized";

    case constants.FORBIDDEN:
      return "Forbidden";

    case constants.SERVER_ERRR:
      return "Server Error";

    default:
      return "Unknown Error";
  }
};

module.exports = errorHandler;

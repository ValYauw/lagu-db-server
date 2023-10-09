function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = "Internal Server Error";

  switch (err.name) {

    case "BadCredentials":
      statusCode = 400;
      message = err.message || "Bad Credentials";
      break;
    case "NotSuccessful":
      statusCode = 500;
      message = "The API call was not successful";
      break;

    case "InvalidLogin":
      statusCode = 401;
      message = "Invalid username/password";
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      message = "Invalid token";
      break;
    case "TokenExpiredError":
      statusCode = 401;
      message = "Token has expired";
      break;
    case "Unauthorized":
      statusCode = 401;
      message = "Invalid token";
      break;
      
    case "Forbidden":
      statusCode = 403;
      message = "Forbidden access";
      break;
    
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      statusCode = 400;
      message = err?.errors[0]?.message || 'Internal Server Error';
      break;

    case "NotFoundError":
      statusCode = 404;
      message = 'Data not found';
      break;
    
    default:
      console.log(err);
  }

  res.status(statusCode).json({statusCode, message});
}

module.exports = errorHandler;
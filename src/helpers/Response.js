class Response {
  constructor(
    statusCode = 200,
    httpStatus = HttpStatus.OK.status,
    message = "",
    data = null
  ) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }
}

const HttpStatus = {
  OK: { code: 200, status: "OK", message: "Operation successful" },
  CREATED: {
    code: 201,
    status: "CREATED",
    message: "Resource created successfully",
  },
  NO_CONTENT: { code: 204, status: "NO CONTENT", message: "No content found" },
  BAD_REQUEST: { code: 400, status: "BAD REQUEST", message: "Bad request" },
  ALREADY_EXISTS: {
    code: 417,
    status: "ALREADY EXISTS",
    message: "Resource already exists",
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    status: "UNPROCESSABLE ENTITY",
    message: "Unprocessable entity",
  },
  NOT_FOUND: { code: 404, status: "NOT FOUND", message: "Resource not found" },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    status: "INTERNAL SERVER ERROR",
    message: "Internal server error",
  },
};

export { Response, HttpStatus };

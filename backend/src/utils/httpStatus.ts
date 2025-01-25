type status = {
  OK: number;
  CREATED: number;
  BAD_REQUEST: number;
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  NOT_FOUND: number;
  INTERNAL_SERVER_ERROR: number;
};

const HttpStatus: status = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

Object.freeze(HttpStatus);

export default HttpStatus;

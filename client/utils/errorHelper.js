export const errorsConversion = (errors) => {
  // This function convert an array of errors to an object
  let errorsObj = {};
  errors.forEach((err) => {
    const key = err.path;
    errorsObj[key] = err.msg;
  });
  return errorsObj;
};

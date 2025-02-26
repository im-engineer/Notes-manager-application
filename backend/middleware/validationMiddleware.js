// This middleware is used to validate the request body against a Joi schema
const validate = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = validate; 
const Joi = require('joi');

const nominationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 255 characters'
    }),
  
  course: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Course is required',
      'string.min': 'Course must be at least 2 characters long',
      'string.max': 'Course cannot exceed 255 characters'
    }),
  
  phone_no: Joi.string()
    .pattern(/^[+]?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be 10-15 digits'
    }),
  
  domain: Joi.string()
    .valid(
      'Sponsorship & Marketing',
      'Social Media Team',
      'UI/UX',
      'App Dev',
      'Web Dev',
      'Cybersecurity Team'
    )
    .required()
    .messages({
      'any.only': 'Domain must be one of: Sponsorship & Marketing, Social Media Team, UI/UX, App Dev, Web Dev, Cybersecurity Team',
      'string.empty': 'Domain is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  insta_id: Joi.string()
    .min(1)
    .max(255)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Instagram ID cannot exceed 255 characters'
    }),
  
  github_id: Joi.string()
    .min(1)
    .max(255)
    .allow('')
    .optional()
    .messages({
      'string.max': 'GitHub ID cannot exceed 255 characters'
    }),
  
  gender: Joi.string()
    .valid('Male', 'Female', 'Others')
    .required()
    .messages({
      'any.only': 'Gender must be Male, Female, or Others',
      'string.empty': 'Gender is required'
    })
});

const validateNomination = (data) => {
  return nominationSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateNomination,
  nominationSchema
};

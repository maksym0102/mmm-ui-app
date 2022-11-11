const rules = require("../assets/data/validator.json");
const { STATUSES, CONSOLE_MESSAGE_TYPES } = require("./constants");

module.exports.validateModElement = (projectData) => {
  let errors = [];
  Object.keys(rules).forEach(function(key) {
    if (key in projectData) {
      projectData[key].map((projectItem) => {
        rules[key].map((ruleItem) => {
          const result = validateItem(projectItem, ruleItem);
          if (result) {
            errors.push(result);
          }
        });
      });
    } else {
      errors.push({
        message: `${key} item does not exist.`,
        status: STATUSES.ERROR
      });
    }
  });
  return errors;
};

const validateItem = (item, rule) => {
  const property = rule.property;
  const data = item.data
  if (property in data) {
    if (rule.required && data[property] === "" && !data[property]) {
      return {
        message: `${item.type}->${item.name}->${property} is not valid.`,
        status: STATUSES.ERROR
      };
    }
  } else {
    return {
      message: `${item.type}->${item.name}->${property} does not exist.`,
      status: STATUSES.ERROR
    };
  }
}
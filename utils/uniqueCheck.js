/**
 * Check if a value is unique in the specified model's collection.
 * 
 * @param {Object} model - The Mongoose model to check against
 * @param {string} field - The field to check (e.g., 'email', 'username')
 * @param {string} value - The value to check for uniqueness
 * @param {string} [excludeId] - Optional ID to exclude from the check (useful for updates)
 * @returns {Promise<boolean>} - Returns `true` if the value is unique, `false` otherwise
 * @throws {Error} - Throws error if model or field is invalid
 */
const isUnique = async (model, field, value, excludeId = null) => {
  // Validate inputs
  if (!model || !field || value === undefined) {
    throw new Error('Model, field, and value are required');
  }

  // Check if the field exists in the model's schema
  if (!model.schema.paths[field]) {
    throw new Error(`Field '${field}' does not exist in the model schema`);
  }

  // Build the query
  const query = { [field]: value };

  // If excludeId is provided, exclude that document from the check
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  try {
    const existingRecord = await model.findOne(query);
    return !existingRecord; // Return true if no record is found (value is unique)
  } catch (error) {
    throw new Error(`Error checking uniqueness: ${error.message}`);
  }
};

module.exports = isUnique;
const { Lead } = require("@models");
const sendResponse = require("@utils/sendResponse");

// Create a new lead

const save = async (req, res) => {
  //* Saves Lead into the database.
  const { businessUnit_id, customerName,phoneNumber,gender,occupation_id } = req.body;
  try {
    const data = await createData(Occupation, { name, description });
    sendResponse(res, 201, data);
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
};

// Fetch all leads by pagination

// Fetch a lead by ID

// Update a lead by ID

// Delete a lead by ID

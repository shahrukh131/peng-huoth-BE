const { Lead, User, BusinessUnit, LeadStatus, Occupation } = require("@models");
const sendResponse = require("@utils/sendResponse");
const { log } = require("winston");
const { createData, getPaginatedData } = require("../utils/GenericMethods");



const save = async (req, res) => {
  //* Saves Lead into the database.
  const {
    business_unit_id,
    customer_name,
    phone_number,
    gender,
    occupation_id,
    remarks,
    user_id,
    lead_status_id,
  } = req.body;
  try {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ["email", "staff_name"],
      raw: true,
    });

    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }

    const data = await createData(Lead, {
      business_unit_id,
      customer_name,
      phone_number,
      gender,
      occupation_id,
      remarks,
      lead_status_id,
      created_by_email: user.email,
      created_by_dn: user.staff_name,
    });

    sendResponse(res, 201, data);
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
};

// Fetch all leads by pagination
const findAllPaginatedLeads = async (req, res) => {
  try {
    let { limit, page, ...filters } = req.query;
    limit = parseInt(limit, 10) || 10;
    page = parseInt(page, 10) || 1;
    const offset = limit * (page - 1);

    const filter = {
      page,
      limit,
      offset,
      where: { active: true, ...filters },  
    };

    const includes = [
      {
        model: BusinessUnit,
        attributes: ['name'],
      },
      {
        model: Occupation,
        attributes: ['name'] 
      },
      {
        model: User, 
        as: "createdLeads", 
        attributes: ["id", "email", "staff_name"], 
      },
      {
        model: LeadStatus, 
        attributes: ["id", "name"], 
      }
    ];

    const data = await getPaginatedData(Lead, filter, includes);

    
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

// Fetch a lead by ID

// Update a lead by ID

// Delete a lead by ID

module.exports = {
  save,
  findAllPaginatedLeads,
};

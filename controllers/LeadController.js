const { Lead, User, BusinessUnit, LeadStatus, Occupation } = require("@models");
const sendResponse = require("@utils/sendResponse");

const {
  createData,
  getPaginatedData,
  getData,
  updatedData,
  deletedData,
} = require("../utils/GenericMethods");
const { Sequelize } = require("sequelize");


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

//* Fetch all leads by pagination
const findAllPaginatedLeads = async (req, res) => {
  console.log("Find all paginated leads endpoint hit");
  
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
        attributes: ["name"],
      },
      {
        model: Occupation,
        attributes: ["name"],
      },
      {
        model: User,
        as: "createdLeads",
        attributes: ["id", "email", "staff_name"],
      },
      {
        model: LeadStatus,
        attributes: ["id", "name"],
      },
    ];

    const data = await getPaginatedData(Lead, filter, includes);

    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//* Fetch a lead by ID
const findLeadById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getData(Lead, { id: id });
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//* Update a lead by ID
const updateLead = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await updatedData(Lead, { id: id }, req.body);
    sendResponse(res, 200, data, null, "successfully updated!");
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//* Delete a lead by ID

const deleteLead = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await deletedData(Lead, { id: id });
    sendResponse(res, 200, data, null, "successfully deleted!");
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};



//* Find All Leads with specific Lead Status
const findAllLeadsByStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    let { limit, page, ...filters } = req.query;
    limit = parseInt(limit, 10) || 10;
    page = parseInt(page, 10) || 1;
    const offset = limit * (page - 1);

    const filter = {
      page,
      limit,
      offset,
      where: { active: true, lead_status_id: statusId, ...filters },
    };
    const includes = [
      {
        model: BusinessUnit,
        attributes: ["name"],
      },
      {
        model: Occupation,
        attributes: ["name"],
      },
      {
        model: User,
        as: "createdLeads",
        attributes: ["id", "email", "staff_name"],
      },
      {
        model: LeadStatus,
        attributes: ["id", "name"],
      },
    ];
    const data = await getPaginatedData(Lead, filter, includes);
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//*Find All Leads with specific Business Unit

const findAllLeadsByBusinessUnit = async (req, res) => {
  try {
    const { businessUnitId } = req.params;
    let { limit, page, ...filters } = req.query;
    limit = parseInt(limit, 10) || 10;
    page = parseInt(page, 10) || 1;
    const offset = limit * (page - 1);

    const filter = {
      page,
      limit,
      offset,
      where: { active: true, business_unit_id: businessUnitId, ...filters },
    };
    const includes = [
      {
        model: BusinessUnit,
        attributes: ["name"],
      },
      {
        model: Occupation,
        attributes: ["name"],
      },
      {
        model: User,
        as: "createdLeads",
        attributes: ["id", "email", "staff_name"],
      },
      {
        model: LeadStatus,
        attributes: ["id", "name"],
      },
    ];
    const data = await getPaginatedData(Lead, filter, includes);
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};


const getLeadCount = async (req, res) => {
  try {
    const businessUnitsWithLeadCounts = await BusinessUnit.findAll({
      attributes: ["id", "name", [Lead.sequelize.fn("COUNT", Lead.sequelize.col("Leads.id")), "lead_count"]],
      include: [
        {
          model: Lead,
          attributes: [],
          where: { active: true },
          required: false, // Include business units even if they have no leads
        },
      ],
      group: ["BusinessUnit.id"],
      raw: true,
    });

    const formattedResults = businessUnitsWithLeadCounts.map(unit => ({
      id: unit.id,
      business_unit_name: unit.name,
      count: parseInt(unit.lead_count, 10) || 0,
    }));

    sendResponse(res, 200, formattedResults);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//* Retrieves the count of leads by status for a specific business unit
const getLeadStatusCountByBusinessUnit = async (req, res) => {
  try {
    const {businessUnitId} = req.params;

    const leadCounts = await Lead.findAll({
      attributes: [
        [Sequelize.col('BusinessUnit.id'), 'business_unit_id'],
        [Sequelize.col('BusinessUnit.name'), 'business_unit_name'],
        [Sequelize.col('LeadStatus.name'), 'status'],
        [Sequelize.fn('COUNT', Sequelize.col('Lead.id')), 'count']
      ],
      include: [
        {
          model: BusinessUnit,
          attributes: []
        },
        {
          model: LeadStatus,
          attributes: []
        }
      ],
      where: {
        active: true,
        business_unit_id: businessUnitId
      },
      group: ['BusinessUnit.id', 'LeadStatus.id'],
      raw: true
    });
    // Transform the data
    const result = leadCounts.reduce((acc, curr) => {
      if (!acc.id) {
        acc.id = curr.business_unit_id;
        acc.business_unit_name = curr.business_unit_name;
        acc.status_counts = {};
      }
      acc.status_counts[curr.status] = parseInt(curr.count);
      return acc;
    }, {});

    sendResponse(res, 200, result || {
      id: parseInt(businessUnitId),
      business_unit_name: null,
      status_counts: {}
    });
    
  } catch (error) {
    sendResponse(res, 404, null, error.message);
    
  }
}


/**
 ** Retrieves paginated leads filtered by business unit id and lead status id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {string} req.params.businessUnitId - The id of the Business Unit
 * @param {string} req.params.statusId - The id of the Lead Status
 * @param {number} req.query.page - The page number to retrieve
 * @param {number} req.query.limit - The number of records per page
 */
const getLeadByBuAndStatus = async (req, res) => {
  try {
    const { businessUnitId, statusId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = limit * (page - 1);

    // Build where clause
    const whereClause = {
      active: true,
    };
    if (businessUnitId) {
      whereClause.business_unit_id = businessUnitId;
    }
    if (statusId) {
      whereClause.lead_status_id = statusId;
    }

    // Define includes
    const includes = [
      {
        model: BusinessUnit,
        attributes: ["name"],
        required: true,
      },
      {
        model: Occupation,
        attributes: ["name"],
        required: true,
      },
      {
        model: LeadStatus,
        attributes: ["id", "name"],
        required: true,
      },
    ];
    const filter = {
      where: whereClause,
      limit: limit,
      offset: offset,
      page: page,
      order: [["created_at", "DESC"]],
    };
    const result = await getPaginatedData(Lead, filter, includes);
    sendResponse(res, 200, result);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};



module.exports = {
  save,
  findAllPaginatedLeads,
  findLeadById,
  updateLead,
  deleteLead,
  findAllLeadsByStatus,
  findAllLeadsByBusinessUnit,
  getLeadCount,
  getLeadStatusCountByBusinessUnit,
  getLeadByBuAndStatus
};

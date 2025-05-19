const { Lead, User, BusinessUnit, LeadStatus, Occupation } = require("@models");
const sendResponse = require("@utils/sendResponse");

const {
  createData,
  getPaginatedData,
  getData,
  updatedData,
  deletedData,
  getCounts,
} = require("../utils/GenericMethods");
const { Sequelize } = require("sequelize");
const { sendLeadNotification } = require("../utils/telegramNotification");
const { sendPushNotification } = require("../utils/pushNotification");

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
    deviceToken,
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

    // Fetch lead with associations for notification
    const leadWithDetails = await Lead.findOne({
      where: { id: data.id },
      include: [
        { model: BusinessUnit },
        { model: LeadStatus },
        { model: Occupation },
      ],
    });
     if (!deviceToken) {
    return sendResponse(res, 400, null, "Device token is required.");
  }

    await sendPushNotification(
      deviceToken,
      "Lead Created",
      `Lead for ${data.customer_name} has been created.`
    );

    sendLeadNotification(leadWithDetails, "created").catch((error) =>
      console.error("Notification error:", error)
    );

    // Return response immediately
    return sendResponse(res, 201, data);
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
};

//* Fetch all leads by pagination
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

    const options = {
      attributes: {
        exclude: ["password", "created_by_user_id"],
        include: [
          [Sequelize.col("BusinessUnit.name"), "business_unit_name"],
          [Sequelize.col("Occupation.name"), "position"],
          [Sequelize.col("LeadStatus.name"), "lead_status_name"],
        ],
      },
      include: [
        {
          model: BusinessUnit,
          attributes: [], // Empty array means don't include any columns from this model
        },
        {
          model: Occupation,
          attributes: [],
        },
        {
          model: User,
          as: "createdLeads",
          attributes: [],
        },
        {
          model: LeadStatus,
          attributes: [],
        },
      ],
      raw: true, // Automatically flattens nested objects
      subquery: false,
    };

    const data = await getPaginatedData(Lead, filter, null, options);

    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//* Fetch a lead by ID
const findLeadById = async (req, res) => {
  try {
    const id = req.params.id;
    const options = {
      attributes: {
        exclude: ["password", "created_by_user_id"],
        include: [
          [Sequelize.col("BusinessUnit.name"), "business_unit_name"],
          [Sequelize.col("Occupation.name"), "position"],
          [Sequelize.col("LeadStatus.name"), "lead_status_name"],
        ],
      },
      include: [
        {
          model: BusinessUnit,
          attributes: [], // Don't include any columns from the BusinessUnit model in results
        },
        {
          model: Occupation,
          attributes: [],
        },
        {
          model: LeadStatus,
          attributes: [],
        },
      ],
      raw: true, // Automatically flattens nested objects
    };
    const data = await getData(Lead, { id: id }, null, options);
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//* Update a lead by ID
const updateLead = async (req, res) => {
  try {
    const id = req.params.id;
    const { user_id, deviceToken, ...updateFields } = req.body;

    const user = await User.findOne({
      where: { id: user_id },
      attributes: ["staff_name", "email"],
      raw: true,
    });

    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }

    updateFields.updated_by_dn = user.staff_name;
    updateFields.updated_by_email = user.email;

    console.log("Update Fields:", user);

    const data = await updatedData(Lead, { id: id }, updateFields);

    const leadWithDetails = await Lead.findOne({
      where: { id: id },
      include: [
        { model: BusinessUnit },
        { model: LeadStatus },
        { model: Occupation },
      ],
    });
    if (!deviceToken) {
       return sendResponse(res, 400, null, "Device token is required.");
    }
    await sendPushNotification(
      deviceToken,
      "Lead Updated",
      `Lead for ${leadWithDetails.customer_name} has been updated.`
    );

    sendLeadNotification(leadWithDetails, "updated").catch((error) =>
      console.error("Notification error:", error)
    );

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
    const options = {
      attributes: {
        exclude: ["password", "created_by_user_id"],
        include: [
          [Sequelize.col("BusinessUnit.name"), "business_unit_name"],
          [Sequelize.col("Occupation.name"), "position"],
          [Sequelize.col("LeadStatus.name"), "lead_status_name"],
          // [Sequelize.col('createdLeads.email'), 'created_by_email'],
          // [Sequelize.col('createdLeads.staff_name'), 'created_by_staff_name']
        ],
      },
      include: [
        {
          model: BusinessUnit,
          attributes: [], // Empty array means don't include any columns from this model
        },
        {
          model: Occupation,
          attributes: [],
        },
        {
          model: User,
          as: "createdLeads",
          attributes: [],
        },
        {
          model: LeadStatus,
          attributes: [],
        },
      ],
      raw: true, // Automatically flattens nested objects
      subquery: false,
    };
    const data = await getPaginatedData(Lead, filter, null, options);
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

const getLeadCount = async (req, res) => {
  try {
    const businessUnitsWithLeadCounts = await BusinessUnit.findAll({
      attributes: [
        "id",
        "name",
        [
          Lead.sequelize.fn("COUNT", Lead.sequelize.col("Leads.id")),
          "lead_count",
        ],
      ],
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

    const formattedResults = businessUnitsWithLeadCounts.map((unit) => ({
      id: unit.id,
      business_unit_name: unit.name,
      count: parseInt(unit.lead_count, 10) || 0,
    }));
    // const counts = await getCounts(
    //   BusinessUnit,
    //   ["id", "name"],
    //   { active: true },
    //   [
    //     {
    //       model: Lead,
    //       attributes: [],
    //       where: { active: true },
    //       required: false, // Include business units even if they have no leads
    //     },
    //   ]
    // );
    sendResponse(res, 200, formattedResults);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

//* Retrieves the count of leads by status for a specific business unit

const getLeadStatusCountByBusinessUnit = async (req, res) => {
  try {
    const { businessUnitId } = req.params;

    // First, get all possible lead statuses
    const allLeadStatuses = await LeadStatus.findAll({
      attributes: ["id", "name"],
      raw: true,
    });

    // Then get the counts for the specific business unit
    const leadCounts = await Lead.findAll({
      attributes: [
        [Sequelize.col("BusinessUnit.id"), "business_unit_id"],
        [Sequelize.col("BusinessUnit.name"), "business_unit_name"],
        [Sequelize.col("LeadStatus.id"), "status_id"],
        [Sequelize.col("LeadStatus.name"), "status"],
        [Sequelize.fn("COUNT", Sequelize.col("Lead.id")), "count"],
      ],
      include: [
        {
          model: BusinessUnit,
          attributes: [],
        },
        {
          model: LeadStatus,
          attributes: [],
        },
      ],
      where: {
        active: true,
        business_unit_id: businessUnitId,
      },
      group: ["BusinessUnit.id", "LeadStatus.id"],
      raw: true,
    });

    // Get business unit info
    let businessUnitInfo = {
      id: parseInt(businessUnitId),
      business_unit_name: null,
      status_counts: [],
    };

    // If we have data, extract the business unit info
    if (leadCounts.length > 0) {
      businessUnitInfo.id = leadCounts[0].business_unit_id;
      businessUnitInfo.business_unit_name = leadCounts[0].business_unit_name;
    } else {
      // If no leads found, try to get the business unit name
      const businessUnit = await BusinessUnit.findByPk(businessUnitId, {
        raw: true,
      });
      if (businessUnit) {
        businessUnitInfo.business_unit_name = businessUnit.name;
      }
    }

    // Convert lead counts to a map for easier lookup
    const statusCountMap = {};
    leadCounts.forEach((item) => {
      statusCountMap[item.status] = parseInt(item.count);
    });

    // Create status_counts array with all possible statuses
    businessUnitInfo.status_counts = allLeadStatuses.map((status) => ({
      id: status.id,
      lead_status: status.name,
      count: statusCountMap[status.name] || 0,
    }));

    sendResponse(res, 200, businessUnitInfo);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

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

    const options = {
      where: whereClause,
      limit,
      offset,
      page,
      order: [["created_at", "DESC"]],
      attributes: {
        exclude: ["password", "created_by_user_id"],
        include: [
          [Sequelize.col("BusinessUnit.name"), "business_unit_name"],
          [Sequelize.col("Occupation.name"), "position"],
          [Sequelize.col("LeadStatus.name"), "lead_status_name"],
        ],
      },
      include: [
        {
          model: BusinessUnit,
          attributes: [],
          required: true,
        },
        {
          model: Occupation,
          attributes: [],
          required: true,
        },
        {
          model: LeadStatus,
          attributes: [],
          required: true,
        },
      ],
      raw: true, // Automatically flattens nested objects
      distinct: true, // Ensures correct count with joins
    };
    const filter = {
      where: whereClause, //active: true
      limit: limit,
      offset: offset,
      page: page,
      order: [["created_at", "DESC"]],
    };
    const result = await getPaginatedData(Lead, filter, null, options);
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
  getLeadByBuAndStatus,
};

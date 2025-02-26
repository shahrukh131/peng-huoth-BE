const { User } = require("@models");
const sendResponse = require("@utils/sendResponse");
const {
  getData,
  createData,
  updatedData,
  deletedData,
  getPaginatedData,
} = require("../utils/GenericMethods");

// const save = async (req, res) => {
//   //* Saves occupation into the database.
//   const { name, description } = req.body;
//   try {
//     const data = await createData(Occupation, { name, description });
//     sendResponse(res, 201, data);
//   } catch (error) {
//     sendResponse(res, 400, null, error);
//   }
// };

const findAllUsers = async (req, res) => {
  //* Fetch all occupations from users table
  try {
    const data = await getData(User);
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 400, null, error.message);
  }
};

const findAllPaginatedUsers = async (req, res) => {
  try {
    let query = req.query;
    query.limit = parseInt(query.limit, 10) || 10;
    query.page = parseInt(query.page, 10) || 1;
    query.offset = query.limit * (query.page - 1);
    const data = await getPaginatedData(User, { ...query });
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};
const findUserById = async (req, res) => {
  //* Fetch specific user from Users table
  try {
    const id = req.params.id;
    const data = await getData(User, { id: id });
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};
const findUserByStaffId = async (req, res) => {
  //* Fetch specific user from Users table
  try {
    const id = req.params.id;
    const data = await getData(User, { staff_id: id });
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

const updateUser = async (req, res) => {
  //*Update User BY ID
  try {
    const id = req.params.id;
    const { staff_name, password } = req.body;
    const data = await updatedData(User, { id: id },  { staff_name,  password });
    sendResponse(res, 200, data, null, "successfully updated!");
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
};

const deleteUser = async (req, res) => {
  //*Delete User By ID
  try {
    const id = req.params.id;
    const data = await deletedData(User, { id: id });
    sendResponse(res, 200, data, null, "successfully deleted!");
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

module.exports = {
  findAllUsers,
  updateUser,
  deleteUser,
  findUserById,
  findUserByStaffId,
  findAllPaginatedUsers,
};

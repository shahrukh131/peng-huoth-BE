const { Occupation } = require("@models");
const sendResponse = require("@utils/sendResponse");
const {
  getData,
  createData,
  updatedData,
  deletedData,
  getPaginatedData,
} = require("../utils/GenericMethods");

const save = async (req, res) => {
  //* Saves occupation into the database.
  const { name, description } = req.body;
  try {
    const data = await createData(Occupation, { name, description });
    sendResponse(res, 201, data);
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
};

const findAllOccupations = async (req, res) => {
  //* Fetch all occupations from occupations table
  try {
    const data = await getData(Occupation);
    sendResponse(res, 200, data,null);
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
};

// const findAllPaginatedBooks = async (req, res) => {
//   try {
//     let query = req.query;
//     query.limit = parseInt(query.limit, 10) || 10;
//     query.page = parseInt(query.page, 10)  || 1;
//     query.offset = query.limit * (query.page - 1);
//     const data = await getPaginatedData(Book, { ...query });
//     sendSuccess(res, 200, "Successfully Fetched", data);
//   } catch (error) {
//     sendError(res, 404, error.message);
//   }
// };
const findOccupationById = async (req, res) => {
  //* Fetch specific book from BOOKS table
  try {
    const id = req.params.id;
    const data = await getData(Occupation, { id: id });
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

const updateOccupation = async (req, res) => {
  //*Update Ocupation BY ID
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    const data = await updatedData(
      Occupation,
      { id: id },
      { title,  description }
    );
    sendResponse(res, 200, data,null, "successfully updated!");

  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

const deleteOccupation = async (req, res) => {
  //*Delete Ocupation By ID
  try {
    const id = req.params.id;
    const data = await deletedData(Occupation, { id: id });
    sendResponse(res, 200, data,null, "successfully deleted!");
  } catch (error) {
    sendResponse(res, 404, null, error.message);
  }
};

module.exports = {
  save,
  findAllOccupations,
  updateOccupation,
  deleteOccupation,
  findOccupationById,
  //   findAllPaginatedBooks,
};

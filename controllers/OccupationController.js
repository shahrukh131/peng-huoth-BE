const { Occupation } = require("@models");
const  sendResponse  = require("@utils/sendResponse");
const {
  getData,
  createData,
  updatedData,
  deletedData,
  getPaginatedData,
} = require("../utils/GenericMethods");

// const save = async (req, res) => {
//   //* Saves occupation into the database.
//   const { title, author, description } = req.body;
//   try {
//     const data = await createData(Book, { title, author, description });
//     sendSuccess(res, 200, "Successfully Created", data);
//   } catch (error) {
//     sendError(res, 500, error.message);
//   }
// };

const findAllOccupations = async (req, res) => {
  //* Fetch all occupations from occupations table
  try {
    const data = await getData(Occupation);
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 404, null, error.message);
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
// const findBookById = async (req, res) => {
//   //* Fetch specific book from BOOKS table
//   try {
//     const id = req.params.id;
//     const data = await getData(Book, { id: id });
//     sendSuccess(res, 200, "Successfully Fetched", data);
//   } catch (error) {
//     sendError(res, 404, error.message);
//   }
// };

// const updateBook = async (req, res) => {
//   //*Update Book BY ID
//   try {
//     const id = req.params.id;
//     const { title, author, description } = req.body;
//     const data = await updatedData(
//       Book,
//       { id: id },
//       { title, author, description }
//     );
//     sendSuccess(res, 200, "successfully updated!");
//   } catch (error) {
//     sendError(res, 404, error.message);
//   }
// };

// const deleteBook = async (req, res) => {
//   //*Delete Book By ID
//   try {
//     const id = req.params.id;
//     const data = await deletedData(Book, { id: id });
//     sendSuccess(res, 200, "successfully Deleted!");
//   } catch (error) {
//     sendError(res, 404, error.message);
//   }
// };

module.exports = {
//   save,
  findAllOccupations,
//   updateBook,
//   deleteBook,
//   findBookById,
//   findAllPaginatedBooks,
};

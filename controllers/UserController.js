const { User } = require("@models");
const path = require("path");
const sendResponse = require("@utils/sendResponse");
const {
  getData,
  createData,
  updatedData,
  deletedData,
  getPaginatedData,
  generateExcel,
  handleFileUpload,
} = require("../utils/GenericMethods");
const { generateHashedPassword } = require("../utils/GenerateHash");
const { removeOldProfileImage } = require("../utils/upload");


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
    const { id } = req.params;
    let { staff_name, password } = req.body;
    let updateFields = { staff_name };


     // Get current user data to find old profile image
     const currentUser = await getData(User, { id });
    
     if (!currentUser || currentUser.length === 0) {
       return sendResponse(res, 400, null, "User not found.");
     }
    //  console.log(currentUser[0].profile_image);
     

    // Hash password only if it's provided
    if (password) {
      updateFields.password = await generateHashedPassword(password);
    }

    // Handle profile image upload
    if (req.file) {
      // Remove old profile image if exists
      if (currentUser[0]?.profile_image) {
        const oldImagePath = path.join(__dirname, '..', 'public', currentUser[0].profile_image);
        removeOldProfileImage(oldImagePath);
      }
      const fileData = await handleFileUpload(req.file);
      if (fileData && !fileData.error) {
        updateFields.profile_image = fileData.path;
      } else {
        return sendResponse(res, 400, null, "Failed to upload profile image");
      }
    }

   
    

    // Update user record in DB
    const data = await updatedData(User, { id }, updateFields);

    // Handle case when user is not found
    if (!data) {
      return sendResponse(res, 404, null, "User not found.");
    }

    return sendResponse(res, 200, data, null, "Successfully updated!");
  } catch (error) {
    console.error("Update User Error:", error);
    return sendResponse(res, 500, null, "Failed to update user.");
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

const exportUser = async (req, res) => {
  try {
    const users = await getData(User);
    // Define columns (optional)
    const columns = [
      { header: "ID", key: "id" },
      { header: "StaffID", key: "staff_id" },
      { header: "Staff Name", key: "staff_name" },
      { header: "Email", key: "email" },
    ];
   const data = await generateExcel(
      {
        data: users,
        columns: columns,
        sheetName: "User List",
        fileName: "users-export",
        styling: {
          headerColor: "FF4472C4", // Hex color code
        },
      },
      res
    );
    
    sendResponse(res, 200, data, null, "Successfully exported!");
  } catch (error) {
    sendResponse(res, 400, null, error.message);
  }
};

module.exports = {
  findAllUsers,
  updateUser,
  deleteUser,
  findUserById,
  findUserByStaffId,
  findAllPaginatedUsers,
  exportUser,
};

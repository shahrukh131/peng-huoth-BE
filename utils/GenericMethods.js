const { logger } = require("sequelize/lib/utils/logger");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { raw } = require("../validations/occupation");
const { Sequelize } = require("sequelize");

const createData = async (modelName, data) => {
  const res = await modelName.create(data);
  return res;
};

const getData = async (modelName, filter, includes, options = {}) => {
  const queryOptions = {
    where: filter || null,
    ...options,
  };

  // If includes is provided and options doesn't override it
  if (includes && !options.include) {
    queryOptions.include = includes;
  }

  const data = await modelName.findAll(queryOptions);
  return data;
};

const getPaginatedData = async (modelName, filter, includes, options = {}) => {
  const queryOptions = {
    ...filter,
    ...options,
  };

  // If includes is provided and options doesn't override it
  if (includes && !options.include) {
    queryOptions.include = includes;
  }
  const data = await modelName.findAndCountAll(queryOptions);
  const totalPages = Math.ceil(data.count / filter.limit);

  return {
    count: data.count, // Total count of records
    rows: data.rows,
    pagination: {
      totalPages, // Total number of pages
      currentPage: filter.page || 1, // Current page
      limit: filter.limit, // Records per page
    },
  };
};

const updatedData = async (modelName, filter, newData) => {
  const res = await modelName.update(newData, {
    where: filter ? filter : null,
  });
  return res;
};
const deletedData = async (modelName, filter, newData) => {
  const res = await modelName.destroy({
    where: filter ? filter : null,
  });
  return res;
};

/**
 * Creates multiple records in the given model using the provided dataArray.
 * @param {Sequelize.Model} modelName - The Sequelize model to create records in.
 * @param {Array<Object>} dataArray - The array of objects to create records from.
 * @param {Object} [options] - Optional Sequelize bulkCreate options.
 * @returns {Promise<Array<Sequelize.Instance>>} - The created records.
 * @throws {Error} - If there is an error in creating the records.
 */
const createBulkData = async (modelName, dataArray, options = {}) => {
  try {
    const result = await modelName.bulkCreate(dataArray, {
      ...options,
      returning: true,
    });
    return result;
  } catch (error) {
    logger.error("Error in createBulkData:", error);
    throw error;
  }
};

/**
 * The function `generateExcel` creates an Excel file with provided data, columns, and styling, and
 * saves it to a specified directory for download.
 * @param res - The `res` parameter in the `generateExcel` function is typically used to send the
 * generated Excel file back as a response in a web application. It is commonly used in server-side
 * applications to send the file to the client for download.
 * @returns The function `generateExcel` is returning a download link for the generated Excel file. The
 * download link is constructed using the file name provided in the function parameters and the base
 * URL `http://localhost:8000/downloads/`.
 */
const generateExcel = async (
  {
    data = [],
    columns,
    sheetName = "Sheet1",
    styling = {},
    fileName = "export",
  },
  res
) => {
  try {
    //* Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    //* Set columns - if not provided, generate from data
    if (columns && Array.isArray(columns)) {
      worksheet.columns = columns;
    } else if (data.length > 0) {
      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
      }));
    }

    //* Add rows
    worksheet.addRows(data);

    //* Apply header
    if (styling.header !== false) {
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };

      //* Apply custom header styling if provided
      if (styling.headerColor) {
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: styling.headerColor },
        };
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      }

      headerRow.commit();
    }

    const saveDir = path.join(__dirname, "..", "public", "downloads");

    console.log(saveDir);

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true }); // Ensure the entire path is created
    }

    const filePath = path.join(saveDir, `${fileName}.xlsx`);

    console.log(filePath);

    await workbook.xlsx.writeFile(filePath);

    const downloadLink = `http://localhost:8000/downloads/${fileName}.xlsx`;

    return downloadLink;
  } catch (error) {
    console.error("Error in generateExcel:", error);
    throw error;
  }
};

const handleFileUpload = async (files) => {
  try {
    if (!files || Object.keys(files).length === 0) {
      return { error: "No files were uploaded." };
    }
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const processFile = (file) => {
      const originalName = file.originalname;
      const ext = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, ext);

      // Check if file exists and append timestamp if needed
      let finalFilename = originalName;
      if (fs.existsSync(path.join(uploadDir, originalName))) {
        finalFilename = `${nameWithoutExt}-${Date.now()}${ext}`;
      }

      // Move file to uploads directory
      const finalPath = path.join(uploadDir, finalFilename);
      fs.renameSync(file.path, finalPath);

      return {
        filename: finalFilename,
        path: `/uploads/${finalFilename}`,
        size: file.size,
        mimetype: file.mimetype,
      };
    };
    if (Array.isArray(files)) {
      return files.map(processFile);
    } else {
      return processFile(files);
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    throw error;
  }
};

const createDataWithFiles = async (modelName, data, files) => {
  try {
    // Handle File Upload FIrst
    const fileData = await modelName.handleFileUpload(files);
    // Merge data with fileData
    const mergedData = { ...data, files: fileData };
    // Create record with db
    const result = await modelName.create(mergedData);
    return result;
  } catch (error) {
    console.error("Error in createDataWithFiles:", error);
    throw error;
  }
};

const getCounts = async (model, groupBy, whereClause = {}, include = []) => {
  try {
    const counts = await model.findAll({
      attributes: [
        ...groupBy,
        [Sequelize.fn("COUNT", Sequelize.col(`${model.name}.id`)), "count"],
      ],
      where: whereClause,
      include: include,
      group: groupBy,
      raw: true,
    });
    return counts.map((item) => ({
      ...item,
      count: parseInt(item.count, 10),
    }));
  } catch (error) {
    console.error("Error in getCounts:", error);
    throw error;
  }
};

module.exports = {
  getData,
  createData,
  updatedData,
  deletedData,
  getPaginatedData,
  createBulkData,
  generateExcel,
  handleFileUpload,
  createDataWithFiles,
  getCounts,
};

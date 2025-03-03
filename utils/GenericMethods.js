const { logger } = require("sequelize/lib/utils/logger");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { send } = require("process");

const createData = async (modelName, data) => {
  const res = await modelName.create(data);
  return res;
};

const getData = async (modelName, filter, includes) => {
  const data = await modelName.findAll({
    where: filter ? filter : null,
    include: includes ? includes : null,
  });
  return data;
};

const getPaginatedData = async (modelName, filter, includes) => {
  const data = await modelName.findAndCountAll({
    ...filter,
    include: includes ? includes : null,
  });
  return data;
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
 
   
    const saveDir = path.join(__dirname, '..', 'public', 'downloads');

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

module.exports = {
  getData,
  createData,
  updatedData,
  deletedData,
  getPaginatedData,
  createBulkData,
  generateExcel,
};

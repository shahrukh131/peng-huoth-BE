
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
  
  
  module.exports = {
    getData,
    createData,
    updatedData,
    deletedData,
    getPaginatedData,
  };
  
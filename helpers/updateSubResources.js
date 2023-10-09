const { Op } = require('sequelize');

async function updateSubResources({model, foreignKey, mainResourceId, resources, transaction}) {

  // Split resources into existing resources (to be updated) and new resources (to be created)
  const existing = [];
  const createNew = [];
  for (let resource of resources) {
    if (resource.id) {
      existing.push(resource);
    } else {
      createNew.push(resource);
    }
  }

  // Remove deleted sub-entities
  await model.destroy({
    where: {
      id: { [Op.notIn]: existing.map(el => el.id) },
      [foreignKey]: +mainResourceId
    },
    transaction
  })

  // Update sub-entity details
  await Promise.all(existing.map(el => {
    return model.update({
      ...el,
      [foreignKey]: mainResourceId
    }, {
      where: {
        id: el.id,
        [foreignKey]: +mainResourceId
      },
      transaction
    })
  }));

  // Add new sub-entities
  // await Promise.all(createNew.map(el => {
  //   return model.create({
  //     ...el,
  //     [foreignKey]: mainResourceId
  //   }, {
  //     transaction
  //   })
  // }));
  await model.bulkCreate(createNew.map(el => ({
    ...el, 
    [foreignKey]: +mainResourceId
  })), {
    validate: true,
    transaction
  });

}

module.exports = updateSubResources;
import { DataTypes, Model } from '@sequelize/core';
import { createSequelize7Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';

// This issue only affects MSSQL.
export const testingOnDialects = new Set(['mssql']);

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize7Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Foo extends Model {}

  Foo.init({
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Foo',
  });

  await sequelize.sync({ force: true });

  // Create and persist an instance in the Foo table.
  await Foo.create({name: 'bar'});

  // We expect findAll() to return no result if the limit is 0.
  // This is not the case on MSSQL, the instance is returned.
  const results = await Foo.findAll({limit: 0});
  expect(results.length).to.equal(0);
}

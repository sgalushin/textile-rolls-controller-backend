module.exports = {
  mode: "production",
  entry: {
    createRoll: "./build/lambda-handlers/create-roll.js",
    getRoll: "./build/lambda-handlers/get-roll.js",
    updateRoll: "./build/lambda-handlers/update-roll.js",
    getRefsWithoutSaving: "./build/lambda-handlers/get-refs-without-saving",
    getAllRollsByDate: "./build/lambda-handlers/get-all-rolls-by-date",
    getAllRollsByPhysicalId: "./build/lambda-handlers/get-all-rolls-by-physical-id",
    createDescendantRoll: "./build/lambda-handlers/create-descendant-roll.js",
  },
  target: "node",
  output: {
    library: {
      name: "lambdaHandler",
      type: "umd",
    },
    filename: (pathData, assetInfo) => `${pathData.runtime}/lambda.js`,
  },
};

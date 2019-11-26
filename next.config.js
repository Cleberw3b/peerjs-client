const node_env = process.env.NODE_ENV;
const isDevelopment = node_env === "development";
const isProduction = node_env === "production";
const isTest = node_env === "test";

if (isDevelopment) {
  require("dotenv").config();
}

exports.default = {
  distDir: "build",
  target: "serverless",
  env: {
    TEST: process.env.TEST
  }
};

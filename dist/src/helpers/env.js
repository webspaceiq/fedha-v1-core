"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_DEPLOY_PARAMS = exports.DETERMINISTIC_DEPLOYMENT = exports.MARKET_NAME = exports.ConfigNames = void 0;
var ConfigNames;
(function (ConfigNames) {
    ConfigNames["Commons"] = "Commons";
    ConfigNames["Fedha"] = "Fedha";
    ConfigNames["Test"] = "Test";
    ConfigNames["Polygon"] = "Polygon";
})(ConfigNames = exports.ConfigNames || (exports.ConfigNames = {}));
exports.MARKET_NAME = process.env.MARKET_NAME || ConfigNames.Fedha;
exports.DETERMINISTIC_DEPLOYMENT = process.env.DETERMINISTIC_DEPLOYMENT
    ? process.env.DETERMINISTIC_DEPLOYMENT === "true"
    : null;
exports.COMMON_DEPLOY_PARAMS = {
    log: true,
    deterministicDeployment: exports.DETERMINISTIC_DEPLOYMENT ?? false,
};

export enum ConfigNames {
    Commons = "Commons",
    Fedha = "Fedha",
    Test = "Test",
    Polygon = "Polygon",
}

export const MARKET_NAME =
    (process.env.MARKET_NAME as ConfigNames) || ConfigNames.Fedha;

export const DETERMINISTIC_DEPLOYMENT = process.env.DETERMINISTIC_DEPLOYMENT
    ? process.env.DETERMINISTIC_DEPLOYMENT === "true"
    : null;

export const COMMON_DEPLOY_PARAMS = {
    log: true,
    deterministicDeployment: DETERMINISTIC_DEPLOYMENT ?? false,
};
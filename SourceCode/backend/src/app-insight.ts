import * as appInsights from "applicationinsights";

const connectionString =
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
console.log("ENV CHECK:", process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);

if (!connectionString) {
    console.warn("APPLICATIONINSIGHTS_CONNECTION_STRING is not set");
} else {
    appInsights
        .setup(connectionString)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .start();

    console.log("Application Insights started");
}

export default appInsights;
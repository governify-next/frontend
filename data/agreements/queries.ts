export const signatureStatesQuery = (
  signatureIds: string[],
  from: Date,
  to: Date,
) => `SELECT time, "signatureId", "stateId", "numericExpressionValue", "complianceStatus", "consolidated"
FROM "states"
WHERE "signatureId" IN (${signatureIds.map((id) => `'${id}'`).join(", ")})
  AND time >= '${from.toISOString()}' AND time < '${to.toISOString()}'
  AND "numericExpressionValueAvailable" = TRUE
ORDER BY time`;

export const signatureComplianceQuery = (
  signatureIds: string[],
  from: Date,
  to: Date,
) => {
  const inRange = `time >= '${from.toISOString()}' AND time < '${to.toISOString()}'`;
  return `SELECT "signatureId",
    COUNT(*) AS "total",
    SUM(CASE WHEN "complianceStatus" = 'COMPLIANT' THEN 1 ELSE 0 END) AS "compliant",
    SUM(CASE WHEN ${inRange} THEN 1 ELSE 0 END) AS "totalInRange",
    SUM(CASE WHEN ${inRange} AND "complianceStatus" = 'COMPLIANT' THEN 1 ELSE 0 END) AS "compliantInRange"
FROM "states"
WHERE "signatureId" IN (${signatureIds.map((id) => `'${id}'`).join(", ")})
  AND "consolidated" = TRUE
  AND "complianceStatus" IN ('COMPLIANT', 'NON_COMPLIANT')
GROUP BY "signatureId"`;
};

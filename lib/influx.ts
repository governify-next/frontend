import "server-only";

import { InfluxDBClient } from "@influxdata/influxdb3-client";
import { bootEnv } from "./bootConfig";
import { Result } from "./utils/fetcher";
import { getLogger } from "./utils/logger";

const logger = getLogger().setTag("influx.ts");

const client = new InfluxDBClient({
  host: bootEnv.INFLUX_URL,
  token: bootEnv.INFLUX_TOKEN,
  authScheme: "Bearer",
  database: bootEnv.INFLUX_DATABASE,
});

export const influxFetcher = async <Row, T>(
  sql: string,
  map: (row: Row) => T,
): Promise<Result<T[]>> => {
  try {
    const rows = await Array.fromAsync(client.query(sql));
    return { ok: true, data: rows.map((row) => map(row as Row)) };
  } catch (error) {
    logger.error(`Failed to query InfluxDB. Query: ${sql}.`, error);
    return {
      ok: false,
      error: "Unknown error while querying data.",
      status: 500,
    };
  }
};

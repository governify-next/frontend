import "server-only";

import { InfluxDBClient, type QParamType } from "@influxdata/influxdb3-client";
import { bootEnv } from "./bootConfig";

const client = new InfluxDBClient({
  host: bootEnv.INFLUX_URL,
  token: bootEnv.INFLUX_TOKEN,
  authScheme: "Bearer",
  database: bootEnv.INFLUX_DATABASE,
});

export const queryInflux = (
  sql: string,
  params?: Record<string, QParamType>,
) => client.query(sql, undefined, { type: "sql", params });

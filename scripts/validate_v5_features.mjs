import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";

const schema = JSON.parse(fs.readFileSync("docs/v5_features.schema.json","utf8"));
const data = JSON.parse(fs.readFileSync("docs/v5_features.json","utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const ok = validate(data);
if (!ok) {
  console.error("v5_features.json failed schema validation:\n", validate.errors);
  process.exit(1);
}
console.log("v5_features.json ✔ validated");
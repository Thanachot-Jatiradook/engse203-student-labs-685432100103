import fs from "node:fs/promises";
import path from "node:path";
import { ROOT, readJson, writeJson } from "./common.mjs";

const args = process.argv.slice(2);
const get = (name) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : "";
};

const studentId = get("student-id").trim();
const studentName = get("name").trim();
const section = get("section").trim().toUpperCase();
const githubUsername = get("github").trim();

if (!/^\d{8,13}$/.test(studentId)) throw new Error("--student-id ต้องเป็นตัวเลข 8–13 หลัก");
if (studentName.length < 3) throw new Error("กรุณาระบุ --name \"ชื่อ นามสกุล\"");
if (!/^SEC[A-Z0-9-]+$/.test(section)) throw new Error("--section ใช้รูปแบบ SEC1 หรือ SEC-A");
if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(githubUsername)) throw new Error("--github ไม่ใช่ GitHub username ที่ถูกต้อง");

const repositoryName = `engse203-student-labs-${studentId}`;
const configPath = path.join(ROOT, "student-config.json");
const config = await readJson(configPath);
Object.assign(config, { studentId, studentName, section, githubUsername, repositoryName });
await writeJson(configPath, config);

const profile = `# Student Profile

| รายการ | ข้อมูล |
|---|---|
| รายวิชา | ENGSE203 การเขียนโปรแกรมสำหรับวิศวกรซอฟต์แวร์ |
| รหัสนักศึกษา | ${studentId} |
| ชื่อ-นามสกุล | ${studentName} |
| Section | ${section} |
| GitHub Username | ${githubUsername} |
| Repository | \`${repositoryName}\` |
| Pages Hub | https://${githubUsername}.github.io/${repositoryName}/ |
`;
await fs.writeFile(path.join(ROOT, "STUDENT_PROFILE.md"), profile, "utf8");

const packagePath = path.join(ROOT, "package.json");
const packageJson = await readJson(packagePath);
packageJson.name = repositoryName;
await writeJson(packagePath, packageJson);

console.log("Student repository setup: PASS");
console.log(`Repository: ${repositoryName}`);
console.log(`Pages Hub: https://${githubUsername}.github.io/${repositoryName}/`);
console.log("Next: npm run build:pages");

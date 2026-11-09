import { execFileSync } from "node:child_process";

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
}).split("\0").filter(Boolean);

const forbiddenFiles = trackedFiles.filter((file) => {
  const fileName = file.split("/").at(-1);

  return fileName === ".env" || (fileName?.startsWith(".env.") && !fileName.endsWith(".example"));
});

if (forbiddenFiles.length > 0) {
  console.error("Refusing to continue: private environment files are tracked by Git:");
  for (const file of forbiddenFiles) console.error(`- ${file}`);
  console.error("Keep only .env.example in Git and store real values outside the repository.");
  process.exit(1);
}

console.log("Tracked environment-file check passed.");

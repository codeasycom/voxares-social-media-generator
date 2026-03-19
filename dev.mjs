import { spawn } from "child_process";

const procs = [];

function launch(name, command, args) {
  const proc = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });
  proc.on("error", (err) => console.error(`[${name}] Error:`, err.message));
  proc.on("exit", (code) => console.log(`[${name}] exited with code ${code}`));
  procs.push(proc);
  return proc;
}

// Start Vite preview server
launch("preview", "npx", ["vite", "--port", "3030"]);

// Start Remotion Studio
launch("studio", "npx", ["remotion", "studio", "remotion/index.ts", "--port", "3031"]);

console.log("\nStarting dev servers...");
console.log("  Preview: http://localhost:3030");
console.log("  Studio:  http://localhost:3031\n");

// Cleanup on exit
function cleanup() {
  for (const proc of procs) {
    proc.kill();
  }
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

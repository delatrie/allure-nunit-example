import { spawn } from "node:child_process";

const stdout = [];
const stderr = [];

const args = [
  "-NoLogo",
  "-NoProfile",
  "-NonInteractive",
  "-Command",
  "& { [System.Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($False, $False); Get-CimInstance -Class Win32_Process | ForEach-Object { \"$($_.ParentProcessId) $($_.ProcessId) $($_.ExecutablePath)\" } }",
];

const proc = spawn("powershell.exe", args, { stdio: ["ignore", "pipe", "pipe"], shell: false, timeout: 20000 });
proc.stdout.setEncoding("utf-8").on("data", (data) => { stdout.push(data); });
proc.stderr.setEncoding("utf-8").on("data", (data) => { stderr.push(data); });
await new Promise((resolve) => {
  proc.on("exit", (code, signal) => {
    stdout.join("").split(/\r|\n|\r\n/).map((line) => {
      return /(?<ppid>\d+)\s+(?<pid>\d+)\s+(?<comm>.*)/.exec(line);
    }).filter(Boolean).forEach(([,ppid, pid, comm]) => {
      console.log(`ppid=${ppid},pid=${pid},comm=${comm}`);
      if (comm.endsWith("...")) {
        console.log("bad");
      }
    });
    resolve();
  });
});

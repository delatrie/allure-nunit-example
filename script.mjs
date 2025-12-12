import { spawn } from "node:child_process";

const stdout = [];
const stderr = [];

const args = [
  "-NoLogo",
  "-NoProfile",
  "-NonInteractive",
  "-Command",
  "& { [System.Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($False, $False); Write-Output '♪♪♪'; Get-CimInstance -Class Win32_Process | Select-Object @{ n='ppid'; e={ $_.ParentProcessId } },@{ n='pid'; e={ $_.ProcessId } },@{ n='comm'; e={ $_.ExecutablePath } } | Format-Table ppid,pid,comm }",
];

const proc = spawn("powershell.exe", args, { stdio: ["ignore", "pipe", "pipe"], shell: false, timeout: 20000 });
proc.stdout.setEncoding("utf-8").on("data", (data) => { stdout.push(data); });
proc.stderr.setEncoding("utf-8").on("data", (data) => { stderr.push(data); });
await new Promise((resolve) => {
  proc.on("exit", (code, signal) => {
    console.log("exit code", code);
    console.log("signal", signal);
    console.log("stdout:");
    console.log(stdout.join("").replace("\n", "|\n"));
    console.log("stderr:");
    console.log(stderr.join(""));
    resolve();
  });
});

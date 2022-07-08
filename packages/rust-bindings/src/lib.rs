#![deny(clippy::all)]
use std::process::Command;

#[macro_use]
extern crate napi_derive;

#[napi]
fn run_command(command: String, cwd: String, args: Vec<String>) -> String {
  let output = Command::new(command)
    .args(args)
    .current_dir(cwd)
    .output()
    .unwrap();

  String::from_utf8_lossy(&output.stdout).to_string()
}
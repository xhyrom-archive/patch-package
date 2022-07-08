#![deny(clippy::all)]
use std::process::Command;
use std::fs;
use std::path::Path;
use std::io::{stdin,stdout,Write};

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

#[napi]
fn remove_directory(directory: String) -> () {
  if Path::new(&directory).exists() {
    fs::remove_dir_all(directory).expect("Can't delete");
  }
}

#[napi]
fn read_line(content: String) -> String {
  let mut s=String::new();
  print!("{}", content);
  let _=stdout().flush();
  stdin().read_line(&mut s).expect("Did not enter a correct string");
  if let Some('\n')=s.chars().next_back() {
      s.pop();
  }
  if let Some('\r')=s.chars().next_back() {
      s.pop();
  }

  return s;
}
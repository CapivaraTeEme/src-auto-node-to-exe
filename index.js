// q te parecio brisli XDD
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");

let projectDirectory = "";

const rl = readline.createInterface({ input, output });

function printBanner() {
  console.clear();
  console.log(chalk.white(`
        _          
     __|_|___           Brzzl made this, src unobfuscated by ceperoo#0000
    (  _____/              _          
    | (|_|__       ___ _ _| |_ ___ ___  ${chalk.greenBright(" ___ ___ _| |___ ")}___| |_ ___ ___${chalk.cyan(" ___ _ _ ___ ")}
    (_____  )     | .'| | |  _| . |___  ${chalk.greenBright("|   | . | . | -_|")}_|  _| . |___${chalk.cyan("| -_|_'_| -_|")}
    /\\|_|)  |     |__,|___|_| |___|   ${chalk.greenBright("|_|_|___|___|___|")}_|_| |___|   ${chalk.cyan("|___|_,_|___|")}
    \\_______) 
       |_|        ${chalk.greenBright("V2 ~ Cracked by ceperoo#0000")} | discord.gg/tempestgang
  `));
}

function step1() {
  printBanner();
  rl.question(`${chalk.greenBright("> Directorio del proyecto node: ")}`, (directoryInput) => {
    fs.stat(directoryInput, (err, stats) => {
      if (err) {
        if (err.code === "ENOENT") {
          rl.question(chalk.red("[x]") + " Directorio inexistente.", () => {
            step1();
          });
        } else {
          rl.question(chalk.yellow("[i]") + " Ocurrió un error al verificar el directorio:\n" + err, () => {
            step1();
          });
        }
      } else {
        if (stats.isDirectory()) {
          projectDirectory = directoryInput;
          console.log(chalk.greenBright("[Directorio]") + ": " + directoryInput);
          fs.readdir(directoryInput, (readErr, files) => {
            if (readErr) {
              console.error(readErr);
              return;
            }
            let fileCount = 0;
            files.forEach(file => {
              console.log(chalk.greenBright("-") + " " + file);
              fileCount++;
              if (files.length <= fileCount) {
                step2();
              }
            });
          });
        } else {
          rl.question(chalk.red("[x]") + " La ruta especificada no es un directorio.", () => {
            step1();
          });
        }
      }
    });
  });
}

function step2() {
  console.log("");
  rl.question(`${chalk.greenBright("> Quieres quitar la advertencia (ExperimentalWarning) de node al crear el ejecutable? (y/n): ")}`, (response) => {
    const configData = {
      main: path.join(projectDirectory, "indexf.js"),
      output: path.join(projectDirectory, "output.blob"),
    };

    if (response === "y") {
      configData.disableExperimentalSEAWarning = true;
    }

    fs.writeFileSync(path.join(projectDirectory, "COMPILER_CONFIG.json"), JSON.stringify(configData));
    console.log(chalk.greenBright("[Dependencias]") + " Nuevos valores agregados.");
    step3();
  });
}

function step3() {
  console.log(chalk.greenBright("[Ejecutable]") + " Modificando archivo...");
  const modifyFile = exec(`npx esbuild "${path.join(projectDirectory, "index.js")}" --platform=node --bundle --outfile="${path.join(projectDirectory, "indexf.js")}"`);
  
  modifyFile.on("exit", () => {
    console.log(chalk.greenBright("[Ejecutable]") + " Archivo modificado.");
    console.log(chalk.greenBright("[Ejecutable]") + " Creando configuración del ejecutable...");
    const createConfig = exec(`node.exe --experimental-sea-config ${path.join(projectDirectory, "COMPILER_CONFIG.json")}`);
    
    createConfig.on("exit", () => {
      console.log(chalk.greenBright("[Ejecutable]") + " Configuración del ejecutable creada.");
      step4();
    });
  });
}

function step4() {
  console.log(chalk.greenBright("[Ejecutable]") + " Generando archivo 'output.exe'...");
  const generateExecutable = exec("node -e \"require('fs').copyFileSync(process.execPath, 'output.exe')\"");
  
  generateExecutable.on("exit", () => {
    console.log(chalk.greenBright("[Ejecutable]") + " Archivo 'output.exe' creado.");
    step5();
  });
}

function step5() {
  console.log(chalk.greenBright("[Ejecutable]") + " Inyectando código al archivo 'output.exe'...");
  const injectCode = exec(`npx postject output.exe NODE_SEA_BLOB "${path.join(projectDirectory, "output.blob")}" --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`);
  
  injectCode.on("exit", () => {
    console.log(chalk.greenBright("[Ejecutable]") + " Inyectado.");
    fs.renameSync("output.exe", path.join(projectDirectory, "output.exe"));
    console.log(chalk.greenBright(">") + " Puedes cerrar el programa, archivo 'output.exe' creado en la carpeta: " + projectDirectory);
  });
}

function checkPostject() {
  if (!fs.existsSync(path.join(process.env.appdata, "npm", "postject"))) {
    const installPostject = exec("npm install postject -g");
    installPostject.on("exit", checkEsbuild);
  } else {
    checkEsbuild();
  }
}

function checkEsbuild() {
  if (!fs.existsSync(path.join(process.env.appdata, "npm", "esbuild"))) {
    const installEsbuild = exec("npm install esbuild -g");
    installEsbuild.on("exit", step1);
  } else {
    step1();
  }
}

console.clear();
console.log(chalk.yellowBright("Installing dependencies, please wait..."));
if (!fs.existsSync(path.join(process.env.appdata, "npm", "npm"))) {
  const installNpm = exec("npm install npm -g");
  installNpm.on("exit", checkPostject);
} else {
  checkPostject();
}

// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const stripAnsi = require('strip-ansi'); // Import the package

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/compile', (req, res) => {
   const { code, language } = req.body;
   const tempDir = path.join(__dirname, 'temp');

   // Ensure temp directory exists
   if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
   }

   let filename = 'temp';
   let extension = '';
   let compileCommand = '';
   let runCommand = '';

   // Set commands based on language
   switch (language) {
      case 'python':
            extension = '.py';
            filename = 'temp_python';
            compileCommand = `python ${filename}${extension}`;
            break;
      case 'javascript':
            extension = '.js';
            filename = 'temp_js';
            compileCommand = `node ${filename}${extension}`;
            break;
      case 'c':
            extension = '.c';
            filename = 'temp_c';
            compileCommand = `gcc ${filename}${extension} -o ${filename}`;
            runCommand = `./${filename}`;
            break;
      case 'cpp':
            extension = '.cpp';
            filename = 'temp_cpp';
            compileCommand = `g++ ${filename}${extension} -o ${filename}`;
            runCommand = `./${filename}`;
            break;
      case 'java':
            extension = '.java';
            filename = 'Main'; // Java class must match filename
            compileCommand = `javac ${filename}${extension}`;
            runCommand = `java -cp ${tempDir} ${filename}`;
            break;
      case 'php':
            extension = '.php';
            filename = 'temp_php';
            compileCommand = `php ${filename}${extension}`;
            break;
      case 'perl':
            extension = '.pl';
            filename = 'temp_perl';
            compileCommand = `perl ${filename}${extension}`;
            break;
      default:
            return res.send({ output: 'Language not supported' });
   }

   const filepath = path.join(tempDir, filename + extension);

   // Write the code into file
   fs.writeFileSync(filepath, code);

   const processOutput = (err, stdout, stderr, callback) => {
      // Remove ANSI codes from stdout and stderr
      const cleanStdout = stripAnsi(stdout);
      const cleanStderr = stripAnsi(stderr);
      if (err) {
         callback(cleanStderr);
      } else {
         callback(cleanStdout);
      }
   };

   if (language === 'c' || language === 'cpp' || language === 'java') {
        // Compilation needed
      exec(compileCommand, { cwd: tempDir }, (err, stdout, stderr) => {
            if (err) {
               const cleanError = stripAnsi(stderr);
               return res.send({ output: cleanError });
            }

            const commandToRun = runCommand || compileCommand;

            exec(commandToRun, { cwd: tempDir }, (err, stdout, stderr) => {
               if (err) {
                  const cleanError = stripAnsi(stderr);
                  return res.send({ output: cleanError });
               }
               const cleanOutput = stripAnsi(stdout);
               return res.send({ output: cleanOutput });
            });
      });
   } else {
        // No compilation needed
      exec(compileCommand, { cwd: tempDir }, (err, stdout, stderr) => {
            if (err) {
               const cleanError = stripAnsi(stderr);
               return res.send({ output: cleanError });
            }
            const cleanOutput = stripAnsi(stdout);
            return res.send({ output: cleanOutput });
      });
   }
});

app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});
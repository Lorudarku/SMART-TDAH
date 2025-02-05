const { exec } = require('child_process');
const path = require('path');

const sqlFilePath = path.join(__dirname, 'createDatabase.sql');

exec(`psql -U postgres -f "${sqlFilePath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing SQL file: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
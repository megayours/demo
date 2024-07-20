const { exec } = require('child_process');
const dotenv = require('dotenv');
const { cwd } = require('process');
dotenv.config();

// Configuration
const image = process.env.CLI_IMAGE;
const path = cwd();

const command = `docker run --name mega_chain_blockchain -d --network mega_chain_network -p 7740:7740 -p 7750:7750 -p 9090:9090 -v ${path}:/usr/app ${image} chr node start --directory-chain-mock`;
console.log(`>> Starting with command: ${command}`);

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error('>> Error:', '\n', err);
    return;
  }

  if (stderr) console.error('>> stdError:', '\n', stderr);
  console.log(
    '>> Container running with:',
    '\n',
    `  RESULT: ${stdout}`
  );
});
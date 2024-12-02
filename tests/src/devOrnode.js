import jsonfile from "jsonfile";
import shelljs from "shelljs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const d = jsonfile.readFileSync("./tmp/dev-deployment.json");
  const tokenCfg = jsonfile.readFileSync("./dev-token-cfg.json");
  const config = {
    providerUrl: d.providerUrl,
    contracts: {
      newRespect: d.newRespectAddr,
      orec: d.orecAddr
    },
    tokenMetadataCfg: tokenCfg,
    mongoCfg: {
      url: 'mongodb://localhost:27017',
      dbName: "ornode-dev"
    },
    ornode: {
      startPeriodNum: 0,
    }
  };

  console.log("Args: ", process.argv);

  const sync = process.argv[2] === '--sync';
  if (sync) {
    config.ornode.sync = {
      fromBlock: process.argv[3],
      toBlock: process.argv[4],
      stepRange: 10
    }
  } else {
    // This is only relevant if we are not in sync mode
    config.ornode.listenForEvents = process.argv[2] !== '--no-event-listen';
  }

  const ornodeCfgPath = join(__dirname, "../tmp/ornode-dev-cfg.json");
  console.debug("ornodeCfgPath: ", ornodeCfgPath);
  jsonfile.writeFileSync(ornodeCfgPath, config);

  // shelljs.exec("cd $npm_package_config_ornode && ORNODE_CFG_PATH=../ordao/sys/tmp/ornode-dev-cfg.json npx nodemon --watch node_modules/ortypes node_modules/ts-utils dist/index.js");
  console.log("we're in devOrnode!");
  if (sync) {
    shelljs.exec(`cd $npm_package_config_ornode && \
      ORNODE_CFG_PATH=${ornodeCfgPath} \
      \
      node dist/index.js`
    );
  } else {
    shelljs.exec(`cd $npm_package_config_ornode && \
      ORNODE_CFG_PATH=${ornodeCfgPath} \
      \
      npx nodemon \
      --watch ../ortypes/dist \
      --watch ../ts-utils/dist \
      --watch ../respect1155/sc/dist \
      --watch ../orec/dist/ \
      --watch ./ \
      \
      --delay 3
      \
      dist/index.js`
    );
  }
}

main();
const { TonClient } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

const { loadContract, getPreparedSigner, rl } = require("./utils");
const { Contract } = require("./contracts/contract");
const fs = require('fs');
const path = require("path");
const { resolve } = require("path");

TonClient.useBinaryLibrary(libNode);

(async () => {
    try {
        const tonClient = new TonClient({
            network: {
                endpoints: ["net1.ton.dev", "net5.ton.dev"],
                message_processing_timeout: 60000,
                message_retries_count: 3
            },
        });

        const DEBOT_CONTRACT = loadContract("TestDebot");
        const DEBOT_ABI_HEX = JSON.stringify(DEBOT_CONTRACT.abi.value).hexEncode();
        const DEBOT_CONTRACT_SIGNER = await getPreparedSigner(tonClient, `../keys/debots.keypair`);
        const DebotContractManager = new Contract(tonClient, DEBOT_CONTRACT);
        await DebotContractManager.setInitParams(DEBOT_CONTRACT_SIGNER, {}, {});
        

        const ACTION = process.argv[2];
        switch (ACTION) {           
            case "deploy": {
                const deploy_result = await DebotContractManager.deploy();
                if (deploy_result) {    
                    await DebotContractManager.callSigned("setABI", {
                        dabi: DEBOT_ABI_HEX
                    });
                    console.log("set abi");

                    const icon = fs.readFileSync(path.resolve(__dirname, "..", "free-ton", "images", "icon.svg")).toString('base64');
                    await DebotContractManager.callSigned("setIcon", { icon: `data:image/svg+xml;base64,${icon}`.hexEncode() });
                    console.log("set icon");
                    
                } else {
                    process.exit(0);
                }
                break;
            }
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})()
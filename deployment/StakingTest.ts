import { ethers, utils, providers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
// Load process.env from dotenv
require("dotenv").config();

// Importing related complied contract code
import MockToken from "../build/MockToken.json";
import StakingMiningPoolFactory from "../build/StakingMiningPoolFactory.json";

// Use the Rinkeby testnet
const network = "rinkeby";
// Specify your own API keys
// Each is optional, and if you omit it the default
// API key for that service will be used.
const provider = ethers.getDefaultProvider(network, {
  infura: process.env.InfuraId,
});

const wallet = new ethers.Wallet(String(process.env.privateKey), provider);

async function deployFakeTokens() {
  const TokenFactory = new ethers.ContractFactory(
    MockToken.abi,
    MockToken.bytecode,
    wallet
  );
  const USDT = await TokenFactory.deploy("Fake USDT", "FUSDT", 6, utils.parseUnits("100", 6));
  const FDAO = await TokenFactory.deploy("Fake 岛岛币", "FDAO", 4, utils.parseUnits("200", 4));

  await Promise.all([
    USDT.deployTransaction.wait(1),
    FDAO.deployTransaction.wait(1),
  ]);

  return [USDT.address, FDAO.address];
}

async function deployStakingFactory() {
  console.info("===== Deploying PoolFactory =====");
  // const PoolFactory = await ethers.ContractFactory.fromSolidity(
  //   StakingMiningPoolFactory,
  //   wallet
  // ).deploy();
  const poolFactory = new ethers.Contract(
    '0xD9e398d6b34dfedD5Ce8098563318425aa529Db4',
    StakingMiningPoolFactory.abi,
    wallet
  );
  
  // await PoolFactory.deployTransaction.wait(1);
  // console.info("===== StakingFactory Deployed =====");
  // const poolFactory = await PoolFactory.deployed();
  // console.log("poolFactory @ ", poolFactory.address);
  return poolFactory;
}

async function main() {
  const poolFactory = await deployStakingFactory();
  // const [usdt, dao] = await deployFakeTokens();
  const [usdt, dao] = [
    "0xe03b1f764a6321f7b205bf6a2356b196c67344a8",
    "0x1b4a4e3de2caad29b14187033f6618e08a9562d2",
  ];
  const RewardingToken = new ethers.Contract(
    dao, MockToken.abi, wallet
  );
  const depositRewardAmount = parseUnits("100", 4)
  const approveReq: providers.TransactionResponse = await RewardingToken.approve(poolFactory.address, depositRewardAmount);
  await approveReq.wait(1);
  console.info('depositRewardAmount approved')
  const rewardsDurationInDays = 7
  const createPoolTx: providers.TransactionResponse = await poolFactory.createMiningPool(
    dao, usdt, depositRewardAmount, rewardsDurationInDays
  );
  const createPoolReceipt = await createPoolTx.wait(1);
  console.info('Pool created, receipt', createPoolReceipt);
}

main();

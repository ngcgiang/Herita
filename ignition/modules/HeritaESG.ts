import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const HeritaESG = buildModule("HeritaESG", (m) => {
  const token = m.contract("MyToken", []);

  return { token };
});

export default HeritaESG;
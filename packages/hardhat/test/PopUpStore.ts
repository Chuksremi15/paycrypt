import { expect } from "chai";
import { ethers } from "hardhat";
import { PopUpStore, Crypt } from "../typechain-types";
import { Address } from "hardhat-deploy/types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("PopUpStore", function () {
  // We define a fixture to reuse the same setup in every test.

  const zeroAddress = "0x0000000000000000000000000000000000000000";

  let popUpStore: PopUpStore;
  let crypt: Crypt;
  let owner: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  before(async () => {
    [owner, user2] = await ethers.getSigners();
    const popUpStoreFactory = await ethers.getContractFactory("PopUpStore");
    const cryptFactory = await ethers.getContractFactory("Crypt");

    let cryptContract = (await cryptFactory.deploy()) as Crypt;
    crypt = await cryptContract.waitForDeployment();

    popUpStore = (await popUpStoreFactory.deploy(owner.address)) as PopUpStore;
    popUpStore = await popUpStore.waitForDeployment();
  });

  describe("Deployment", async function () {
    it("should assign owner on deploy", async function () {
      expect(await popUpStore.owner()).to.equal(owner);
    });

    it("Should allow setting a new message", async function () {
      await popUpStore.addPaymentToken("Crypt", crypt.target);
      expect(await popUpStore.tokenOptions("Crypt")).to.equal(crypt.target);
    });
  });

  describe("Payment", async function () {
    it("Should allow adding token for payment", async function () {
      await popUpStore.addPaymentToken("Crypt", crypt.target);
      expect(await popUpStore.tokenOptions("Crypt")).to.equal(crypt.target);
    });

    it("Should allow payment with token", async function () {
      await crypt.connect(owner).approve(popUpStore.target, ethers.parseEther("400"));
      await popUpStore.payForProduct(ethers.parseEther("400"), "Crypt", "123456789bb");
      expect(await popUpStore.getTokenBalance("Crypt")).to.equal(ethers.parseEther("400"));
    });

    it("Should allow removing token for payment", async function () {
      await popUpStore.removePaymentToken("Crypt", crypt.target);
      expect(await popUpStore.tokenOptions("Crypt")).to.be.equal(zeroAddress);
    });

    //expect(tx1, "ethToToken should revert before initalization").not.to.be.reverted;
  });
});

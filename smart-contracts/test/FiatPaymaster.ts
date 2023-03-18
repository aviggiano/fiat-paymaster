import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("FiatPaymaster", function () {
  async function deployFiatPaymaster() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FiatPaymaster = await ethers.getContractFactory("FiatPaymaster");
    const fiatPaymaster = await FiatPaymaster.deploy(
      ethers.constants.AddressZero,
      "FPUSD",
      ethers.constants.AddressZero,
    );

    return { fiatPaymaster, owner };
  }

  describe("Deployment", function () {
    it("Should set the right symbol and name", async function () {
      const { fiatPaymaster } = await loadFixture(deployFiatPaymaster);

      expect(await fiatPaymaster.symbol()).to.equal("FPUSD");
      expect(await fiatPaymaster.name()).to.equal("FPUSD");
    });

    it("Should set the right owner", async function () {
      const { fiatPaymaster, owner } = await loadFixture(deployFiatPaymaster);

      expect(await fiatPaymaster.owner()).to.equal(owner.address);
    });

    it("Should not support account creation", async function () {
      const { fiatPaymaster } = await loadFixture(deployFiatPaymaster);

      expect(await fiatPaymaster.theFactory()).to.equal(ethers.constants.AddressZero);
    });
  });

  describe("UserOperation", function () {
    describe("Conversion", function () {
      it("Should convert 1 ETH to 1700 USD", async function () {
        const { fiatPaymaster } = await loadFixture(deployFiatPaymaster);

        expect(await fiatPaymaster.ethToUsd()).to.equal(ethers.constants.MaxUint256);

        await fiatPaymaster.setTokenValueOfEth(ethers.utils.parseEther("1700"));
        expect(await fiatPaymaster.ethToUsd()).to.equal(ethers.utils.parseEther("1700"));
      });
    });
  });
});

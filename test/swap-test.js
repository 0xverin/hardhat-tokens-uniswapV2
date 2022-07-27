const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("RebaseDividendToken Token Test", function () {
    var decimals = 18;
    var UniswapV2Factory;
    var UniswapV2Router02;
    it("init params", async function () {
        [deployer, user1, user2, user3, user4, user5] = await ethers.getSigners();
    });
    it("deploy", async function () {
        const WETH9Instance = await ethers.getContractFactory("WETH9");
        var WETH9 = await WETH9Instance.deploy();

        const UniswapV2FactoryInstance = await ethers.getContractFactory("UniswapV2Factory");
        UniswapV2Factory = await UniswapV2FactoryInstance.deploy(WETH9.address);

        const UniswapV2Router02Instance = await ethers.getContractFactory("UniswapV2Router02");
        UniswapV2Router02 = await UniswapV2Router02Instance.deploy(UniswapV2Factory.address, WETH9.address);
    });

    //函数调用
    it("function test", async function () {
        console.log(UniswapV2Factory.address);
        console.log(UniswapV2Router02.address);
    });
});

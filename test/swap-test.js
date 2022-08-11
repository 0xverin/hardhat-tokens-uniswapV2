const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MaxUint256 } = require("@ethersproject/constants");
const { BigNumber } = require("ethers");
function expandTo18Decimals(value) {
    return BigNumber.from(value).mul(BigNumber.from(10).pow(18));
}
describe("RebaseDividendToken Token Test", function () {
    var decimals = 18;
    var UniswapV2Factory;
    var UniswapV2Router02;
    var BASEToken;
    var WETH9;
    var BEP20USDT;
    var UniswapV2Pair;
    it("init params", async function () {
        [deployer, user1, user2, user3, user4, user5] = await ethers.getSigners();
    });
    it("deploy", async function () {
        const BASETokenInstance = await ethers.getContractFactory("BASEToken");
        BASEToken = await BASETokenInstance.deploy();

        const BEP20USDTInstance = await ethers.getContractFactory("BEP20USDT");
        BEP20USDT = await BEP20USDTInstance.deploy();

        const WETH9Instance = await ethers.getContractFactory("WETH9");
        WETH9 = await WETH9Instance.deploy();

        const UniswapV2FactoryInstance = await ethers.getContractFactory("UniswapV2Factory");
        UniswapV2Factory = await UniswapV2FactoryInstance.deploy(deployer.address);

        const UniswapV2Router02Instance = await ethers.getContractFactory("UniswapV2Router02");
        UniswapV2Router02 = await UniswapV2Router02Instance.deploy(UniswapV2Factory.address, WETH9.address);

        const UniswapV2PairInstance = await ethers.getContractFactory("UniswapV2Pair");
        UniswapV2Pair = await UniswapV2PairInstance.deploy();

        console.log("UniswapV2Factory  :::::", UniswapV2Factory.address);
        console.log("UniswapV2Router02 :::::", UniswapV2Router02.address);
        console.log("UniswapV2Pair     :::::", UniswapV2Pair.address);
        console.log("BASEToken         :::::", BASEToken.address);
        console.log("--------------------compile deployed------------------------");
    });

    //函数调用
    it("mint token", async function () {
        await BASEToken.mint(deployer.address, 10000);
        let balance = await BASEToken.balanceOf(deployer.address);
        balance = ethers.utils.formatEther(balance);
    });

    it("approve", async function () {
        await BASEToken.approve(UniswapV2Router02.address, MaxUint256);
        await BEP20USDT.approve(UniswapV2Router02.address, MaxUint256);
    });

    it("addLiquidity", async function () {
        //INIT_CODE_PAIR_HASH 需要从factory中获取然后修改掉 否则无法调用
        await UniswapV2Router02.addLiquidity(
            BEP20USDT.address,
            BASEToken.address,
            expandTo18Decimals(100),
            expandTo18Decimals(100),
            expandTo18Decimals(1),
            expandTo18Decimals(1),
            deployer.address,
            Math.floor(Date.now() / 1000) + 100,
        );

        const pairAddress = await UniswapV2Factory.getPair(BEP20USDT.address, BASEToken.address);
        const Pair = UniswapV2Pair.attach(pairAddress);
        const res = await Pair.getReserves();
        // console.log(res);
    });

    it("addLiquidityETH", async function () {
        await UniswapV2Router02.addLiquidityETH(
            BASEToken.address,
            expandTo18Decimals(10),
            expandTo18Decimals(1),
            expandTo18Decimals(1),
            deployer.address,
            Math.floor(Date.now() / 1000) + 100,
            { value: expandTo18Decimals(10) },
        );

        const pairAddress = await UniswapV2Factory.getPair(BASEToken.address, WETH9.address);
        const Pair = UniswapV2Pair.attach(pairAddress);
        const res = await Pair.getReserves();
        // console.log(res);
    });

    //------------- SWAPPING ---------------
    it("swapExactTokensForTokens", async function () {
        await UniswapV2Router02.addLiquidity(
            BEP20USDT.address,
            BASEToken.address,
            expandTo18Decimals(100),
            expandTo18Decimals(100),
            expandTo18Decimals(1),
            expandTo18Decimals(1),
            deployer.address,
            Math.floor(Date.now() / 1000) + 100,
        );

        const pairAddress = await UniswapV2Factory.getPair(BEP20USDT.address, BASEToken.address);
        const Pair = UniswapV2Pair.attach(pairAddress);
        const res = await Pair.getReserves();
        console.log(res);

        await UniswapV2Router02.swapExactTokensForTokens(
            expandTo18Decimals(10),
            expandTo18Decimals(1),
            [BASEToken.address, BEP20USDT.address],
            deployer.address,
            Math.floor(Date.now() / 1000) + 100,
        );
        const newres = await Pair.getReserves();
        console.log(newres);
    });
});

// scripts/arbitrage.js

require('dotenv').config();
const { ether, ethers } = require("hardhat");

async function main() {
    // 1.Connect to the Polygon network using your RPC URL
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    // 2. Router addresses (QuickSwap & SushiSwap on Polygon Mainnet)
    //   For Amoy testnet, you'll nee the apropriate router addresses on that testnet.
    const routerAddress1 = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap mainnet router
    const routerAddress2 = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"; // SushiSwap mainnet router

    // 3. Minimal ABI to call getAmountsOut (common in Uniswap -like DEXs)
    const routerAbi =
    [
        "function getAmountOut(uint256 amountIn, address[] calldata path) external views returns (uint256[] memory amounts)"
    ];

    // 4. Create contract instandes fo both users
    const router1 = new ethers.Contract(routerAddress1, routerAbia,provider);
    const router2 = new ethers.Contract(routerAddress2, routerAbi, provider);

    // 5. Define the tokens for the arbitrage opportunity
    //     Example: WETH and USDC on Polygon mainnet
    //     NOTE: For testnets, replace these with the appropriate test token addresses.
    const tokenIn = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; //WETH on Polygon mainnet
    const tokenOut = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" //USDC on Polygon mainnet

    // 6. Amount of tokenIn to trade (1 WETH, in this example)
    const amountIn = ethers.utils.parseUnits("1", 18);

    // 7. Get the amount of tokenOut from, each router
    const amountsOut1 = await router1.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    const amountsOut2 = await router2.getAmountsOut(amountIn, [tokenIn,tokenOut]);

    // 8. Format the outputs (USDC typically has 6 decimals)
    const amountOut1 = ethers.utils.formatUnits(amountsOut1[1], 6);
    const amountOut2 = ethers.utils.formatUnits(amoutsOut2[1], 6);

    console.log('Router 1 (QuickSwap) offers: ${amountOut1} USDC for 1 WETH');
    console.log('Router 2 (SushiSwap) offers: ${amountOut2} USDC FOR 1 WETH');

    // 9. Compare the outputs for potential arbitrage
    if (amountsOut1[1].gt(amountsOut2[1])) 
        {
            console.log("Potential arbitrage:Buy on Rounter 2 (Sushi) and sell on Router 1 (QuickSwap).");
        }   
        else if (amountsOut2[1].gt(amountsOut1[1])) 
            {
                console.log("Potential arbitrage: Buy on Router 1 (QuickSwap) and sel on Roouter 2 (Sushi).");
            }
            else
            {
                console.log("No arbitrage opportunity detected at this time.");
            }
        }
// Execute the main function
main()
.then(() => process.exit(0))
.catch((error) =>
{
    console.error("Error encountered:", error);
    process.exit(1);
});



    

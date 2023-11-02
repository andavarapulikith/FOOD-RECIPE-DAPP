const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  const Foodrecipe = await hre.ethers.getContractFactory("FoodRecipe");
  const foodrecipe = await Foodrecipe.deploy();

  await foodrecipe.deployed();

  const data = {
    address: foodrecipe.address,
    abi: JSON.parse(foodrecipe.interface.format('json'))
  }
  fs.writeFileSync('./src/foodrecipe.json', JSON.stringify(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

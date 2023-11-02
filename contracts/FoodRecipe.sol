// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FoodRecipe is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 listPrice = 0.01 ether;

    address payable public owner;
    mapping(uint256 => FoodItem) private idToFoodItemMap;
    uint256[] public availableFoodItemIds;

    event FoodItemAdded(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool available
    );

    event FoodItemPurchased(
        uint256 tokenId,
        address buyer,
        address seller,
        uint256 price
    );

    event FoodItemRated(uint256 tokenId, address rater, uint8 rating);

    constructor() ERC721("FoodRecipe", "NFTM") {
        owner = payable(msg.sender);
    }

    struct FoodItem {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool available;
        uint256 totalRatings;
        uint256 totalRatingPoints;
        address[] ratedUsers;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function createFoodToken(
        string memory tokenURL,
        uint256 price
    ) public payable returns (uint256) {
        require(msg.value == listPrice, "Send the correct list price");
        require(price > 0, "Price cannot be negative");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURL);
        idToFoodItemMap[newTokenId] = FoodItem(
            newTokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            true,
            0,
            0,
            new address[](0)
        );
        emit FoodItemAdded(newTokenId, address(this), msg.sender, price, true);
        availableFoodItemIds.push(newTokenId);
        return newTokenId;
    }

   

    function rateFoodItem(uint256 tokenId, uint8 rating) public {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        FoodItem storage item = idToFoodItemMap[tokenId];
      
        require(
            item.owner != msg.sender,
            "The owner cannot rate their own item"
        );

        for (uint256 i = 0; i < item.ratedUsers.length; i++) {
            require(
                item.ratedUsers[i] != msg.sender,
                "You have already rated this item"
            );
        }

        item.ratedUsers.push(msg.sender); // Add the address to the rated users array
        item.totalRatings++;
        item.totalRatingPoints += uint256(rating);
        emit FoodItemRated(tokenId, msg.sender, rating);
    }

    function getFoodItem(
        uint256 tokenId
    ) public view returns (FoodItem memory) {
        return idToFoodItemMap[tokenId];
    }

    function getRatedUsers(
        uint256 tokenId
    ) public view returns (address[] memory) {
        return idToFoodItemMap[tokenId].ratedUsers;
    }

    function getAverageRating(uint256 tokenId) public view returns (uint8) {
        FoodItem storage item = idToFoodItemMap[tokenId];
        if (item.totalRatings == 0) {
            return 0; // No ratings yet.
        }
        return uint8(item.totalRatingPoints / item.totalRatings);
    }

    function setListPrice(uint256 newPrice) public onlyOwner {
        listPrice = newPrice;
    }

    function getAllFoodNFTs() public view returns (FoodItem[] memory) {
        FoodItem[] memory result = new FoodItem[](availableFoodItemIds.length);

        for (uint256 i = 0; i < availableFoodItemIds.length; i++) {
            uint256 tokenId = availableFoodItemIds[i];
            result[i] = idToFoodItemMap[tokenId];
        }

        return result;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getMyFoodNFTs() public view returns (FoodItem[] memory) {
        uint total = _tokenIds.current();
        uint itemcount = 0;
        uint currentindex = 0;
        uint currentid;
        for (uint i = 0; i < total; i++) {
            if (idToFoodItemMap[i + 1].owner == msg.sender) {
                itemcount += 1;
            }
        }
        FoodItem[] memory items = new FoodItem[](itemcount);
        for (uint i = 0; i < total; i++) {
            if (idToFoodItemMap[i + 1].owner == msg.sender) {
                currentid = i + 1;
                FoodItem storage currentitem = idToFoodItemMap[currentid];
                items[currentindex] = currentitem;
                currentindex += 1;
            }
        }
        return items;
    }
      function PurchaseFoodItem(uint256 tokenid) public payable {
        uint256 price=idToFoodItemMap[tokenid].price;
        address seller=payable(idToFoodItemMap[tokenid].owner);
        require(msg.value==price,"you must pay the price to purchase the order");
        idToFoodItemMap[tokenid].owner=payable(msg.sender);
        _transfer(seller,msg.sender,tokenid);
        approve(seller,tokenid);
        payable(seller).transfer(msg.value);

    }


// Add a struct to represent a favorite item
struct FavoriteItem {
    uint256 tokenId;
}

// Add a mapping to store a user's favorite items
mapping(address => FavoriteItem[]) private userFavorites;

// Function to add an item to a user's favorites
function addToFavorites(uint256 tokenId) public {
    // require(idToFoodItemMap[tokenId].available, "The item is not available");
    // require(msg.sender != idToFoodItemMap[tokenId].owner, "You cannot add your own item to favorites");

    // Check if the item is already in favorites
    for (uint256 i = 0; i < userFavorites[msg.sender].length; i++) {
        if (userFavorites[msg.sender][i].tokenId == tokenId) {
            return; // Item is already in favorites
        }
    }

    // If the item is not in favorites, add it
    userFavorites[msg.sender].push(FavoriteItem(tokenId));
}

// Function to remove an item from a user's favorites
function removeFromFavorites(uint256 tokenId) public {
    require(userFavorites[msg.sender].length > 0, "There are no favorite items");
    for (uint256 i = 0; i < userFavorites[msg.sender].length; i++) {
        if (userFavorites[msg.sender][i].tokenId == tokenId) {
            userFavorites[msg.sender][i] = userFavorites[msg.sender][userFavorites[msg.sender].length - 1];
            userFavorites[msg.sender].pop();
            return;
        }
    }
}

// Function to return details of all favorite items of a user
function getFavoriteItems() public view returns (FoodItem[] memory) {
    FavoriteItem[] storage favoriteItems = userFavorites[msg.sender];
    FoodItem[] memory favoriteDetails = new FoodItem[](favoriteItems.length);

    for (uint256 i = 0; i < favoriteItems.length; i++) {
        uint256 tokenId = favoriteItems[i].tokenId;
        favoriteDetails[i] = idToFoodItemMap[tokenId];
    }

    return favoriteDetails;
}



}

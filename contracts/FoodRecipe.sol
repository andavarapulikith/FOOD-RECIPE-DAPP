pragma solidity ^0.8.0;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FoodRecipe is ERC721URIStorage {
    address payable owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
     uint256 listPrice = 0.01 ether;
    constructor() ERC721("FoodRecipe", "NFTM") 
    {
        owner = payable(msg.sender);
    }
    struct FoodItem
    {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool available;
    }
    event FoodItemAdded (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool available
    );
    //mapping from food address to food data
    mapping(uint256=>FoodItem)private idToFoodItemMap;
     uint256[] public availableFoodItemIds;
    
    function getListedItemGivenId(uint256 tokenId) public view returns (FoodItem memory) {
        return idToFoodItemMap[tokenId];
    }
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }
    //create a new food nft given tokenurl and price of food
    function createFoodToken(string memory tokenurl,uint256 price) public payable returns(uint)
    {
        require(msg.value==listPrice,"send a correct list price");
        require(price>0,"price cannot be negative");
        _tokenIds.increment();
        uint256 newtokenid=_tokenIds.current();
        _safeMint(msg.sender, newtokenid);
        _setTokenURI(newtokenid, tokenurl);
        idToFoodItemMap[newtokenid]=FoodItem(newtokenid,payable(msg.sender),payable(address(this)),price,true);
        emit FoodItemAdded(newtokenid,address(this),msg.sender,price,true);
        availableFoodItemIds.push(newtokenid);
        return newtokenid;


    }
    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    //gives all food nfts available in the marketplace of our contract
    function getAllFoodNFTs() public view returns (FoodItem[] memory)
    {
        FoodItem[] memory result = new FoodItem[](availableFoodItemIds.length);

        for (uint256 i = 0; i < availableFoodItemIds.length; i++) {
            uint256 tokenId = availableFoodItemIds[i];
            result[i] = idToFoodItemMap[tokenId];
        }

        return result;
    }
    //gives nfts of msg.sender address 
    function getMyFoodNFTs() public view returns(FoodItem[] memory)
    {
        uint total=_tokenIds.current();
        uint itemcount=0;
        uint currentindex=0;
        uint currentid;
        for(uint i=0;i<total;i++)
        {
            if(idToFoodItemMap[i+1].owner==msg.sender)
            {
                itemcount+=1;
            }
        }
        FoodItem[] memory items=new FoodItem[](itemcount);
        for(uint i=0;i<total;i++)
        {
             if(idToFoodItemMap[i+1].owner==msg.sender)
            {
                currentid=i+1;
                FoodItem storage currentitem=idToFoodItemMap[currentid];
                items[currentindex]=currentitem;
                currentindex+=1;
            }
        }
        return items;


    }
    //transfer ownership of nfts from one account to ot
    function PurchaseFoodItem(uint256 tokenid) public payable {
        uint256 price=idToFoodItemMap[tokenid].price;
        address seller=payable(idToFoodItemMap[tokenid].owner);
        require(msg.value==price,"you must pay the price to purchase the order");
        idToFoodItemMap[tokenid].owner=payable(msg.sender);
        _transfer(seller,msg.sender,tokenid);
        approve(seller,tokenid);
        payable(seller).transfer(msg.value);

    }



}
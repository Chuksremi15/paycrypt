//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract PopUpStore {
	// State Variables
	address public immutable owner;
	mapping(string => address) public tokenOptions;

	IERC20 testToken;

	// Events: a way to emit log statements from smart contract that can be listened to by external parties
	event PaymentReceive(
		address indexed payersAddress,
		string txDetails,
		string indexed productId,
		uint256 amount,
		address indexed tokenAddress
	);

	// Events: emit when payment token is added
	event tokenAdded(string indexed tokenName, address indexed tokenAddress);

	// Events: emit when payment token is remove
	event tokenRemove(string indexed tokenName, address indexed tokenAddress);

	// Events: emit when token is withdrawn
	event tokenWithdrawn(string indexed tokenName, uint256 amount);

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/00_deploy_your_contract.ts
	constructor(address _owner, address _token_addr) {
		owner = _owner;
		testToken = IERC20(_token_addr);
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

	/**
	 * Function that allows anyone to pay for an item
	 *
	 * @param _amount (unit256 memory) - amount pegged to USD to be paid by user
	 * @param _token_name (string memory) - token address of the token the contracts receive payment in
	 * @param _productId (string memory) - productId to be paid for
	 */

	function payForProduct(
		uint256 _amount,
		string memory _token_name,
		string memory _productId
	) public {
		address tokenAddress = tokenOptions[_token_name];
		require(tokenAddress != address(0), "Token not found");

		IERC20 token = IERC20(tokenAddress);

		//transfer token
		require(
			token.transferFrom(msg.sender, address(this), _amount),
			"payment reverted"
		);

		// emit: keyword used to trigger an event
		emit PaymentReceive(
			msg.sender,
			"Payment Received",
			_productId,
			_amount,
			tokenAddress
		);
	}

	/**
	 * Function that allows the owner to withdraw token in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdrawToken(
		string memory _token_name,
		uint256 _amount
	) public isOwner {
		address tokenAddress = tokenOptions[_token_name];
		require(tokenAddress != address(0), "Token not found");
		require(_amount > 0, "cannot withdraw 0 token");

		IERC20 token = IERC20(tokenAddress);

		//withdraw token
		require(
			token.transferFrom(address(this), msg.sender, _amount),
			"payment reverted"
		);

		// emit event for token withdraw
		emit tokenWithdrawn(_token_name, _amount);
	}

	/**
	 * Function to check the token balance of this contract
	 *
	 * @param _token_name (string memory) - name of token to check balance
	 */
	function getTokenBalance(
		string memory _token_name
	) public view returns (uint256) {
		address tokenAddress = tokenOptions[_token_name];
		require(tokenAddress != address(0), "Token not found");

		IERC20 token = IERC20(tokenAddress);

		token = IERC20(tokenAddress);
		return token.balanceOf(address(this));
	}

	/**
	 * Function to add tokens payment can be recieve in
	 *
	 * @param _token_name (string memory) - name of token to check balance
	 * @param _token_address (address memory) - name of token to check balance
	 */
	function addPaymentToken(
		string memory _token_name,
		address _token_address
	) public isOwner {
		require(_token_address != address(0), "Token not found");
		tokenOptions[_token_name] = _token_address;

		// emit when token is added
		emit tokenAdded(_token_name, _token_address);
	}

	/**
	 * Function to add tokens payment can be recieve in
	 *
	 * @param _token_name (string memory) - name of token to check balance
	 * @param _token_address (address memory) - name of token to check balance
	 */
	function removePaymentToken(
		string memory _token_name,
		address _token_address
	) public isOwner {
		require(tokenOptions[_token_name] != address(0), "Token not found");
		delete tokenOptions[_token_name];

		// emit when token is added
		emit tokenRemove(_token_name, _token_address);
	}

	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdraw() public isOwner {
		(bool success, ) = owner.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}

// SPDX-License-Identifier: None
pragma solidity ^0.6;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/Math.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './StakingRewards.sol';

contract StakingMiningPoolFactory is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    constructor() public Ownable() {}

    event MiningPoolCreated(address indexed rewardsToken, address indexed stakingTokenaddress, uint256 amountOfRewards, address pool);

    function createMiningPool(
        address rewardsToken, address stakingToken, uint256 amountOfRewards, uint8 _days
    ) public onlyOwner returns(address) {
        StakingRewards pool = new StakingRewards(rewardsToken, stakingToken, _days * 1 days);
        // Get rewardsToken and pour into the pool
        IERC20(rewardsToken).safeTransferFrom(msg.sender, address(pool), amountOfRewards);
        pool.notifyRewardAmount(amountOfRewards);
        emit MiningPoolCreated(rewardsToken, stakingToken, amountOfRewards, address(pool));
        return address(pool);
    }

    function notifyRewardAmount(address pool, uint256 rewards) public onlyOwner {
        StakingRewards(pool).notifyRewardAmount(rewards);
    }

    function addRewardTo(address pool, uint256 howMuch) public onlyOwner {
        StakingRewards(pool).rewardsToken().safeTransferFrom(msg.sender, address(pool), howMuch);
        StakingRewards(pool).notifyRewardAmount(howMuch);
    }
}
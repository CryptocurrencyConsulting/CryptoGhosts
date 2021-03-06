require('babel-polyfill');
var CryptoGhostsMarket = artifacts.require("./CryptoGhostsMarket.sol");

contract('CryptoGhostsMarket-setInitial', function (accounts) {
  it("Should start with 0 balance", async function () {
    var contract = await CryptoGhostsMarket.deployed();

    await contract.setInitialOwner(accounts[0], 0);
    var balance = await contract.balanceOf.call(accounts[0]);
    assert.equal(balance.valueOf(), 1, "Didn't get the initial ghost");
    var owner = await contract.ghostIndexToAddress.call(0);
    assert.equal(owner, accounts[0], "Ownership array wrong");
    var remaining = await contract.ghostsRemainingToAssign.call();
    assert.equal(9999, remaining);

    // todo Set this back to 10000 for final runs
    var assignCoins = 100;
    for (var i=1; i<assignCoins; i++) {
      await contract.setInitialOwner(accounts[0], i);
    }

    var remainingAfter = await contract.ghostsRemainingToAssign.call();
    assert.equal(10000-assignCoins, remainingAfter);
    var balanceAfter = await contract.balanceOf.call(accounts[0]);
    assert.equal(assignCoins, balanceAfter);

  }),
    it("bulk assign", async function () {
      var contract = await CryptoGhostsMarket.deployed();
      var owners = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4], accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]];
      var ghosts = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009];
      await contract.setInitialOwners(owners, ghosts);
      for (var i = 0; i < 10; i++) {
        var currentOwner = await contract.ghostIndexToAddress.call(ghosts[i]);
        assert.equal(currentOwner, owners[i]);
      }
      var remainingAfter = await contract.ghostsRemainingToAssign.call();
      assert.equal(10000-110, remainingAfter);
    }),
    it("can not pass an invalid index to assign initial", async function () {
      var contract = await CryptoGhostsMarket.deployed();
      try {
        await contract.setInitialOwner(accounts[0], 10000);
        assert(false, "Should have thrown exception.");
      } catch (err) {
        // Should catch an exception
      }

    }),
    it("only owner can assign initial", async function () {
      var contract = await CryptoGhostsMarket.deployed();
      try {
        await contract.setInitialOwner(accounts[1], 1);
        assert(false, "Should have thrown exception.");
      } catch (err) {
        // Should catch an exception
      }

    }),
    it("Can not claim ghost after set initial owners assigned", async function () {
      var contract = await CryptoGhostsMarket.deployed();
      await contract.allInitialOwnersAssigned();
      try {
        await contract.setInitialOwner(accounts[0], 0);
        assert(false, "Should have thrown exception.");
      } catch (err) {
        // Should catch an exception
      }

    })
});

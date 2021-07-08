var TachyonToken = artifacts.require("TachyonToken");
var MerkleDistributor = artifacts.require("MerkleDistributor");
var merkleRoot = "0x6aabb8d77f9317e3ef8851407f34004826ad5d2e1f82b8c8dcac798cbe6af5b3";

module.exports = function(deployer) {
  deployer.deploy(TachyonToken, "Tachyon", "TAC", 10000000)
      .then(function () {
        return deployer.deploy(
            MerkleDistributor,
            TachyonToken.address,
            merkleRoot
        )
      });
};

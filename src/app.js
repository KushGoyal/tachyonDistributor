let currentAccount;
let displayMessage = $("#message");
displayMessage.html("");
//displayMessage.html("Click the button below to claim your tokens");
const claimButton = document.querySelector("#claimButton");
claimButton.addEventListener('click', () => {
    claimTokens();
});

const provider = new ethers.providers.Web3Provider(window.ethereum);

ethereum.on('chainChanged', (_chainId) => window.location.reload());
ethereum.on('accountsChanged', handleAccountsChanged);

// For now, 'eth_accounts' will continue to always return an array
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        displayMessage.html('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
        currentAccount = ethers.utils.getAddress(accounts[0]);
        displayMessage.html('Metamask address: ' + currentAccount);
        // Do any other work!
    }
}

async function claimTokens() {

    // connect wallet
    try {
        let accounts = await ethereum.request({method: 'eth_requestAccounts'})
        handleAccountsChanged(accounts)
    } catch (err) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            displayMessage.html('Please connect to MetaMask.');
        } else {
            console.error(err);
        }
    }

    const contractAddress = "0x710a25efF5A9CB435664084b98bD7b5359bEf25e";
    const contract = new ethers.Contract(contractAddress, merkleDistributorABI, provider.getSigner());

    if (currentAccount in merkleTree.claims) {
        const index = merkleTree.claims[currentAccount]["index"];
        const amount = parseInt(merkleTree.claims[currentAccount]["amount"], 16);
        const proof = merkleTree.claims[currentAccount]["proof"];

        try {
            const tx = await contract.claim(index, currentAccount, amount, proof);
            displayMessage.html('Waiting for the transaction to confirm...');
            // wait for the transaction to be mined
            const receipt = await tx.wait();
            displayMessage.html('Congratulations! You have claimed your tokens');
        } catch (err) {
            displayMessage.html("Error! You cannot claim the tokens.");
            console.log(err)
        }

    } else {
        displayMessage.html('Sorry, your address is not eligible to claim the tokens');
        console.log("address not found " + currentAccount)
    }

}

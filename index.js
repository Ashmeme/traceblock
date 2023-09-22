const express = require("express");
const timestamp = require("time-stamp");
const sha256 = require("js-sha256");
const app = express();

const bodyparser = require("body-parser");

class block {
  constructor(index, data, lastHash = " ") {
    this.index = index;
    this.transactions = data;
    this.time = timestamp.utc("YYYY/MM/DD:HH:mm");
    this.lastHash = lastHash;
    this.hash = this.blockHash();
    this.nonce = 0;
  }

  blockHash() {
    return sha256(
      this.index + this.lastHash + this.time + JSON.stringify(this.transactions)
    ).toString();
  }

  proofOfWork(difficulty) {
    //     while (
    //       this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    //     ) {
    //       this.nonce++;
    this.hash = this.blockHash();
    //     }
  }
}

class Blockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new block(
      0,
      timestamp.utc("YYYY/MM/DD:HH:mm"),
      "Initial Block in the Chain",
      "0"
    );
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.lastHash = this.obtainLatestBlock().hash;

    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const lastBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.lastHash !== lastBlock.hash) return false;
    }
    return true;
  }
}

let network = new Blockchain();

network.addNewBlock(
  new block(1, {
    sender: "Yasha Lava",
    recipient: "Yana Cist",
    quantity: 50,
  })
);

network.addNewBlock(
  new block(2, {
    sender: "Matt'e Ball",
    recipient: "Vochkeh Oui",
    quantity: 100,
  })
);

console.log(JSON.stringify(network, null));

app.post("/api/addBlock", (req, res) => {
  network.addNewBlock(req.body.blockdata);
  res.send("200");
});

app.listen("3000", () => {
  console.log("listenting on 3000");
});

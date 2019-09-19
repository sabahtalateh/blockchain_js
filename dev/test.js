import { Blockchain } from './blockchain';

const blockchain = new Blockchain();

let chain = {
    chain: [
        {
            index: 1,
            timestamp: 1568817365955,
            transactions: [ ],
            nonce: 931,
            hash: "0",
            prevBlockHash: "0"
        },
        {
            index: 2,
            timestamp: 1568817371693,
            transactions: [ ],
            nonce: 18140,
            hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            prevBlockHash: "0"
        },
        {
            index: 3,
            timestamp: 1568817373795,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "a5a80a20da2111e99d2a6f6f56e69658",
                    transactionId: "a9184947d9c342ba82c53b04ac85d99c"
                }
            ],
            nonce: 206271,
            hash: "0000e2fb8ceef2321c3c3c49c827eaa1f5513bdd3d651270e23b018fe9d3c984",
            prevBlockHash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            index: 4,
            timestamp: 1568817375207,
            transactions: [ ],
            nonce: 244902,
            hash: "0000f507022c82ee5ab8bdb392ba9043dffda3df7a91bb9ab4264c47a54c1d6e",
            prevBlockHash: "0000e2fb8ceef2321c3c3c49c827eaa1f5513bdd3d651270e23b018fe9d3c984"
        },
        {
            index: 5,
            timestamp: 1568817376997,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "a5a80a20da2111e99d2a6f6f56e69658",
                    transactionId: "4e96143ae035455a8194cf8738c8eafb"
                },
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "a5a80a20da2111e99d2a6f6f56e69658",
                    transactionId: "739099ab1a11441ca2b50ac8cde31a15"
                }
            ],
            nonce: 3406,
            hash: "0000ee92358f7d62a8fa9fb89873e47a8e65efc5c84ecc12d89c95d9643c88d5",
            prevBlockHash: "0000f507022c82ee5ab8bdb392ba9043dffda3df7a91bb9ab4264c47a54c1d6e"
        },
        {
            index: 6,
            timestamp: 1568817378647,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "a5a80a20da2111e99d2a6f6f56e69658",
                    transactionId: "d2679694f8324e1880b64a0dc0727e28"
                }
            ],
            nonce: 110743,
            hash: "000080bb95df066a1566bfdda7a4a9b3299bf87ee00c5f2da8556ffc9f0bb2eb",
            prevBlockHash: "0000ee92358f7d62a8fa9fb89873e47a8e65efc5c84ecc12d89c95d9643c88d5"
        },
        {
            index: 7,
            timestamp: 1568817380440,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "a5a80a20da2111e99d2a6f6f56e69658",
                    transactionId: "54ce33746ccc42b3a3b9913cec35eb9e"
                }
            ],
            nonce: 23750,
            hash: "000076e2a377f5042a191efbfb138bdce6b48f634e08dcca52efea0d0f94476f",
            prevBlockHash: "000080bb95df066a1566bfdda7a4a9b3299bf87ee00c5f2da8556ffc9f0bb2eb"
        },
        {
            index: 8,
            timestamp: 1568817381640,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "a5a80a20da2111e99d2a6f6f56e69658",
                    transactionId: "0689099baabf403a9359c59a399dcae3"
                }
            ],
            nonce: 59343,
            hash: "000026b2f7804e4415d60281b6cec159730dc9c3a823618bc588ec7b2e1eabad",
            prevBlockHash: "000076e2a377f5042a191efbfb138bdce6b48f634e08dcca52efea0d0f94476f"
        }
    ],
    pendingTransactions: [
        {
            amount: 12.5,
            sender: "00",
            recipient: "a5a80a20da2111e99d2a6f6f56e69658",
            transactionId: "06e9973838b143efb3f9bd5702ea467b"
        }
    ],
    nodeUrl: "http://localhost:3001",
    networkNodes: [ ],
    nodeAddress: "a5a80a20da2111e99d2a6f6f56e69658"
};

let valid = blockchain.chainIsValid(chain.chain);
console.log("VALID: " + valid);

// console.log(blockchain);
//
// const currentBlockData = {
//     transactions: [
//         {
//             amount: 200,
//             sender: "Alex",
//             recipient: "Jen"
//         },
//         {
//             amount: 2000,
//             sender: "Alex",
//             recipient: "Jen"
//         },
//         {
//             amount: 2000,
//             sender: "Jen",
//             recipient: "Jen"
//         }
//     ],
//     index: 2,
// };
// const tt = blockchain.hashBlock("00009a5055cd9a756df37c0aa3c5ab4f3695e8e57cf5ead7d781abb29411ebd7", currentBlockData, 44667);
// console.log(tt);


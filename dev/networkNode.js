import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid/v1';
import process from 'process';
import rp from 'request-promise';
import { Blockchain } from './blockchain';

const port = process.argv[2];

const nodeAddress = uuid().split('-').join('');

const app = express();

const nodeUrl = process.argv[3];
const bc = new Blockchain(nodeUrl, nodeAddress);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
    res.send(bc);
});

app.get('/mine', function (req, res) {
    const lastBlock = bc.getLastBlock();
    const lastBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bc.pendingTransactions,
        index: lastBlock['index'] + 1,
    };
    const nonce = bc.proofOfWork(lastBlockHash, currentBlockData);
    const currentBlockHash = bc.hashBlock(lastBlockHash, currentBlockData, nonce);
    const newBlock = bc.createNewBlock(nonce, lastBlockHash, currentBlockHash);

    const requestPromises = [];
    bc.networkNodes.forEach(nodeUrl => {
        const requestOptions = {
            uri: `${nodeUrl}/receive-new-block`,
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {
            const requestOptions = {
                uri: `${bc.nodeUrl}/transaction/broadcast`,
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: '00',
                    recipient: nodeAddress
                },
                json: true
            };

            return rp(requestOptions);
        })
        .then(data => {
            res.json({
                note: "New block mined successfully",
                block: newBlock,
            })
        });
});

app.post('/receive-new-block', function (req, res) {
    const newBlock = req.body['newBlock'];
    const lastBlock = bc.getLastBlock();
    const correctHash = newBlock.prevBlockHash === lastBlock.hash;
    const correctIndex = newBlock['index'] === lastBlock['index'] + 1;

    if (correctHash && correctIndex) {
        bc.chain.push(newBlock);
        bc.pendingTransactions = [];

        res.json({
            note: 'New block received and accepted',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected',
            newBlock: newBlock
        });
    }
});

// this node will register the other node
app.post('/register-and-broadcast-node', function (req, res) {
    // get the new node url
    const nodeUrl = req.body['node_url'];
    const nodeNotPresented = bc.networkNodes.indexOf(nodeUrl) === -1;
    const nodeNotCurrentNode = nodeUrl !== bc.nodeUrl;
    if (nodeNotPresented && nodeNotCurrentNode) {
        bc.networkNodes.push(nodeUrl);
    }

    // send requests to all the other network nodes to register
    //  the new node
    const regNodePromises = [];
    bc.networkNodes.forEach(url => {
        const requestOptions = {
            uri: `${url}/register-node`,
            method: 'POST',
            body: { node_url: nodeUrl },
            json: true
        };

        regNodePromises.push(rp(requestOptions));
    });

    Promise.all(regNodePromises)
        .then(data => {
            // Send request to the new node with the addresses
            //  of all the other nodes in the network
            const bulkRegistrationOptions = {
                uri: `${nodeUrl}/register-bulk-nodes`,
                method: 'POST',
                body: { allNetworkNodes: [...bc.networkNodes, bc.nodeUrl] },
                json: true,
            };

            return rp(bulkRegistrationOptions);
        })
        .then(data => {
            res.json({ note: 'New node registered with network successfully' })
        })
    ;
});

// this endpoint will be hit from the node that is registering a new node
//  so the other nodes in the network can add that new node into theirs
//  network nodes list

app.post('/register-node', function (req, res) {
    const nodeUrl = req.body['node_url'];
    const nodeNotPresented = bc.networkNodes.indexOf(nodeUrl) === -1;
    const nodeNotCurrentNode = nodeUrl !== bc.nodeUrl;
    if (nodeNotCurrentNode && nodeNotPresented) {
        bc.networkNodes.push(nodeUrl);
    }
    res.json({ note: 'New node registered successfully' });
});
// this endpoint will be called on a new node that was just added to the network
//  so it will receive the list of all the other network nodes
//  and add them into it's network nodes list

app.post('/register-bulk-nodes', function (req, res) {
    const allNetworkNodes = req.body['allNetworkNodes'];
    allNetworkNodes.forEach(nodeUrl => {
        const nodeNotPresented = bc.networkNodes.indexOf(nodeUrl) === -1;
        const nodeNotCurrentNode = nodeUrl !== bc.nodeUrl;
        if (nodeNotCurrentNode && nodeNotPresented) {
            bc.networkNodes.push(nodeUrl);
        }
    });

    res.json({ note: 'Bulk registration successfull' });
});

app.post('/transaction', function (req, res) {
    const transaction = req.body;
    const blockNumber = bc.addTransactionToPending(transaction);
    res.send({ 'note': `Transaction will be added to block ${blockNumber}` });
});

app.post('/transaction/broadcast', function (req, res) {
    let amount = req.body['amount'];
    let sender = req.body['sender'];
    let recipient = req.body['recipient'];

    let transaction = bc.createTransaction(amount, sender, recipient);
    bc.addTransactionToPending(transaction);

    let requestPromises = [];
    bc.networkNodes.forEach(url => {
        const requestOptions = {
            uri: `${url}/transaction`,
            method: 'POST',
            body: transaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {
            res.json('Transaction created and brodcasted successfully.')
        });
});


app.listen(port, function () {
    console.log(`Listening on port ${port}..`);
});

//import { TransactionUnspentOutput } from './js/cardano_serialization_lib.js';
const S = await import('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js');
const _Buffer = (await import('buffer/')).Buffer

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));

        str = str.substring(2, str.length);
    }
    return result;
}

export function hex2a(hexx) {
    if (!hexx) {
        return "";
    }
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

export async function getAssetDetail(asset_id) {
    var HOST = process.env.API ? process.env.API : location.origin;
    const details = await fetch(HOST+'/asset/'+asset_id, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET'
    }).then((response) => response.json());
    return details;
};

export async function getAssets() {
    const utxosList = await window.cardano.getUtxos();
    let utxos = (utxosList).map((utxo) =>
        S.TransactionUnspentOutput.from_bytes(
            _Buffer.from(utxo, "hex")
        )
    );
    var balance=0
    var assets=[]
    var count = new Map();
    utxos.forEach((tx) => {
        var txid=toHexString(tx.input().transaction_id().to_bytes())+" #"+tx.input().index()
        var ada=tx.output().amount().coin().to_str()
        var money=toHexString(tx.input().transaction_id().to_bytes())+" #"+tx.input().index()+"  "+tx.output().amount().coin().to_str()+" adalace"
        try {
            for (let i = 0; i < tx.output().amount().multiasset().len(); i++) {
            var key=tx.output().amount().multiasset().keys().get(i).to_bytes()
            var key_raw=tx.output().amount().multiasset().keys().get(i)
                for (let j=0;j<tx.output().amount().multiasset().get(key_raw).len();j++){
                    var asset_key=tx.output().amount().multiasset().get(key_raw).keys().get(j)
                    var asset=hex2a(toHexString(tx.output().amount().multiasset().get(key_raw).keys().get(j).name()))
                    var amount=tx.output().amount().multiasset().get(key_raw).get(asset_key).to_str()
                    if (key) {
                        var asset_id = `${toHexString(key)}${toHexString(tx.output().amount().multiasset().get(key_raw).keys().get(j).name())}`;
                        assets.push(asset_id);
                    }
                    money=money+" +"+amount+" "+toHexString(key)+"."+asset
                    count.set(asset, amount);
                }
            }
            console.log(assets);
        } catch(error){
            console.log("no assets");
        }
        console.log(money)
        balance=balance+parseInt(tx.output().amount().coin().to_str())
    });
    balance=balance/1000000;
    var address=utxos[0].output().address().to_bech32();
    console.log("Total ADA: "+balance);
    console.log("Address: "+address);
    return assets;
}
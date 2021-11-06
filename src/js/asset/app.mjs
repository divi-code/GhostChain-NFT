const { getAssets, getAssetDetail, hex2a } = await import('./select.mjs');
const S = await import('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js');
const _Buffer = (await import('buffer/')).Buffer;

(async function () {
    
    // The page has loaded, start the game
    let assetsMap = new Map();
    var specimenOptions = $("#options");
    var assets = await getAssets();
    for(var i=0;i<assets.length;i++) {
        const details = await getAssetDetail(assets[i]);
        let onchain = details.onchain_metadata;
        if (onchain) {
            specimenOptions.append(`<li><a href="#">${hex2a(details.asset_name)} <span class="badge">${details.quantity}</span></a></li>`);
            assetsMap.set(hex2a(details.asset_name), onchain);
        }
    }
    
    $("#options li a").each( (i, obj) => {
        obj.addEventListener('click', () => {
            const index = `${obj.text}`.indexOf(" ");
            const asset_name = obj.text.substring(0, index);
            $('#specimenDropdown').text(asset_name);
            const assetobj = assetsMap.get(asset_name);
            var myCanvas = document.getElementById('canvas');
            var ctx = myCanvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var img = new Image;
            img.onload = function(){
                ctx.drawImage(img,0,0); // Or at whatever offset you like
            };
            img.src = `https://ipfs.blockfrost.dev/ipfs/${assetobj.image.substr(6)}`;
            console.log(assetobj);
        });
    });

})();

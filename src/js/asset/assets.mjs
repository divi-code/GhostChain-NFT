const S = await import('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js')
const _Buffer = (await import('buffer/')).Buffer
window.$ = window.jQuery = import("jquery");

export const assets = await getAssets();

async function getAssets() {
    var HOST = process.env.API ? process.env.API : location.origin;
    const assets = await fetch(HOST+'/assets', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET'
    }).then((response) => response.json());
    return assets;
}

(async function() {

    // import all images for webpack copy to dist folder

    var HOST = process.env.API ? process.env.API : location.origin;
    assets.forEach((element,index) => {
        var stock = element["current_stock"];
        
        if (stock > 0) {
            $("#asset_table").append(`
            <div class="col-sm-6 col-md-4" id="img_${index}">
                <div class="thumbnail">
                <img src="${HOST}/ipfs?code=${element["ipfs"]}" alt="..." width="200" height="200">
                    <div class="caption">
                        <h3>${element["name"]}</h3>
                        <p>Available:&nbsp;${element["current_stock"]}</p>
                        <p>Total circulating:&nbsp;${element["total_mint"]}</p>
                        <p>Price:&nbsp;${element["price"]}&nbsp;tADA</p>
                        <p>Quantity:&nbsp;<input type="number" id="quantity_${index}" name="value" min="1" max="${element["current_stock"]}" value="1"></p>
                        <p><button class="btn btn-primary" role="button" id="buy_${index}">Buy</button>
                        <input type="hidden" id="asset_id${index}" value="${element["id"]}" />
                        </p>
                    </div>
                </div>
            </div>`);
        } else {
            $("#asset_table").append(`
            <div class="col-sm-6 col-md-4" id="img_${index}">
                <div class="thumbnail">
                <img src="${HOST}/ipfs?code=${element["ipfs"]}" alt="..." width="200" height="200">
                    <div class="caption">
                        <h3>${element["name"]}</h3>
                        <p>Available:&nbsp;Not available</p>
                        <p>Total circulating:&nbsp;${element["total_mint"]}</p>
                        <p>Price:&nbsp;${element["price"]}&nbsp;tADA</p>
                        </p>
                    </div>
                </div>
            </div>
            `);
        } 
    });
})()

function start_payment(index) {
    console.log(`start payment ${assets[index]}`);
}
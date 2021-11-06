import axios from 'axios'
import FormData from 'form-data';  

(function () {
    var picturebtn = $("#picturebtn");
    var fileInputBtn = $("#fileInput");
    var ipfsurl = $("#ipfsurl");
    var canvas = document.getElementById('canvas');

    fileInputBtn.on('change', function(e) { 
        var fileName = e.target.files[0].name;
        canvas.src = URL.createObjectURL(e.target.files[0]);
        canvas.onload = function() {
          URL.revokeObjectURL(canvas.src) // free memory
        }
        alert('The file "' + fileName +  '" has been selected.');
     });

    picturebtn.on('click', async () => {
        let upload = await generatePicture();
        if(upload.error == 0)
            if (upload.ipfs_hash) {
                console.log('ipfs hash:' + upload.ipfs_hash);
                ipfsurl.html(`IPFS code ${upload.ipfs_hash}`);
                ipfsurl.attr("href", `https://ipfs.io/ipfs/${upload.ipfs_hash}`);
            } else {
                alert('error saving this specimen, try again later.');
            }
	    else if(upload.error == 1)
		    alert('File uploading failed - ' + upload.message);
    });
    
    function timer() {
        // create the timer
        var curDate = new Date();

        // Set the date we're counting down to
        var countDownDate = new Date(curDate.getTime() + 1*60000).getTime();

        // Update the count down every 1 second
        var x = setInterval(function() {

            // Get today's date and time
            var now = new Date().getTime();
                
            // Find the distance between now and the count down date
            var distance = countDownDate - now;
                
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
            // Output the result in an element with id="demo"
            document.getElementById("timer").innerHTML =
            + zeroPad(minutes, 2) + ":" + zeroPad(seconds,2);
        
            // If the count down is over, write some text 
            if (distance < 0) {
                console.log(distance);
                clearInterval(x);
                timer();
                distance = 0;
            }
        }, 1000);
    }
    timer();
    
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    async function generatePicture() {
	    let return_data = { error: 0, message: '' };
        // function return value
        // var img = canvas.toDataURL();
        // Convert Base64 image to binary
        var file = document.getElementById('fileInput').files[0]; // dataURItoBlob(img);
        var HOST = process.env.API ? process.env.API : location.origin;
        const url = HOST + "/upload";
        try {
            if (!file) {
                alert('NO File has been selected');
                return;
            }
            // no file selected
            // formdata
            let data = new window.FormData();
            data.append('file', file);
            let response = await fetch(url, {
                method: 'POST',
                body: data
            });
            // server responded with http response != 200
            if(response.status != 200) {
                console.log(response)
                throw new Error('HTTP response code != 200');
            }
            let json_response = await response.json();
            return_data.ipfs_hash = json_response.ipfs_hash;
            if(json_response.error == 1)
                throw new Error(json_response.message);	
        }
        catch(e) {
            console.log(e);
            // catch rejected Promises and Error objects
            return_data = { error: 1, message: e.message };
        }
        return return_data;
    }
})();

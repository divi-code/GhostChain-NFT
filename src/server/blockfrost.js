import axios from 'axios'
import FormData from 'form-data';
import fs from 'fs';
import env from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  env.config();
  console.log('dot env config');
}

export const upload = (request, response) => {
  if (!request.files || Object.keys(request.files).length === 0) {
    console.log('no files recognised');
    return response.status(400).send('No files were uploaded.');
  }

  var file = request.files.file;  // here is the field name of the form
  if (file) {
    let formData = new FormData();
    formData.append('file', fs.createReadStream(file.file));
    var headers = formData.getHeaders();
    headers.project_id = process.env.IPFS
    axios.post('https://ipfs.blockfrost.io/api/v0/ipfs/add', formData, {
        headers: headers,
        validateStatus: (status) => {
          return status < 600;
        },
    }).then(function (res) {
      setTimeout(() => {
        removeFile(file);
        response.status(200).send(res.data);
      },
      2000);
    }).catch(function (error) {
      removeFile(file);
      console.log(error);
      var data = error.response.data;
      response.status(500).send(data);
    });
  } else {
    response.status(500).send({error: 'no files found'});
  }
};

export const blocks_latest = (request, response) => {
  axios.get('https://cardano-testnet.blockfrost.io/api/v0/blocks/latest', { headers: {
    'Content-Type': 'application/json',
    'project_id':  process.env.PROJECT_ID
  }}).then(function (res) {
    response.status(200).send(res.data);
  }).catch(function (error) {
    var data = error.response.data;
    response.status(500).send(data);
  })
};

export const parameters = (request, response) => {
  axios.get('https://cardano-testnet.blockfrost.io/api/v0/epochs/latest/parameters', { headers: {
    'Content-Type': 'application/json',
    'project_id': process.env.PROJECT_ID
  }}).then(function (res) {
    response.status(200).send(res.data);
  }).catch(function (error) {
    var data = error.response.data;
    response.status(500).send(data);
  })
};

export const assets = (request, response) => {
  const asset = request.params.asset;
  axios.get(`https://cardano-testnet.blockfrost.io/api/v0/assets/${asset}`, { headers: {
    'Content-Type': 'application/json',
    'project_id': process.env.PROJECT_ID
  }}).then(function (res) {
    response.status(200).send(res.data);
  }).catch(function (error) {
    var data = error.response.data;
    response.status(500).send(data);
  })
};

function removeFile(file) {
  console.log(`must delete file at ${file.file}`);
  fs.unlink(file.file, (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('deleted');
  })
}

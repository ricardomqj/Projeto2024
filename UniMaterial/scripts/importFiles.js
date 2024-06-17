const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const GridFSBucket = mongodb.GridFSBucket;

const mongoURI = 'mongodb://mongodb:27017';
const dbName = 'material';

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: 'files' });

    const filesDir = './public/fileStore'; // Assegure-se que este caminho é montado corretamente no Docker

    fs.readdir(filesDir, (err, files) => {
        if (err) {
            console.error('Failed to read directory', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(filesDir, file);
            const readStream = fs.createReadStream(filePath);
            const uploadStream = bucket.openUploadStream(file);
            readStream.pipe(uploadStream)
                .on('error', (err) => console.error('Failed to upload file:', file, err))
                .on('finish', () => console.log('Successfully uploaded file:', file));
        });
    });
});

const express = require('express');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

// MongoDB Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// app.post('/saveQfeData', (req, res) => {
//     exec('wmic qfe list brief /format:table', (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error: ${error.message}`);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         if (stderr) {
//             console.error(`stderr: ${stderr}`);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         // Parse the stdout and process the data
//         const lines = stdout.split('\n').map(line => line.trim()).filter(line => line !== '');
//         const data = lines.slice(2).map(line => {
//             const [des, HotFixId] = line.split(/\s{2,}/);
//             return { des,HotFixId  };
//         });

//         // Save data to MongoDB collection
//         const collection = client.db('drivers_restore').collection('restore');
//         collection.insertMany(data).then(result => {
//             console.log('Data inserted:', result.insertedCount);
//             res.json({ message: 'Data inserted successfully' });
//         }).catch(err => {
//             console.error('Error inserting data into MongoDB:', err);
//             res.status(500).send('Internal Server Error');
//         });
//     });
// });


app.post('/saveQfeData', (req, res) => {
    exec('wmic qfe list brief /format:table', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse the stdout and process the data
        const lines = stdout.split('\n').map(line => line.trim()).filter(line => line !== '');
        const data = lines.slice(2).map(line => {
            const [des, HotFixId] = line.split(/\s{2,}/);
            return { des, HotFixId };
        });

        // Save data to MongoDB collection if it doesn't already exist
        const collection = client.db('drivers_restore').collection('restore');
        const promises = data.map(item => {
            return collection.findOne({ HotFixId: item.HotFixId })
                .then(existingItem => {
                    if (!existingItem) {
                        return collection.insertOne(item);
                    }
                });
        });

        Promise.all(promises)
            .then(() => {
                console.log('Data inserted successfully');
                res.json({ message: 'Data inserted successfully' });
            })
            .catch(err => {
                console.error('Error inserting data into MongoDB:', err);
                res.status(500).send('Internal Server Error');
            });
    });
});


app.get('/saveQfeData', (req, res) => {
    // Access the MongoDB collection
    const collection = client.db('drivers_restore').collection('restore');

    // Retrieve data from MongoDB including only the 'des' and 'HotFixId' fields
    collection.find({}, { projection: { _id: 0, des: 1, HotFixId: 1 } }).toArray((err, data) => {
        if (err) {
            console.error('Error fetching data from MongoDB:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Send the data as a response
        res.json(data);
    });
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const mongoose = require('mongoose');
const cities = require('./cities'); // Ensure path is correct
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    try {
        console.log("Imported cities type:", typeof cities);
        console.log("Imported cities example:", cities[0]);
        console.log("Imported cities length:", cities.length);

        await Campground.deleteMany({});
        console.log("All campgrounds deleted");

        for (let i = 0; i < 50; i++) {
            const randomIndex = Math.floor(Math.random() * cities.length);

            if (!cities[randomIndex]) {
                console.error(`Invalid city at index ${randomIndex}, skipping...`);
                continue;
            }

            const camp = new Campground({
                location: `${cities[randomIndex].city}, ${cities[randomIndex].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
            });

            await camp.save();
        }

        console.log("Database seeded successfully");
    } catch (err) {
        console.error("Error during database seeding:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();

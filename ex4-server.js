//Yuqian Cai 40187954
const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 5360;
const fs = require('fs'); //file system
const session = require('express-session');
const userFilePath = path.join(__dirname, 'text-files', 'login.text');
const petsFilePath = path.join(__dirname, 'text-files', 'avaliablePetInfo.text');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images') // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        // Use the original filename
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.json(),
    express.urlencoded({
        extended: true,
    }));
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/pets', (req, res) => {
    fs.readFile(petsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error loading pet data.");
        }
        const petLines = data.trim().split('\n');
        const pets = [];

        for (let i = 0; i < petLines.length; i++) {
            const line = petLines[i];
            const parts = line.split(':');
            const pet = {
                id: parts[0],
                ownerName: parts[1],
                type: parts[2],
                breed: parts[3],
                age: parts[4],
                gender: parts[5],
                getAlongCats: parts[6],
                getAlongDogs: parts[7],
                goodWithChildren: parts[8],
                imageUrl: parts[9],
                about: parts[10]
            };
            pets.push(pet);
        }

        res.render('pets', { pets }); // Assuming 'pets.ejs' is your EJS template
    });
});
app.get('/find', (req, res) => {
    res.render('find');
}); 
app.get('/dog-care', (req, res) => {
    res.render('dog-care');
});
app.get('/cat-care', (req, res) => {
    res.render('cat-care');
});
app.get('/giveaway', (req, res) => {
    res.render('giveaway', { message: '' });
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/privacy', (req, res) => {
    res.render('privacy');
});
app.get('/sign-up', (req, res) => {
    res.render('sign-up', { message: '' });
});
app.get('/login', (req, res) => {
    res.render('login', { message: '' });
});
//log out 
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.error('Failed to destroy the session during logout.', err);
        }

        res.clearCookie('connect.sid'); // Clears the session cookie
        res.render('logout', { message: 'You have been successfully logged out.' });
    });
});

//Find a cat/dog
app.post('/find', (req, res) => {
    const { petType, breed, age, gender, compatibilityDogs, compatibilityCats, compatibilityChildren } = req.body;
    fs.readFile(petsFilePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("An error occurred processing your request.");
        }

        const lines = data.trim().split('\n');
        const filteredPets = [];

        for (let i = 0; i < lines.length; i++) {
            const [id, owner, type, breedName, petAge, petGender, getsAlongDogs, getsAlongCats, goodWithChildren, imageUrl, comments] = lines[i].split(':');
            
            const matchesType = !petType || type === petType;
            const matchesBreed = !breed || breed === 'Any' || breedName === breed;
            const matchesAge = !age || age === 'Any' || petAge === age;
            const matchesGender = !gender || gender === 'Any' || petGender === gender;
            const matchesDogs = compatibilityDogs === 'on' ? getsAlongDogs === 'Yes' : true;
            const matchesCats = compatibilityCats === 'on' ? getsAlongCats === 'Yes' : true;
            const matchesChildren = compatibilityChildren === 'on' ? goodWithChildren === 'Yes' : true;

            if (matchesType && matchesBreed && matchesAge && matchesGender && matchesDogs && matchesCats && matchesChildren) {
                filteredPets.push({
                    id, owner, type, breed: breedName, age: petAge, gender: petGender,
                    getsAlongWithDogs: getsAlongDogs === 'Yes' ? 'Yes' : 'No',
                    getsAlongWithCats: getsAlongCats === 'Yes' ? 'Yes' : 'No',
                    goodWithChildren: goodWithChildren === 'Yes' ? 'Yes' : 'No',
                    comments, imageUrl
                });
            }
        }
        console.log(filteredPets);
        res.render('find', { pets: filteredPets });
    });
});


// Handle account creation form submission
app.post('/sign-up', (req, res) => {
    const { username, password } = req.body;

    // Read the entire file and store the contents in 'accountData'
    const accountData = fs.readFileSync(userFilePath, 'utf8');
    // Check if the username is already in use
    if (accountData.includes(`${username}:`)) {
        res.render('sign-up', { message: 'Username is already in use. Please choose another one.' });
    } else {
        // Append the new username and password to the file
        fs.appendFileSync(userFilePath, `${username}:${password}\n`);
        const script = `
        <script>
            alert('Account successfully created. You are now ready to login.');
            window.location.href = '/login';
        </script>
    `;
        res.send(script);
    }
});
//log in
app.post('/login', (req, res) => {
    const { username, password } = req.body;// from user
    const credentials = `${username}:${password}`; // into format

    const loginData = fs.readFileSync(userFilePath, 'utf8');
    const logins = loginData.split('\n');//array of user info

    const loginExists = logins.some(login => login.trim() === credentials);

    if (loginExists) {
        // Create session and redirect to the form if authentication success
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/giveaway');
    } else {
        res.render('login', { message: 'Login failed. Please check your username and password.' });

    }
});
app.post('/giveaway', upload.single('petPicture'), (req, res) => {
    //checking whether login or not by username existing or not from session 
    if (!req.session.username) {
        return res.render('login', { message: 'Please login to give away a pet.' });
    }

    // File information is now in req.file
    const imagePath = req.file ? req.file.path : 'default/path/if/no/file'; // Handling case if no file is uploaded
    console.log(imagePath);
    const formData = req.body;
    const username = req.session.username; // Retrieve username from session

    const getsAlongWithDogs = formData.compatibilityDogs ? "Yes" : "No";
    const getsAlongWithCats = formData.compatibilityCats ? "Yes" : "No";
    const goodWithChildren = formData.compatibilityChildren ? "Yes" : "No";

    fs.readFile(petsFilePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("An error occurred processing your request.");
        }
        const lines = data.trim().split('\n');
        const nextId = lines.length + 1;

        const newRecord = [
            nextId,
            username,
            formData.petType,
            formData.breed,
            formData.age,
            formData.gender,
            getsAlongWithDogs, getsAlongWithCats, goodWithChildren,
            imagePath.replace('public/', ''),
            formData.comments.replace(/:/g, ';'),
        ].join(':');

        fs.appendFile(petsFilePath, `\n${newRecord}`, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return res.status(500).send("An error occurred processing your request.");
            }
            res.render('giveaway', { message: 'Pet information successfully added! Thank you for your information.' });
        });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://soen287.encs.concordia.ca:${port}/home`);
});


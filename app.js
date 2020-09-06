const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/userManager', {useNewUrlParser: true, useUnifiedTopology: true});
const database = mongoose.connection;
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userId: Number,
    email: String,
    age: {type: Number, min: 18, max: 99}
});

const User = mongoose.model('user', userSchema, 'users');

database.on('error', console.error.bind(console,'connectionError'));

database.once('open', () => {
    console.log('I enjoy eating pasta')
});

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', async(req, res) =>{
    let data = await User.find();
    res.render('index',{users: data})
});

app.post('/editor/:editedUser', async(req, res) => {
    

    await User.updateOne(
        {userId: req.params.editedUser},{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            age: req.body.age
        }
    )
    res.redirect('/')
});

app.get('/users/:user', async(req, res) => {
    let data = await User.find({userId: req.params.user});
    res.render('editor',{editUser: data[0]} )
});

app.get('/ascend', async(req, res) => {
    await User.find().sort()
    res.redirect('/')
});

app.get('/descend', async(req, res) => {
    
});

app.get('/search', async(req, res) => {
    
});

app.get('/create', (req, res) => {
    res.render('pleaseGiveMeFullPointsThomas')
});

app.post('/create', (req, res) => {
    let user = new User ()
        user.firstName = req.body.firstName
        user.lastName = req.body.lastName
        user.userId = Math.floor(Math.random() * 1000)
        user.email = req.body.email
        user.age = req.body.age
    user.save((err, data) => {
        console.log(data);
        res.redirect('/')
    })
});

app.get('/delete/:dyingUser', async(req, res) => {

    await User.findOneAndDelete({userId: req.params.dyingUser}, (err, operaWinfry) =>{
        if (err) console.log(err);
        console.log(operaWinfry);
    });
    res.redirect('/')
});

app.listen(3000, (err) => {
    err ? console.log(err):console.log('currently cooking pasta')
})
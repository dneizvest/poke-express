require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express")
const app = express()
const Pokemon  = require("./models/pokemon")
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.engine('jsx', require('express-react-views').createEngine())
app.set('view engine', 'jsx')
app.use(express.static('styles'))
app.use(express.urlencoded({ extended: false }))

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.once('open', () => {
    console.log("connected to MongoDB");
})

// Index
app.get("/", (req, res) => {
    //find all fruits
    Pokemon.find({}, (error, allPokemon)=>{
      res.render('Index', {
        Pokemon: allPokemon
      })
    }) 
  });

// New
app.get("/new", (req, res) => {
    res.render('New')
});

// Post
app.post('/pokemon', (req, res) => {
    Pokemon.create(req.body, (error, createdPokemon) => {
        res.redirect("/");
    });
})

// Show
app.get( '/pokemon/:id', (req, res) => {
    Pokemon.findById(req.params.id, (err, foundPokemon) => {
        res.render('Show', {
            pokemon: foundPokemon
        })
    })
});

// Edit
app.get('/pokemon/:id/edit', (req, res)=> {
    // finding pokemon by ID
    // render an edit form
    // pass in the pokemon data "payload"
    Pokemon.findById(req.params.id, (err, foundPokemon) => {
        res.render('Edit', {
            pokemon: foundPokemon
        })
    })
})
// Update
app.put('/pokemon/:id', (req, res) => {
    // find the pokemon by ID and update
    // redirect to the pokemon's show page
    Pokemon.findByIdAndUpdate(req.params.id, req.body, (err, updatedPokemon) => {
        console.log(updatedPokemon)
        res.redirect(`/pokemon/${req.params.id}`)
    })
})

// Delete
app.delete('/pokemon/:id', (req, res)=>{
    Pokemon.findByIdAndRemove(req.params.id, (err, deletedPokemon) => {
        res.redirect('/')
    })
});

// Port
app.listen( 3000, () => {
    console.log("listening")
});
const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')

const app = express()

let items = []
let work=[]


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get('/', (req, res) => {
    
        let day = date()
          res.render('list', {listTitle: day, newListItems: items})


    })

app.get('/work', (req, res) => {
              const day = 'Work day'
              res.render('list', {listTitle: day, newListItems: work})

})

app.get('/about', (req, res) => {
    res.render('about')
})

app.post("/", (req, res)=> {
  let  item = req.body.lists
    if(req.body.list === 'work'){
        work.push(item)
        res.redirect("/work")
    } else{
        items.push(item)
        res.redirect("/")
    }



})

app.post("/work", (req, res)=> {
  let  item = req.body.lists
 work.push(item)
    res.redirect("/work")

})



app.listen(3000, () => {
    console.log('server is running over here at port 3000')
})



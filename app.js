    const express = require('express')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const _ = require('lodash')

    const app = express()

    // let items = ['cook food', 'buy food', 'eat food']
    // let work=[]


    app.set('view engine', 'ejs');


    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static("public"))

    mongoose.connect('mongodb://localhost:27017/v3todolist').then(() => console.log(' Database connected successfully')).catch((error) => console.log(error.message))

    let itemsSchema = {
        name: String
    }

    const Item = mongoose.model('Item', itemsSchema)

    const item1 = new Item({
        name: 'Welcomed to my do list app'
    })
    const item2 = new Item({
        name: 'click the button to add new items'
    })
    const item3 = new Item({
        name: 'hit this to delete'
    })

    const defaultItems = [item1,item2,item3]

    const listSchema = {
        name: String,
        item: [itemsSchema]
    }

    const List = mongoose.model('List', listSchema)


    app.get('/', async(req, res, next) => {
        
        try {
        const result = await Item.find({})   

        if (result.length === 0) {
            async function insertingDefaultItems() {
        try {
            await Item.insertMany(defaultItems)
        
        } catch (error) {
            console.log(error.message)
        }
    }
    insertingDefaultItems()
    res.redirect("/")
        } else {
            
            res.render('list', {listTitle: 'Today', newListItems: result})
        }
        


        } catch (error) {
            console.log(error.message)
        }


        })

        app.get('/:customListName', async (req, res, next)=> {
                const customListName = _.capitalize(req.params.customListName)

            

             
                    const existingList = await List.findOne({ name: customListName });
                    
           if(!existingList){

                    const list = new List({
                    name: customListName,
                    item: defaultItems
                     })
                    list.save();
                     res.redirect('/' + customListName)
    
            } else{
            res.render('list', {listTitle:  existingList.name, newListItems: existingList.item})
           }


             
        })


   
    app.post("/", async (req, res)=> {
    let  itemName = req.body.lists
    let listItem = req.body.list

    let PostItem = new Item({
        name: itemName
    })

        if(listItem === 'Today'){
                PostItem.save()
                res.redirect("/")
        } else{
         const foundItem = await  List.findOne({name: listItem})
          foundItem.item.push(PostItem)
          foundItem.save()
          res.redirect('/'+ listItem)
        }





    })




    // app.post("/work", (req, res)=> {
    //   let  item = req.body.lists
    //  work.push(item)
    //     res.redirect("/work")

    // })

    app.post("/delete", async (req, res) => {
        try {
        const checkedItem = req.body.checkbox
        const listName = req.body.listName

        if(listName === 'Today'){
            await Item.deleteOne({_id: checkedItem})
            res.redirect('/')
             console.log('Great youve deleted a completed task')
        } else{
          await  List.findOneAndUpdate({name: listName},{$pull: { item: {_id: checkedItem} }}, { new: true })
          res.redirect("/" + listName);

        }



        
    } catch (error) {
    console.log(error.message)   
    }
    })



    app.listen(3000, () => {
        console.log('server is running over here at port 3000')
    })



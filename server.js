'use strict'

const express=require('express');
const axios=require('axios');
const cors=require('cors');
const dotenv=require('dotenv');

dotenv.config();

const PORT=process.env.PORT;

const app=express();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/coffee', {useNewUrlParser: true, useUnifiedTopology: true});

const coffeeSchema = new mongoose.Schema({
    title: String,
    ingredients:String,
    image_url: String,
    id:String,
  });

  const coffeeModal = mongoose.model('coffee', coffeeSchema);

app.get('/',(req,res)=>{
    res.status(200).send("Home route")
})

app.get('/getdata',(req,res)=>{
    const URL="https://coffeepedias.herokuapp.com/coffee-list/";
    axios.get(URL) 
    .then(reslut =>{
        // console.log(reslut.data)
      res.status(200).send(reslut.data)
    })
    .catch((err)=>{
        console.log("error2",err)
    })
})
///////////////added to db using post method

app.post('/addTofav',(req,res)=>{
    const{title,ingredients,image_url,id}=req.body
   const newObj=new coffeeModal({
    title:title,
    ingredients:ingredients,
    image_url:image_url,
    id:id,
   })
   newObj.save();
   res.status(200).send("new obj has been added ")

})

//////////////////////////////display
app.get('/display',(req,res)=>{
    coffeeModal.find({},(err,favData)=>{
        if(err){
            console.log("error3",err)
        }else
        {
            res.status(200).send(favData)
        }
    })
})

//////////////delete by id ///////////////
app.delete('/delete/:id',(req,res)=>{
    const {id}=req.params
    coffeeModal.findOneAndDelete({_id:id},(err,favData)=>{
        if(err){
            console.log("tryagain",err)
        }else{
            coffeeModal.find({},(err,favData)=>{
                res.status(200).send(favData)
            })
        }
    })
})

///////////////////update
app.put('/update',(req,res)=>{
    const{title,ingredients,image_url,id}=req.body
    coffeeModal.findOne({_id:id},(err,favData)=>{
        if(err){
            console.log("err",err)
        }else{
            favData.title=title;
            favData.ingredients=ingredients;
            favData.image_url=image_url;
            favData.save()
            .then(()=>{
                coffeeModal.find({},(err,FavData)=>{
                    res.status(200).send(favData)
                })
            })
        }
    })
})

app.listen(PORT ,()=>{
    console.log(`Hello from the other side : ${PORT}`);
})
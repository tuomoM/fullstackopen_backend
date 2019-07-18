

const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const errorHandler = (error,reques,response,next)=>{
    console.log('error handler routine 1')
    if(error.name==='ValidationError'){
        return response.status(400).json({error: error.message})

    }else{
        console.log('else')
    next(error)
    }
}
/*


const newId = ()=>{
    let id = 0
    do{
    id = Math.round(Math.random()* Math.floor(100))
    }while(persons.find(p=> p.id === id))
    return id
}
*/

app.use(bodyParser.json())

app.use(cors())
const Person = require('./models/persons.js')


morgan.token('body',a = (req,res)=>{return(JSON.stringify(req.body))})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

app.get('/api/persons',(req,res,next) =>{
    Person.find({}).then(persons=>{
        res.json(persons)
    })
} )


app.put('/api/persons/:id',(req,res,next)=>{
 const body = req.body
 const person = {
     name : body.name,
     number: body.number
 }
Person.findByIdAndUpdate(req.params.id,person,{new:true})
      .then(updatedPerson =>{
          res.json(updatedPerson.toJSON())
      }).catch(error=>next(error))
})
app.delete('/api/persons/:id',(req,res,next)=>{
    Person.findByIdAndDelete(req.params.id).then(result=>{
        res.status(204).end()
    }).catch(error => next(error))
    
    //const id = Number(req.params.id) 
    //persons = persons.filter(person => person.id !== id)

    //res.status(204).end()
})
//const checkName= (name) =>{
//return((persons.find(p=>p.name===name)!==undefined))
// to be updated to database use
//}

app.get('/api/persons/:id',(req,res,next) =>{
Person.findById(req.params.id).then(person =>{
  res.json(person.toJSON())
}).catch(error =>next(error))
})

app.get('/api/info',(req,res)=>{

    Person.countDocuments({}).then(p=>{
    res.send('<p>Phonebook has info for ' + p+' people</p>'
    +'<p>'+new Date()+' </p>' )}).catch(error =>next(error))
    

})

app.post('/api/persons',(req,res,next)=>{
    const body = req.body
   /* if(!body){
        return res.status(400).json({
            error: 'content missing'
        })

    //}else if(body.name===''){
    //    return res.status(400).json({
      //      error: 'name missing'
      //  })

    //}else if(checkName(body.name)){ // to be recreated for database use
    //    return res.status(400).json({
     //       error: 'name already on database'
    //    })
    //}else if(body.number===""){
      //  return res.status(400).json({
     //       error: 'number missing'
   // })

 
}
/*Person.find({"name:":body.name})
.then(result =>{
    if(result){
    return res.status(400).json({
        error: 'name already on database'
    
    })}
})
*/
    const person = new Person({
        name   : body.name,
        number : body.number,
    })
    console.log('create try')
    person.save().then(savedPerson =>{
        res.json(savedPerson.toJSON())
    }).catch(error =>{
        console.log('errorhandling start..')
        next(error)})
    
})
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})

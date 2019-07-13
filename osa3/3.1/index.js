

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


let persons = 
    [{
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }]
const newId = ()=>{
    let id = 0
    do{
    id = Math.round(Math.random()* Math.floor(100))
    }while(persons.find(p=> p.id === id))
    return id
}
const app = express()
app.use(bodyParser.json())
app.use(cors())

morgan.token('body',a = (req,res)=>{return(JSON.stringify(req.body))})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.get('/api/persons',(req,res) =>{
    res.json(persons)
} )


app.delete('/api/persons/:id',(req,res)=>{
    
    const id = Number(req.params.id) 
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})
const checkName= (name) =>{
return((persons.find(p=>p.name===name)!==undefined))
}

app.get('/api/persons/:id',(req,res) =>{
const id = Number(req.params.id)    
const person = persons.find(person=> person.id ===id)
if(person){
res.json(person)
}else{
    res.status(404).end()

}
})
app.get('/api/info',(req,res)=>{
    res.send('<p>Phonebook has info for ' + persons.length+' people</p>'
    +'<p>'+new Date()+' </p>' )
    

})

app.post('/api/persons',(req,res)=>{
    const body = req.body
    if(!body){
        return res.status(400).json({
            error: 'content missing'
        })

    }else if(body.name===''){
        return res.status(400).json({
            error: 'name missing'
        })

    }else if(checkName(body.name)){
        return res.status(400).json({
            error: 'name already on database'
        })
    }else if(body.number===""){
        return res.status(400).json({
            error: 'number missing'
    })
}
    const person ={
        name   : body.name,
        number : body.number,
        id     : newId()
    }
    persons = persons.concat(person)
    res.json(person)
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})

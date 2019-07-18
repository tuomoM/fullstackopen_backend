const mongoose = require('mongoose')


if (process.argv.length<3){
    console.log('give password as an argument')
    process.exit(1)
}
const password = process.argv[2]

const url =
`mongodb+srv://fullstackuser:${password}@moocfullstacktuomo-h1vor.mongodb.net/persons?retryWrites=true&w=majority
`
mongoose.connect(url,{useNewUrlParser: true})
const personSchema = new mongoose.Schema({
   
    name: String,
    number: String
    

})

const Person = mongoose.model('Person',personSchema)
if(process.argv.length === 3){
    console.log('phonebook')
Person.find({}). then(persons=>{
    persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
        
    })
    mongoose.connection.close()
})
}else{


const person = new Person({
    name: process.argv[3],
    number: process.argv[4]

})
person.save().then(result =>{
    console.log('person saved')
    mongoose.connection.close()
})
}
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url,{useNewUrlParser:true})
.then(result=>{

}).catch((error)=>{
    next(error)
})

const personSchema = new mongoose.Schema({
    name: {type: String, required: true, unique:true},
    number: {type:String, required: true, minlength: 5}
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
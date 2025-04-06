const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    user:{ // Assuming this is the username
        type:String,
        required:true,
        unique: true // Added unique constraint for username
    },
    email:{
        type:String,
        required:true,
        unique: true // Added unique constraint for email
    },
    password:{
        type:String,
        required:true,
    },
    role: { // Added role field
        type: String,
        enum: ['customer', 'admin'], // Define possible roles
        default: 'customer' // Default role is customer
    }
})

module.exports=mongoose.model('User',UserSchema)

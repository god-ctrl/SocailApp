const mongoose = require('mongoose');


const multer = require('multer');

const path = require('path');

const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true,

    },
    name:{
        type: String,
        required:true
    },
    avatar: {
        type:String
    },
    friends: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }

    ]
    

},{
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });


  //static functions
//   const upload = multer({ storage: storage, limits: { fieldSize: 10 * 1024 * 1024 } });
  userSchema.statics.uploadedAvatar = multer({storage: storage,limits: { fieldSize: 10 * 1024 * 1024 }}).single('avatar');
  userSchema.statics.avatar_path = AVATAR_PATH;

const User= mongoose.model('User',userSchema);
module.exports = User;
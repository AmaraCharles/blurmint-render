const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
  },
  copytrading: {
    type: String,
    
  },

  socialUsernames: {
    type: Array,
    
  },
  phoneNumber: {
    type: String,
    
  },
  spotBalance: {
    type: String,
    
  },
  verify: {
    type: String,
    
  },
  collections: {
    type: Array,
    
  },
  artWorks: {
    type: Array,
    
  },
  auctions: {
    type: Array,
    default: []
  },
  verification:{
type:Array
  },
 
  trader: {
    type: String,
    
  },
  condition: {
    type: String,
    
  },
  kyc: {
    type: String,
    
  },
  username: {
    type: String,
    
  },
  creatorAvatar: {
    type: String,
    
  },

  
 bio: {
    type: String,
    
  },
   socials: {
    type: Object,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  referralCode:{
    type:String,
  },
  referredUsers:{
    type:Array,
  },
  planHistory:{
    type:Array,
  },
  referredBy:{
    type:String,
  },
  plan:{
    type:String,
  },
 
 
  password: {
    type: String,
    required: true,
    min: 6,
    max: 50,
  },
  amountDeposited: {
    type: String,
  },
  profit: {
    type: String,
  },
  balance: {
    type: String,
  },
  referalBonus: {
    type: String,
  },
  transactions: {
    type: Array,
  },
  accounts: {
    type: Object,
  },
  withdrawals: {
    type: Array,
  },
  verified: {
    type: Boolean,
  },
  isDisabled: {
    type: Boolean,
  },
   exhibitions: [
    {
      name: { type: String },
      description: { type: String },
      fee: { type: String },
      banner: { type: String },
      image: { type: String },
      artworks: [String], // Array of artwork IDs
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("users", UsersSchema);

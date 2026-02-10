var express = require("express");
var { hashPassword,sendPasswordOtp,userRegisteration,sendValidationOtp,sendRegOtp, sendWelcomeEmail,resendWelcomeEmail,resetEmail, sendUserDetails, userRegisteration } = require("../../utils");
const UsersDatabase = require("../../models/User");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");
const speakeasy = require('speakeasy');

const secret = speakeasy.generateSecret({ length: 4 });


// Function to generate a random referral code
function generateReferralCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

// Function to ensure referral codes are unique in the database
async function getUniqueReferralCode(length = 6) {
  let code;
  let exists = true;

  while (exists) {
    code = generateReferralCode(length);
    exists = await UsersDatabase.findOne({ referralCode: code });
  }

  return code;
}


router.post("/register", async (req, res) => {
   const { name, username, email, password, wallet, referralCode,referralEmail } = req.body;


   
  try {
    // Check if any user has that email
    const user = await UsersDatabase.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email address is already taken",
      });
    }

  // Generate OTP
    const otp = speakeasy.totp({
      secret: process.env.SECRET_KEY,
      encoding: "base32",
    });
    const otpExpiration = Date.now() + (5 * 60 * 1000); // 5 min

    // Random avatar
    const nftArtworks = [
      { title: "Bored Ape #148", url: "https://ipfs.io/ipfs/QmQ6VgRFiVTdKbiebxGvhW3Wa3Lkhpe6SkWBPjGnPkTttS/1484.png" },
      { title: "Bored Ape #3547", url: "https://ipfs.io/ipfs/QmQ6VgRFiVTdKbiebxGvhW3Wa3Lkhpe6SkWBPjGnPkTttS/3547.png" },
      { title: "Bored Ape #7070", url: "https://ipfs.io/ipfs/QmQ6VgRFiVTdKbiebxGvhW3Wa3Lkhpe6SkWBPjGnPkTttS/7070.png" },
      { title: "Bored Ape #9996", url: "https://ipfs.io/ipfs/QmQ6VgRFiVTdKbiebxGvhW3Wa3Lkhpe6SkWBPjGnPkTttS/9996.png" }
    ];
    const avatar = nftArtworks[Math.floor(Math.random() * nftArtworks.length)].url;

    // Hash password
    const hashedPassword = hashPassword(password);
    if (!hashedPassword) {
      throw new Error("Password hashing failed");
    }

    // Find the referrer based on the provided referral code
    let referrer = null;
    
    if (referralCode) {
      referrer = await UsersDatabase.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: "Invalid referral code",
        });
      }
    }

   // Create user object
    const newUser = {
      name,
      username,
      email,
      creatorAvatar: avatar,
      wallet,
      artWorks: [],
      collections: [],
      balance: 0,
      profit: 0,
      bio: "",
      socials: {},
      verification: [],
      socialUsernames: [],
      password: hashedPassword,
      transactions: [],
      withdrawals: [],
      referredUsers: [],
      referralCode: await getUniqueReferralCode(6), // unique referral code
      referralEmail:referralEmail,
      referredBy: referrer.username, // store referrer
      verify: "pending"
    };




    if (referrer) {
      newUser.referredBy=referrer.username;
      referrer.referredUsers.push(newUser.username);
      await referrer.save();
    }

    // Generate a referral code for the new user only if referralCode is provided
    // if (referralCode) {
    //   newUser.referralCode = generateReferralCode(6);
    // }

    // If there's a referrer, update their referredUsers list
   
    // Save new user
    const createdUser = await UsersDatabase.create(newUser);

    // Generate token
    const token = uuidv4();

    // Send welcome email
    // sendWelcomeEmail({ to: email, otp, token });
    // userRegisteration({ name, email });

    return res.status(201).json({
      code: "Ok",
      data: createdUser,
      otp,
      otpExpiration,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }


});


router.post("/register/validate", async (req, res) => {
  const {email}=req.body
  // Generate OTP
  const otp = speakeasy.totp({
    secret: process.env.SECRET_KEY, // Secure OTP generation
    encoding: "base32",
  });

  // Set OTP expiration time (5 minutes from now)
  const otpExpiration = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds

 
  try {
   
   
   
    
    // Send welcome email with OTP
    sendValidationOtp({ to: email, otp });
   
    // Return success response with OTP and expiration time in the response
    return res.status(200).json({
      code: "Ok",
      // data: createdUser,
      otp: otp, // OTP in the response
      otpExpiration: otpExpiration, // Include expiration time
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


router.post("/register/validate/resend", async (req, res) => {
 const {email}=req.body
  // Generate OTP
  const otp = speakeasy.totp({
    secret: process.env.SECRET_KEY, // Secure OTP generation
    encoding: "base32",
  });

  // Set OTP expiration time (5 minutes from now)
  const otpExpiration = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds

  try {
   
   
   
    
    // Send welcome email with OTP
    sendValidationOtp({ to: email, otp });
   
    // Return success response with OTP and expiration time in the response
    return res.status(200).json({
      code: "Ok",
      // data: createdUser,
      otp: otp, // OTP in the response
      otpExpiration: otpExpiration, // Include expiration time
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});



// router.post("/register", async (req, res) => {
//   const { name, lastName, email, password, country, referralCode } = req.body;

//   try {
//     // Check if any user has that email
//     const user = await UsersDatabase.findOne({ email });

//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "Email address is already taken",
//       });
//     }

//     // Find the referrer based on the provided referral code
//     let referrer = null;
//     if (referralCode) {
//       referrer = await UsersDatabase.findOne({ referralCode });
//       if (!referrer) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid referral code",
//         });
//       }
//     }

//     // Create a new user with referral information
//     const newUser = {
//       name,
//       lastName,
//       email,
//       password: hashPassword(password),
//       country,
//       amountDeposited: 0,
//       profit: 0,
//       balance: 0,
//       referalBonus: 0,
//       transactions: [],
//       withdrawals: [],
//       accounts: {
//         eth: {
//           address: "",
//         },
//         ltc: {
//           address: "",
//         },
//         btc: {
//           address: "",
//         },
//         usdt: {
//           address: "",
//         },
//       },
//       verified: false,
//       isDisabled: false,
//     };

//     // Generate a referral code for the new user only if referralCode is provided
//     if (referralCode) {
//       newUser.referralCode = generateReferralCode(6);
//     }

//     // If there's a referrer, update their referredUsers list
//     if (referrer) {
//       newUser.referredBy = referrer._id;
//       referrer.referredUsers.push(newUser._id);
//       await referrer.save();
//     }

//     // Create the new user in the database
//     const createdUser = await UsersDatabase.create(newUser);
//     const token = uuidv4();
//     sendWelcomeEmail({ to: email, token });

//     return res.status(200).json({ code: "Ok", data: createdUser });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });


// router.post("/register", async (req, res) => {
//   const { name, lastName, email, password, country } = req.body;

//   //   check if any user has that username
//   const user = await UsersDatabase.findOne({ email });

//   // if user exists
//   if (user) {
//     res.status(400).json({
//       success: false,
//       message: "email address is already taken",
//     });
//     return;
//   }

//   await UsersDatabase.create({
//     name,
//     lastName,
//     email,
//     password: hashPassword(password),
//     country,
//     amountDeposited: 0,
//     profit: 0,
//     balance: 0,
//     referalBonus: 0,
//     transactions: [],
//     withdrawals: [],
//     accounts: {
//       eth: {
//         address: "",
//       },
//       ltc: {
//         address: "",
//       },
//       btc: {
//         address: "",
//       },
//       usdt: {
//         address: "",
//       },
//     },
//     verified: false,
//     isDisabled: false,
//   })
//     .then((data) => {
//       return res.json({ code: "Ok", data: user });
//     })
//     .then(() => {
//       var token = uuidv4();
//       sendWelcomeEmail({ to: req.body.email, token });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     });
// });



router.post("/register/resend", async (req, res) => {
  const { email } = req.body;
  const user = await UsersDatabase.findOne({ email });
  const otp = speakeasy.totp({
    secret: process.env.SECRET_KEY, // Secure OTP generation
    encoding: "base32",
  });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  const otpExpiration = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds

  try {
    
    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP resent successfully",
      otp:otp,
      otpExpiration: otpExpiration,
    });
    
 sendRegOtp({to:req.body.email,otp})
   
    // sendUserDetails({
    //   to:req.body.email
    //   });
      

  } catch (error) {
    console.log(error);
  }
});


router.post("/register/reset", async (req, res) => {
  const { email } = req.body;
  const user = await UsersDatabase.findOne({ email });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    
    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP resent successfully",
    });

    resetEmail({
      to:req.body.email
    });


   

  } catch (error) {
    console.log(error);
  }
});

router.post("/register/otp", async (req, res) => {
  const { email } = req.body;
  const { password }=req.body;
  const {name }=req.body;
  const user = await UsersDatabase.findOne({ email });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    
    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP correct ",
    });

    sendUserDetails({
      to:req.body.email,
      password:req.body.password,
      name:req.body.name
    });


   

  } catch (error) {
    console.log(error);
  }
});




// const express = require("express");
// const { hashPassword, sendWelcomeEmail, resendWelcomeEmail } = require("../../utils");
// const UsersDatabase = require("../../models/User");
// const router = express.Router();
// const { v4: uuidv4 } = require("uuid");

// // Function to generate a referral code
// function generateReferralCode(length) {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let code = "";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     code += characters.charAt(randomIndex);
//   }

//   return code;
// }



// // Your registration route

// // Your registration route
// router.post("/register", async (req, res) => {
//   const { name, lastName, email, password, country, referralCode } = req.body;

//   try {
//     // Check if any user has that email
//     const user = await UsersDatabase.findOne({ email });

//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "Email address is already taken",
//       });
//     }

//     // Find the referrer based on the provided referral code
//     let referrer = null;
//     if (referralCode) {
//       referrer = await UsersDatabase.findOne({ referralCode });
//       // You can remove the code that checks for a valid referral code here

//       // Optionally, you can handle the case where the referral code is invalid
//       // by setting referrer to null and proceeding with registration
//     }

//     // Create a new user with referral information
//     const newUser = {
//       name,
//       lastName,
//       email,
//       password: hashPassword(password),
//       country,
//       amountDeposited: 0,
//       profit: 0,
//       balance: 0,
//       referalBonus: 0,
//       transactions: [],
//       withdrawals: [],
//       accounts: {
//         eth: {
//           address: "",
//         },
//         ltc: {
//           address: "",
//         },
//         btc: {
//           address: "",
//         },
//         usdt: {
//           address: "",
//         },
//       },
//       verified: false,
//       isDisabled: false,
//       referralCode: generateReferralCode(6), // Generate a referral code for the new user
//       referredBy: referrer ? referrer._id : null, // Store the ID of the referrer if applicable
//       referredUsers: [], // Initialize the referredUsers property as an empty array
//     };

//     // Create the new user in the database
//     const createdUser = await User.create(newUser);
//     const token = uuidv4();
//     sendWelcomeEmail({ to: email, token });

//     // If there's a referrer, update their referredUsers list
//     if (referrer) {
//       referrer.referredUsers.push(createdUser._id);
//       await referrer.save();
//     }

//     return res.status(200).json({ code: "Ok", data: createdUser });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });
module.exports = router;

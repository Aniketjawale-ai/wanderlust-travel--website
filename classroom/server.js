const express=require("express");
const app = express();

const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const session = require("express-session");


    const sessionOptions = {
    secret: "mysupersecretstring", 
    resave: false , 
    saveUninitialized : true,
 
    };

    app.use(session(sessionOptions));


    app.get("/register" , (req ,res) =>{
        let { name = "anonymous"} = req.query;
        req.session.name = name;
        res.redirect("/hello");
    });

    app.get("/hello", (req, res) =>{
        res.send(`hello, ${req.session.name} ` );
    });



// app.get("/reqcount", (req, res) =>{
//     if(req.session.count) {
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res)=>{
//     res.send("test successful!");
// });








// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res)=>{
//     res.cookie("made-in", "India", {signed: true});
//     res.send("signed cookie sent");
// });

// app.get("/verify" ,(req, res) =>{
//     console.log(req.signedCookies);
//     res.send("veriified");
// });

// app.get("/getcookies" , (req, res) =>{
//     res.cookie("greet", "hello");
//     res.cookie("mada in india", "hello");
//     res.send("send yoou some cookie");
// });
// app.get("/", (req, res)=>{
//     let { name ="anonymous" }  = req.cookies;
//     res.send(`Hi, ${name}`);
// });

// app.get("/", (req,   res)=>{
//     console.dir(req.cookies);
//     res.send("HI, I am root");
// });

// app.get("/", (req, res)=>{
//     res.send("Hi, I am root!");
// });

// app.use("/users", users);
// app.use("/posts", posts);





app.listen(3000, () =>{
    console.log("server is listing to 3000");
});
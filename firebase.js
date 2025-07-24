
const firebaseConfig = {
    apiKey: "AIzaSyDYQwtQMQ62ef-kTP93e3ttdgjUSecNbBc",
    authDomain: "witassignment-5b470.firebaseapp.com",
    databaseURL: "https://witassignment-5b470-default-rtdb.firebaseio.com",
    projectId: "witassignment-5b470",
    storageBucket: "witassignment-5b470.firebasestorage.app",
    messagingSenderId: "33347369141",
    appId: "1:33347369141:web:b9291fefc1f44806b226fc"
  };

  // Initialize Firebase Project
  firebase.initializeApp(firebaseConfig);
  // Connecting the Authentication
  const auth = firebase.auth()
  // initialize realtime database
  const db = firebase.database();

  // Select the signup and login buttons from the HTML page  
  const signupbtn = document.querySelector("#signupbtn");
  const loginbtn = document.querySelector("#loginbtn");
  
  //Register Function
  signupbtn?.addEventListener("click",(event)=>{
    event.preventDefault();  //Prevent default form submit
  
    // get user input
    const name = document.getElementById("signupname").value ;
    const dob = document.getElementById("signupdob").value;
    const email = document.getElementById("signupemail").value;
    const password = document.getElementById("signuppassword").value;

    //create user,using firebase(regist by mail and password)
    auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        const userInfo = {
          uid : cred.user.uid,
          name: name,
          dob: dob,
          email: email,
        };

       //Refers to the users node in the DB,save the userInfo object to UID node, UID as the key 
       return db.ref("users").child(cred.user.uid).set(userInfo); 
      })
      .then(() => {
        alert("Signup successful!");
      })
      .catch(err => {
        console.log(err);
        alert(err.message);
      });
  })

    // Login Function
    loginbtn?.addEventListener("click",(event)=>{
    event.preventDefault();

    // get user input
    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("loginpassword").value;

    //log in using firebase
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "dashboard.html"  //redirect on success
      })
      .catch(err => {
        alert("login fail!");    
        console.error(err);
        alert(err.message);
      });
  });



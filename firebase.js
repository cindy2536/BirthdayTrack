
const firebaseConfig = {
    apiKey: "AIzaSyDYQwtQMQ62ef-kTP93e3ttdgjUSecNbBc",
    authDomain: "witassignment-5b470.firebaseapp.com",
    databaseURL: "https://witassignment-5b470-default-rtdb.firebaseio.com",
    projectId: "witassignment-5b470",
    storageBucket: "witassignment-5b470.firebasestorage.app",
    messagingSenderId: "33347369141",
    appId: "1:33347369141:web:b9291fefc1f44806b226fc"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Connecting the Authentication product
  const auth = firebase.auth()
  // initialize database
  const db = firebase.database();

   
  
  const signupbtn = document.querySelector("#signupbtn");
  const loginbtn = document.querySelector("#loginbtn");
  
  signupbtn?.addEventListener("click",(event)=>{
    event.preventDefault();
    const name = document.getElementById("signupname").value ;
    const dob = document.getElementById("signupdob").value;
    const email = document.getElementById("signupemail").value;
    const password = document.getElementById("signuppassword").value;

    auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        const userInfo = {
          uid : cred.user.uid,
          name: name,
          dob: dob,
          email: email,
        };
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

    loginbtn?.addEventListener("click",(event)=>{
    event.preventDefault();
    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("loginpassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "dashboard.html"
      })
      .catch(err => {
        alert("login fail!");
        console.error(err);
        alert(err.message);
      });
  });



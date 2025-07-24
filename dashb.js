// the authentication state changes

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";  //user is not logged in
    return;
  }

  //Get the HTML element to display birth info
  const messageBox = document.getElementById("birth-info");
  
  if (!messageBox) return;

  // Get the current user's data from realtime database using their UID
  try {
    const snap = await db.ref("users/" + user.uid).once("value");
    const userData = snap.val();
    
    if (!userData) {
      messageBox.textContent = "User data not found.";
      return;
    }

    // Today is Birthday
    const today = new Date();
    // console.log("today is:",today);

    // different time zone,change - to /, prevent incompatibility
    const dob   = new Date(userData.dob.replace(/-/g, "/")); 

    //If today’s date and month match the date and month of the DOB, it’s the user’s birthday.
    if (today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()) {

      let quoteText = "", quoteAuthor = "";
      try {
        const q = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://favqs.com/api/qotd')).then(res => res.json());//the first response
        const parsed = JSON.parse(q.contents);//the second response
        quoteText   = parsed.quote.body;
        quoteAuthor = parsed.quote.author;
       } catch (e) {
        console.warn("Quote API failed", e);
      }

      messageBox.innerHTML = `
        <h2>Happy Birthday, ${userData.name}!</h2>
        <p style="font-size:16px; line-height:1.8; text-align:center;">
        <em>"${quoteText}"</em><br><i> — ${quoteAuthor}</i></p>`;
      return;
    }

    // the number of days left until next birthday
    const thisYearBirth = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    // console.log("this year birth:",thisYearBirth);
    
    //If birthday this year has passed, use next year’s date
    const nextBirthday = thisYearBirth < today
          ? new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate())
          : thisYearBirth;
    // console.log("next year birth:",nextBirthday,"today is",today);

    // Calculate the number of days left until the next birthday.
    const leftDays = Math.ceil((nextBirthday - today) / 86400000); //Number of milliseconds in one day 24*60*60*1000, convert to days(rounds up)
    
    messageBox.innerHTML = `
      <h2>${leftDays} DAYS LEFT</h2>
      <p style="font-size:30px;text-align:center;">UNTIL YOUR BIRTHDAY!</p>`;
  }
  catch (err) {
    console.error("System error:", err);
    messageBox.textContent = "Error loading birthday info.";
  }
});

// log‑out, sign out the user and redirect to login page
document.getElementById("logoutbtn")?.addEventListener("click", () => {
  firebase.auth().signOut().then(() => window.location.href = "login.html");
}); 

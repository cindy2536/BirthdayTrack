firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const messageBox = document.getElementById("birth-info");
  if (!messageBox) return;

// get data from realtime database
  try {
    const snap = await db.ref("users/" + user.uid).once("value");
    const userData = snap.val();
    if (!userData) {
      messageBox.textContent = "User data not found.";
      return;
    }

    // Today is Birthday
    const today = new Date();
    const dob   = new Date(userData.dob.replace(/-/g, "/")); // different time zone,change - to /

    if (today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()) {

      let quoteText = "", quoteAuthor = "";
      try {
        const q = await fetch("https://favqs.com/api/qotd").then(res => res.json());
        quoteText   = q.quote.body;
        quoteAuthor = q.quote.author;
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
    const nextBirthday = thisYearBirth < today
          ? new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate())
          : thisYearBirth;
   // console.log("next year birth:",nextBirthday,"today is",today);

    const leftDays = Math.ceil((nextBirthday - today) / 86400000); 
    messageBox.innerHTML = `
      <h2>${leftDays} DAYS LEFT</h2>
      <p style="font-size:30px;text-align:center;">UNTIL YOUR BIRTHDAY!</p>`;
  }
  catch (err) {
    console.error("System error:", err);
    messageBox.textContent = "Error loading birthday info.";
  }
});

/* log‑out */
document.getElementById("logoutbtn")?.addEventListener("click", () => {
  firebase.auth().signOut().then(() => window.location.href = "login.html");
}); 

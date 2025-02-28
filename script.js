const verifiedEmails = [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com"
];

function checkEmail() {
    const emailInput = document.getElementById("emailInput").value.trim();
    const result = document.getElementById("result");

    if (verifiedEmails.includes(emailInput)) {
        result.textContent = "✅ Verified Attendee";
        result.style.color = "green";

        // Send verified email to Google Sheets
        fetch("https://script.google.com/macros/s/AKfycbzfZJGM0ysNSdrR-Y7skSD4qc0LZw-DZHaJzd4Tt1aR94InysjB044YAtkVqZR6o220/execL", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailInput })
        }).then(response => console.log("Email stored"));
    } else {
        result.textContent = "❌ Not Verified";
        result.style.color = "red";
    }
}

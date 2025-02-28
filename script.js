// Predefined list of verified attendee emails
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
    } else {
        result.textContent = "❌ Not Verified";
        result.style.color = "red";
    }
}

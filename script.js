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
        fetch("https://script.google.com/macros/s/AKfycbw4jBMXL5QjHO5ncObeZPLGsClwGAjtmTO-wVURCPVSNaVmIg3c5A7QKyX3texvaqrK/exec", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: emailInput})
        })
            .then(response => response.text())  // Read response as text instead of JSON
            .then(data => console.log("Response from server:", data))
            .catch(error => console.error("Fetch error:", error));
    }
}

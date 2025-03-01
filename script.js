async function fetchRegisteredEmails() {
    try {
        const response = await fetch("http://localhost:3000/getRegisteredEmails");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        return data.registeredEmails;
    } catch (error) {
        console.error("Error fetching registered emails:", error);
        return [];
    }
}

async function markCheckedInEmail(email) {
    try {
        const response = await fetch("http://localhost:3000/markCheckedInEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
            console.log("Email marked as checked-in");
        } else {
            console.error("Failed to mark email:", data.error);
        }
    } catch (error) {
        console.error("Error marking email:", error);
    }
}

async function checkEmail() {
    const emailInput = document.getElementById("emailInput").value.trim();
    const result = document.getElementById("result");

    if (!emailInput) {
        result.textContent = "⚠️ Please enter your email";
        result.style.color = "orange";
        return;
    }

    try {
        const registeredEmails = await fetchRegisteredEmails();
        console.log("Got registered emails:", registeredEmails);

        if (registeredEmails.includes(emailInput.toLowerCase())) {
            // call backend
            const response = await fetch("http://localhost:3000/markCheckedInEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailInput.toLowerCase() }),
            });

            const data = await response.json();

            if (data.success) {
                result.textContent = "✅ Check-in successful!";
                result.style.color = "green";
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                result.textContent = "⚠️ You have already checked in.";
                result.style.color = "orange";
            }
        } else {
            result.textContent = "❌ Not Registered";
            result.style.color = "red";
        }
    } catch (error) {
        console.error("Error checking email:", error);
        result.textContent = "⚠️ An error occurred. Please try again.";
        result.style.color = "orange";
    }
}

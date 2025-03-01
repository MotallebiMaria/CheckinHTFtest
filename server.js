require('dotenv').config();
const express = require("express");
const { google } = require("googleapis");
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const keyFilePath = './googleServiceAccountKey.json';

// decode service account key
const decodedKey = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
fs.writeFileSync(keyFilePath, decodedKey, 'utf-8');

const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const { ATTENDANCE_SHEET_ID: TEST_SHEET_ID } = require('./config');
const RANGE = "Sheet1!A1:E";

app.get("/getRegisteredEmails", async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: TEST_SHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values || [];
        const emails = rows.slice(1).map(row => row[2].trim()); // email in col C

        res.json({ registeredEmails: emails });
    } catch (error) {
        console.error("Error fetching registered emails:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("/markCheckedInEmail", async (req, res) => {
    const { email } = req.body;

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: TEST_SHEET_ID,
            range: RANGE,
        });

        const rows = response.data.values || [];
        let emailRowIndex = -1;
        let alreadyCheckedIn = false;

        rows.forEach((row, index) => {
            if (row[2].trim().toLowerCase() === email.toLowerCase()) {
                emailRowIndex = index + 1; // 1-based
                alreadyCheckedIn = row[3]?.toLowerCase() === "true"; // workshop1 checkbox in col B
            }
        });

        if (emailRowIndex === -1) {
            return res.status(404).json({ error: "Email not found" });
        }

        if (alreadyCheckedIn) {
            return res.json({ success: false, message: "You have already declared attendance." });
        }

        // update checkbox
        const updateRange = `Sheet1!D${emailRowIndex}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: TEST_SHEET_ID,
            range: updateRange,
            valueInputOption: "RAW",
            requestBody: {
                values: [[true]],
            },
        });

        res.json({ success: true, message: "Email marked as checked-in" });
    } catch (error) {
        console.error("Error marking email as checked-in:", error);
        res.status(500).json({ error: "Failed to update the spreadsheet" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

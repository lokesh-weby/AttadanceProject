const { google } = require("googleapis");
const sheets = google.sheets("v4");
const fs = require("fs");
const express = require('express')
const app = express()
const cors=require('cors');
const { log } = require("console");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Max-Age','50');
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World')
})


app.post('/',function(req,res){
  console.log(req.body);
  const sampleData =req.body
  
  updateSheet(sampleData);
  
})



app.listen(4080,()=>{
  console.log("server is running at port 4080");
  
})

// Load your Google Service Account JSON key file


const auth = new google.auth.GoogleAuth({
  keyFile: "updateAuth.json", // Replace with your JSON key file path
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "1bJtFVNWX9qrbT6GCdFWqQipX7VqwlulYqy1cU03-1mk"; // Replace with your Google Sheets ID

async function updateSheet(jsonData) {
  try {
    // Authenticate and get the Sheets API client
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Determine the last used column
    const meta = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!1:1", // Header row, adapt if your headers are in a different row
    });
    const lastColumn = meta.data.values[0].length;
    const newColumn = String.fromCharCode(65 + lastColumn); // Convert column index to letter (A, B, C, etc.)

    // Set up the values to insert with the current date as the header
    const values = [[new Date().toLocaleTimeString()]]; // Header with current date
    for (const [name, attendance] of Object.entries(jsonData)) {
      values.push([attendance]);
    }

    // Update the sheet with attendance data in the new column
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!${newColumn}1:${newColumn}${values.length}`, // New column range
      valueInputOption: "RAW",
      resource: {
        values,
      },
    });

    console.log("Attendance data added in a new column successfully.");
  } catch (error) {
    console.error("Error updating sheet:", error);
  }
}

// Sample JSON data for testing



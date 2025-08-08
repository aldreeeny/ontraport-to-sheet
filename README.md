# Ontraport to Google Sheets Automation

This Google Apps Script project automates the extraction, processing, and consolidation of Ontraport data (Appointments and Contacts) into Google Sheets, with optional export to BigQuery.

## Features

- Fetches Ontraport Appointments and Contacts via API, filtered by date.
- Writes data to specific Google Sheet tabs (Running 90 Days, Next 60 Days, Consolidated Appointment Data, Contacts).
- Consolidates and deduplicates appointment data across time windows.
- Sorts and cross-checks data between sheets.
- Exports processed data to BigQuery tables for further analysis.

## File Overview

- `ontraport/appointment.js` — Fetches and writes appointment data for different time windows.
- `ontraport/contact.js` — Fetches and writes contact data.
- `ontraport/data.js` — Handles generic Ontraport API data pulls and pagination.
- `ontraport/util.js` — Utilities for sorting, deduplication, cross-checking, and BigQuery integration.
- `ontraport/const.js` — Stores API base URL and sheet/tab names.
- `appsscript.json` / `.clasp.json` — Project and deployment configuration.

## Setup

1. **API Credentials:**  
   - Store your Ontraport API Key, App ID, and target Spreadsheet URL in Google Apps Script Properties (do not hardcode in code).
   - If using BigQuery, update `projectID`, `datasetID`, and `tableID` in `util.js` with your own values.

2. **Google Sheet:**  
   - Ensure your sheet contains the required tabs (e.g., "Running 90 Days", "Next 60 Days", "Consolidated Appointment Data", "Contacts").

3. **Google Apps Script Project:**  
   - Deploy the scripts as a new Apps Script project bound to your Google Sheet.
   - Enable the BigQuery advanced service if using BigQuery features.

## Security

- **Never commit real API keys, App IDs, spreadsheet URLs, or BigQuery project IDs to version control.**
- Use placeholders in code and supply credentials securely at runtime via script properties.

## License

MIT License

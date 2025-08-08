/**
 * Write appointment data on the sheet
 * @param {boolean} is90Days
 * @param {string} sheetName
 */
const writeAppointmentData = (is90Days, sheetName) => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const sheet = SpreadsheetApp.openByUrl(properties.SPREADSHEET_URL);

  let today = new Date();
  let data = [];
  let appointments = [];

  truncTable(is90Days);
  
  if (is90Days) {
    let previousDate = new Date().setDate(today.getDate() - 130);
    previousDate = new Date(previousDate);
    appointments = pullOntraportData("Appointments", previousDate, today, "90");
  } else {
    // Next 60 Days
    let predictedDate = new Date().setDate(today.getDate() + 60);
    predictedDate = new Date(predictedDate);
    appointments = pullOntraportData("Appointments", today, predictedDate, "60");
  }
};

const writeConsolidatedData = () => {

  let today = new Date();
  let data = [];
  let appointments = [];

  truncTable();

  let previousDate = new Date().setDate(today.getDate() - 130);
  let predictedDate = new Date().setDate(today.getDate() + 60);
  previousDate = new Date(previousDate);
  predictedDate = new Date(predictedDate);
  appointments = pullOntraportData("Appointments", previousDate, predictedDate);

}
/**
 * Write the running 90 days appointment data
 */
const getRunning90Days = () => {
  writeAppointmentData(true, RUNNING_90);
  // sortData(RUNNING_90, "A2:Y");
};

/**
 * Write the next 60 days appointment data
 */
const getNext60Days = () => {
  writeAppointmentData(false, NEXT_60);
  sortData(NEXT_60, "A2:Y");
};

/**
 * Combines the appointment data from the running 90 and next 60 days
 */
const consolidate = () => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const sheet = SpreadsheetApp.openByUrl(properties.SPREADSHEET_URL);

  const running90Data = sheet
    .getSheetByName(RUNNING_90)
    .getRange("A2:Y")
    .getValues()
    .filter((row) => row[0] && row[0] !== "");

  const next60Data = sheet
    .getSheetByName(NEXT_60)
    .getRange("A2:Y")
    .getValues()
    .filter((row) => row[0] && row[0] !== "");

  const data = removeDuplicates([...running90Data, ...next60Data]);
  if (data) {
    sheet
      .getSheetByName(CONSOLIDATED_APPOINTMENT)
      .getRange("A2:Y")
      .clearContent();
    sheet
      .getSheetByName(CONSOLIDATED_APPOINTMENT)
      .getRange(2, 1, data.length, data[0].length)
      .setValues(data)
      .sort({ column: 1, ascending: true });
  }
};

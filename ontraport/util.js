/**
 * Sorts the sheet data
 * @param {string} sheetName
 * @param {string} range
 */
const sortData = (sheetName, range) => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const sheet = SpreadsheetApp.openByUrl(properties.SPREADSHEET_URL);

  let sortSheet = sheet.getSheetByName(sheetName);
  sortSheet.getRange(range).sort({
    column: 1,
    ascending: true,
  });
};

/**
 * Removes duplicates in a 2d array
 * @param {object} array
 * @returns {object} unique array
 */
const removeDuplicates = (arr) =>
  arr
    .map(JSON.stringify)
    .reverse()
    .filter(function (item, index, arr) {
      return arr.indexOf(item, index + 1) === -1;
    })
    .reverse()
    .map(JSON.parse);

/**
 * Cross Check
 */
const autCrossCheck = () => {
  const exportedSheet = SpreadsheetApp.openByUrl(
    "YOUR_GOOGLE_SPREADSHEET_URL_HERE"
  );

  // Only include feb 2021 data
  const dataset1 = exportedSheet
    .getSheetByName("Appointments")
    .getRange("A2:X")
    .getValues()
    .filter((row) => row[0] != "" && row[1].includes("2021-02"));

  const properties = PropertiesService.getScriptProperties().getProperties();
  const sheet = SpreadsheetApp.openByUrl(properties.SPREADSHEET_URL);

  const dataset2 = sheet
    .getSheetByName(CONSOLIDATED_APPOINTMENT)
    .getRange("A2:Y")
    .getValues()
    .filter((row) => row[0] != "" && row[7].includes("2021-02"));

  console.log(`Clinico Data Name: ${dataset1.length}`);
  console.log(`Ontraport Data Name: ${dataset2.length}`);


  let values = [];
  dataset1.forEach((data1) => {
    if (!dataset2.some((data2) => data2[6] == data1[0])) {
      values = [...values, [data1[1].substr(0, 7), data1[0], data1[5]]];
    }
  });


  exportedSheet
    .getSheetByName("Cross Check")
    .getRange(2, 1, values.length, values[0].length)
    .setValues(values);
};

const insertToBigquery = (rows) => {
  const projectID = "YOUR_PROJECT_ID";
  const datasetID = "YOUR_DATASET_ID";
  let tableID = "YOUR_TABLE_ID";
  let query = "";
  try {
    query = BigQuery.Tabledata.insertAll({"rows": rows, "skipInvalidRows": true, "ignoreUnknownValues": true}, projectID, datasetID, tableID);
    console.log(query);
  } catch (e) {
    console.log(query);
    console.log(e);
  }
  

}

const truncTable = () => {
  const projectID = "YOUR_PROJECT_ID";
  const datasetID = "YOUR_DATASET_ID";
  let tableID = "YOUR_TABLE_ID";

  let request = {
    useLegacySql: false,
    query: "truncate table "+datasetID+"."+tableID,
  };
  BigQuery.Jobs.q
  let queryResults = BigQuery.Jobs.query(request, projectID);
  let jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectID, jobId);
  }
  Logger.log("finished emptying");
}

const arrangeData = (appointments) => {
  let data = []
  appointments.forEach((appointment) => {
    const {
      id,
      owner,
      system_source,
      import_id,
      contact_cat,
      bindex,
      f2157,
      f2158,
      f2159,
      f2160,
      f2161,
      f2162,
      f2163,
      f2164,
      f2165,
      f2171,
      f2173,
      f2176,
      f2177,
      f2181,
      f2230,
      unique_id,
    } = appointment;
    let bookingDate = new Date(f2173 * 1000);
    let formatted_f2158 = new Date(f2158 * 1000);
    let formatted_f2159 = new Date(f2159 * 1000);

    data = [
      ...data,
        {
          "json": {
            "id": id,
            "owner": owner,
            "system_source": system_source,
            "import_id": import_id,
            "contact_cat": contact_cat,
            "bindex": bindex,
            "f2157": f2157,
            "f2158": Utilities.formatDate(formatted_f2158, "GMT", "yyyy-MM-dd HH:mm:ss"),
            "f2159": Utilities.formatDate(formatted_f2159, "GMT", "yyyy-MM-dd HH:mm:ss"),
            "f2160": f2160,
            "f2161": f2161,
            "f2162": f2162,
            "f2163": f2163,
            "f2164": f2164,
            "appointment_details": f2165,
            "f2171": f2171,
            "booking_date": Utilities.formatDate(bookingDate, "GMT", "yyyy-MM-dd HH:mm:ss"),
            "f2176": f2176,
            "f2177": f2177,
            "f2181": f2181,
            "f2230": f2230,
            "Firstname": appointment["f2171//firstname"],
            "Lastname": appointment["f2171//lastname"],
            "Email": appointment["f2171//f1906"],
            "unique_id": unique_id,
          }
        },
    ];
  });
  insertToBigquery(data);
}

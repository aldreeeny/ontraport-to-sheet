/**
 * Generic function to pull ontraport data
 */
const pullOntraportData = (endpoint, startDate, endDate) => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const API_KEY = properties.API_KEY;
  const APP_ID = properties.API_APP_ID;

  let params = {
    headers: {
      "Api-Key": API_KEY,
      "Api-Appid": APP_ID,
      Accept: "application/json",
    },
    muteHttpExceptions: true,
  };

  let start = 0;
  let apiData = [];
  let rawCondition = [];
  let unixSDate = Math.floor(startDate.getTime() / 1000);
  let unixEDate = Math.floor(endDate.getTime() / 1000);
  if (endpoint == "Appointments") {
    // rawCondition = `f2173<=${unixEDate}&&f2173>=${unixSDate}`;
    rawCondition = [
      {
        field: {
          field: "f2173",
        },
        op: "<=",
        value: {
          value: unixEDate,
        },
      },
      "AND",
      {
        field: {
          field: "f2173",
        },
        op: ">=",
        value: {
          value: unixSDate,
        },
      },
    ];
  } else {
    // rawCondition = `date<=${unixEDate}&&date>=${unixSDate}`;
    rawCondition = [
      {
        field: {
          field: "date",
        },
        op: "<=",
        value: {
          value: unixEDate,
        },
      },
      "AND",
      {
        field: {
          field: "date",
        },
        op: ">=",
        value: {
          value: unixSDate,
        },
      },
    ];
  }

  let str = JSON.stringify(rawCondition);
  let condition = encodeURIComponent(str);
  let count = getInfo(endpoint, params, condition);
  console.info({ message: `Result count:${count}` });
  if (count > 50) {
    // Max range of pagination from Ontraport is 50
    do {
      let result;
      try {
        let action = "range=50&sort=date&sortDir=asc&start=" + start;
        let apiUrl = `${BASE_URL}${endpoint}?${action}&condition=${condition}`; // this line removed &condition=${condition}
        let response = UrlFetchApp.fetch(apiUrl, params);
        result = JSON.parse(response).data;
        apiData = [...apiData, ...result];
        
        arrangeData(result);
        start += 50;
      } catch (e) {
        console.log(`Error at index ${start}`);
        console.log(result);
        console.log(e);
      }
    } while (start < count);
    Logger.log(start);
  } else {
    let action = "range=50&sort=date&sortDir=asc&start=" + start;
    let apiUrl = `${BASE_URL}${endpoint}?${action}&condition=${condition}`; // this line removed &condition=${condition}
    let api = UrlFetchApp.fetch(apiUrl, params);
    apiData = JSON.parse(api).data;
    arrangeData(result);
  }
  console.info({ message: "Pulling data complete." });
  return apiData;
};

/**
 * Returns the preview of an API request
 */
const getInfo = (endpoint, params, condition) => {
  let url = `${BASE_URL}${endpoint}/getInfo?condition=${condition}`; // this line removed ?condition=${condition}
  let response = UrlFetchApp.fetch(url, params);
  let result = JSON.parse(response);
  return result.data.count;
};

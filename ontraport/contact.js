/**
 * Write contact data on the sheet
 */
const writeContactData = () => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const sheet = SpreadsheetApp.openByUrl(properties.SPREADSHEET_URL);

  let today = new Date();
  let placeHolderDate = new Date(2019, 0, 1);
  let previousDate = new Date().setDate(today.getDate() - 90);
  previousDate = new Date(previousDate);

  let contacts = pullOntraportData("Contacts", placeHolderDate, today);
  let data = [];
  contacts.forEach((contact) => {
    let date = +contact.date;
    data = [
      ...data,
      [
        contact.id,
        contact.owner,
        contact.firstname,
        contact.lastname,
        contact.email,
        contact.address,
        contact.city,
        contact.state,
        contact.zip,
        new Date(contact.birthday * 1000),
        new Date(date * 1000),
        contact.f1906,
        contact.f1448,
        contact.f1909,
        contact.f1910,
        contact.f1914,
        contact.f1918,
        contact.f2022,
        contact.f2024,
        contact.f2182,
        contact.f2183,
        contact.cell_phone,
        contact.home_phone,
        contact.sms_number,
        new Date(contact.dla * 1000),
        contact.bulk_mail,
        contact.bulk_sms,
        contact.office_phone,
        new Date(contact.dlm * 1000),
        contact.company,
        contact.address2,
        contact.country,
        contact.system_source,
        contact.source_location,
        contact.import_id,
        contact.ip_addy,
        contact.freferrer,
        contact.lreferrer,
        contact.n_lead_source,
        contact.n_content,
        contact.n_medium,
        contact.n_campaign,
        contact.n_term,
        contact.l_lead_source,
        contact.l_content,
        contact.l_medium,
        contact.l_campaign,
        contact.l_term,
        contact.referral_page,
        contact.aff_sales,
        contact.aff_amount,
        contact.program_id,
        contact.mrcAmount,
        contact.mrcUnpaid,
        contact.mriInvoiceNm,
        contact.mriInvoiceTotal,
        contact.timezone,
        contact.spent,
        contact.num_purchased,
      ],
    ];
  });

  let writeSheet = sheet.getSheetByName("Contacts");
    let flag = writeSheet.getRange(2, 1).getValue();
  writeSheet.getRange(2, 1, data.length, data[0].length).setValues(data);

};

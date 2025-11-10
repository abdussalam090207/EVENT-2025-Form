/**
 * Apps Script server code to receive form data and save to Spreadsheet + Drive.
 *
 * USAGE:
 * 1. Create a Google Spreadsheet and copy its ID into SPREADSHEET_ID.
 * 2. Create (or choose) a Drive folder and copy its ID into FOLDER_ID.
 * 3. In Apps Script, add this file and the HTML file (mprosenior) and deploy as Web App
 *    with permission "Anyone, even anonymous" (or your preferred scope).
 */

// TODO: replace these with your actual IDs
const SPREADSHEET_ID = 'REPLACE_WITH_SPREADSHEET_ID';
const FOLDER_ID = 'REPLACE_WITH_FOLDER_ID';

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('mprosenior')
    .setTitle('REGISTRASI MPRO SENIOR 2025')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Receives form data from client-side. Expects an object like:
 * {
 *   nama, sekolah, kategori, tel, method,
 *   file: { name, type, blob } // blob is dataURL (data:<mime>;base64,....)
 * }
 */
function submitForm(form) {
  try {
    if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('REPLACE') === 0) {
      throw new Error('SPREADSHEET_ID not set in Code.gs');
    }
    if (!FOLDER_ID || FOLDER_ID.indexOf('REPLACE') === 0) {
      throw new Error('FOLDER_ID not set in Code.gs');
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = 'Responses';
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);

    // Ensure headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','Nama','Sekolah','Kategori','Tel','Metode','FileName','FileUrl']);
    }

    let fileUrl = '';
    let fileName = '';

    if (form.file && form.file.blob) {
      // form.file.blob expected as dataURL: data:<mime>;base64,AAAA...
      const dataUrl = form.file.blob;
      const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1];
        const base64Data = matches[2];
        const bytes = Utilities.base64Decode(base64Data);
        fileName = form.file.name || ('upload_' + new Date().getTime());
        const folder = DriveApp.getFolderById(FOLDER_ID);
        const file = folder.createFile(Utilities.newBlob(bytes, contentType, fileName));
        fileUrl = file.getUrl();
      } else {
        // If blob isn't dataURL, try as raw base64
        try {
          const bytes = Utilities.base64Decode(form.file.blob);
          fileName = form.file.name || ('upload_' + new Date().getTime());
          const folder = DriveApp.getFolderById(FOLDER_ID);
          const file = folder.createFile(Utilities.newBlob(bytes, form.file.type || 'image/png', fileName));
          fileUrl = file.getUrl();
        } catch (e) {
          // ignore file save on failure but record error
          fileUrl = 'ERROR_SAVING_FILE: ' + e.toString();
        }
      }
    }

    sheet.appendRow([new Date(), form.nama || '', form.sekolah || '', form.kategori || '', form.tel || '', form.method || '', fileName, fileUrl]);

    return { status: 'success' };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

/**
 * Allow external POST requests to the deployed Web App (JSON body).
 * This makes the same submitForm available via HTTP POST so the form
 * can be submitted using fetch() from outside Apps Script's client.
 */
function doPost(e) {
  try {
    var payload = null;
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.postData && e.postData.contents) {
      // try parsing anyway
      try { payload = JSON.parse(e.postData.contents); } catch(err) { payload = null; }
    }
    if (!payload) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid or missing JSON body' })).setMimeType(ContentService.MimeType.JSON);
    }

    var result = submitForm(payload);
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

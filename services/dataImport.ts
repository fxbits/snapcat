import googleapis, {google} from 'googleapis';


const auth = new google.auth.GoogleAuth({
    keyFile: 'keys.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
})

export const importData = async (sheetName: string) => {
    try{
        const authClientObject = await auth.getClient();
        const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
        const readData = await googleSheetsInstance.spreadsheets.values.get({
            auth,
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            range: sheetName + "!A1:L99"
        });
        return readData.data.values;

    } catch(error) {
        return []
    }
}

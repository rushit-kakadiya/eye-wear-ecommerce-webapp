let ejs = require('ejs');
let pdf = require('html-pdf');
const path = require('path');

const { pdfFileUpload } = require('../../core/s3Upload');
const dirPath = '../../pdf/';

const  generatePDF = async (file,data, filename,s3OrderNo) => {

    let folder = `pdf/${s3OrderNo}`;
    
    const tempDir = path.resolve(__dirname, dirPath, file);
    const bufferdata = await  new Promise((resolve, reject) =>{
        ejs.renderFile(path.join(tempDir),data, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                pdf.create(data, {
                    format: 'Letter'
                    }).toBuffer((err, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer);
                    }
                });
            }
        });
    });
    return await pdfFileUpload(filename, folder, bufferdata);
};

module.exports = {
    generatePDF: generatePDF
};
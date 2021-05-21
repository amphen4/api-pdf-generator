var express = require('express');
var router = express.Router();
const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
var uniqid = require('uniqid');
const fs = require('fs');
/* GET test page. */
router.get('/test', function(req, res, next) {
    var data = fs.readFileSync('./storage/pdf/models/lorem-ipsum.pdf');
    res.contentType("application/pdf");
    res.send(data);
});
// Expects a text param in a request with json body
router.post('/lorem-ipsum', async function(req, res, next) {
    const existingPdfBytes = fs.readFileSync('./storage/pdf/models/lorem-ipsum.pdf');

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()

    // Draw a string of text diagonally across the first page
    firstPage.drawText( req.body.text , {
        x: 5,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
    })
    // Convert the PDFDocument to response
    const filename = 'generated_'+uniqid()+'.pdf';
    fs.writeFileSync('./storage/pdf/generated/'+filename, await pdfDoc.save())
    var data =fs.readFileSync('./storage/pdf/generated/'+filename);
    res.contentType("application/pdf");
    res.send(data);
});

module.exports = router;

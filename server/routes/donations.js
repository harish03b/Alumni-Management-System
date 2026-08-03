const express = require("express");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const Donation = require("../models/Donation");

const router = express.Router();


// ===========================================
// Create Donation
// ===========================================

router.post("/donate", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            amount,
            paymentMethod
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !amount ||
            !paymentMethod
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        const donation = await Donation.create({

            firstName,
            lastName,
            email,
            amount,
            paymentMethod

        });

        const uploadFolder = path.join(
            __dirname,
            "../uploads"
        );

        if (!fs.existsSync(uploadFolder)) {

            fs.mkdirSync(uploadFolder);

        }

        const pdfPath = path.join(

            uploadFolder,

            `donation_${donation._id}.pdf`

        );

        const doc = new PDFDocument();

        doc.pipe(

            fs.createWriteStream(pdfPath)

        );

        doc.fontSize(22).text(
            "Donation Receipt",
            {
                align: "center"
            }
        );

        doc.moveDown();

        doc.fontSize(14);

        doc.text(`Name : ${firstName} ${lastName}`);
        doc.text(`Email : ${email}`);
        doc.text(`Amount : ₹${amount}`);
        doc.text(`Payment : ${paymentMethod}`);
        doc.text(`Date : ${donation.date}`);

        doc.end();

        return res.status(201).json({

            success: true,

            message: "Donation successful.",

            pdfPath: `/download/${donation._id}`

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to process donation."

        });

    }

});


// ===========================================
// Download Receipt
// ===========================================

router.get("/download/:id", (req, res) => {

    const pdfPath = path.join(

        __dirname,

        "../uploads",

        `donation_${req.params.id}.pdf`

    );

    if (!fs.existsSync(pdfPath)) {

        return res.status(404).json({

            success: false,

            message: "Receipt not found."

        });

    }

    res.download(pdfPath);

});

module.exports = router;
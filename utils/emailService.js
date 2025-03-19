const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "clearzone06@gmail.com", // Replace with your email
        pass: "lytz ozzr ayzp vnzi"  // Replace with your app password
    }
});

const sendCompletionEmail = async (userEmail, completionImage) => {
    const mailOptions = {
        from: "clearzone06@gmail.com",
        to: userEmail,
        subject: "Waste Cleanup Completed ✔",
        html: `
            <h2>Your reported waste has been cleaned! 🗑️</h2>
            <p>The waste you reported has been successfully cleaned.</p>
            ${completionImage ? `<p><strong>Completion Image:</strong></p><img src="${completionImage}" alt="Completed Task Image" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 5px;"/>` : "<p>No image available.</p>"}
            <p>Thank you for helping keep the environment clean! 🌍</p>
        `
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
};

module.exports = { sendCompletionEmail };
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
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2 style="color: green;">✅ Your reported waste has been cleaned! 🗑️</h2>
                <p>The waste you reported has been successfully cleaned.</p>
                <p>Thank you for helping keep the environment clean! 🌍</p>
            </div>
        `
    };

    try {
        console.log("📧 Email Content:", mailOptions.html); // Debugging log
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
};

module.exports = { sendCompletionEmail };
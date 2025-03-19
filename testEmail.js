const { sendCompletionEmail } = require("./utils/emailService");

const testEmail = async () => {
    const userEmail = "gaurichichu@gmail.com"; // Replace with your email
    const reportId = "123456789"; // Test Report ID
    const completionImage = "https://via.placeholder.com/400"; // Placeholder image URL

    try {
        await sendCompletionEmail(userEmail, reportId, completionImage);
        console.log("✅ Test email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending test email:", error);
    }
};

testEmail();
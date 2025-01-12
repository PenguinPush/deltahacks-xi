export default function SMSButton() {
    const sendSMS = () => {
        const smsLink = "sms:+12183355420?body=Hello%20there,%20how%20can%20I%20help%20you%20today?";
        window.location.href = smsLink;
    };

    return (
        <>
            <button className="dialogButton" onClick={sendSMS}>Chatbot</button>
        </>
    );
}

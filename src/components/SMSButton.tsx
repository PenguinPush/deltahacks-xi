export default function SMSButton() {
    const sendSMS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coordX = position.coords.longitude;
                const coordY = position.coords.latitude;
                const status = "safe"; 

                const smsBody = `p/ck/3-${coordX}:${coordY}:${status}`;

                const encodedBody = encodeURIComponent(smsBody);

                const smsLink = `sms:+12183355420?body=${encodedBody}`;

                window.location.href = smsLink;
            }, (error) => {
                console.error("Error obtaining location:", error);
                alert("Unable to retrieve location. Please ensure location services are enabled.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    return (
        <>
            <button className="dialogButton" onClick={sendSMS}>Chatbot</button>
        </>
    );
}

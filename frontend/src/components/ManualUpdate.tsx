import { useState } from "react";
import "./ManualUpdate.css"; // Import the CSS file

function ManualUpdate() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <button className="dialogButton" onClick={openDialog}>Open Dialog</button>

      {isDialogOpen && (
        <>
          <div className="overlay" onClick={closeDialog}></div>
          <div className="dialog-box">
            <h2 style={{ color: "Black" }}>Dialog Box</h2>
            <p>dialog box</p>

            <form>
              <label htmlFor="textInput">Enter Text:</label>
              <input type="text" id="textInput" required/>
              <button type="submit" className="dialogButton">Submit</button>
            </form>

            <button className="dialogButton" onClick={closeDialog}>Close</button>
          </div>
        </>
      )}
    </>
  );
}

export default ManualUpdate;

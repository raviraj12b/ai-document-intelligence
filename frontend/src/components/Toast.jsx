function Toast({
  message,
  type = "success",
  onClose
}) {

  if (!message) {
    return null;
  }


  return (

    <div
      className={`toast toast-${type}`}
      role="status"
    >

      <div className="toast-content">

        <span className="toast-icon">

          {type === "success"
            ? "✓"
            : "!"}

        </span>


        <div>

          <strong>

            {type === "success"
              ? "Success"
              : "Error"}

          </strong>


          <p>
            {message}
          </p>

        </div>

      </div>


      <button
        className="toast-close"
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>

    </div>

  );

}


export default Toast;
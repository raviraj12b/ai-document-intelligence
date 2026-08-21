function DeleteModal({
  document,
  deleting,
  onCancel,
  onConfirm
}) {

  if (!document) {
    return null;
  }

  return (

    <div className="modal-backdrop">

      <div
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >

        <div className="delete-modal-icon">
          !
        </div>


        <div className="delete-modal-content">

          <p className="delete-modal-eyebrow">
            DELETE DOCUMENT
          </p>

          <h2 id="delete-modal-title">
            Remove this document?
          </h2>

          <p>
            <strong>
              {document.name}
            </strong>
            {" "}will be removed from DOCUAI,
            including its indexed vector data.
          </p>

        </div>


        <div className="delete-modal-actions">

          <button
            type="button"
            className="delete-cancel-button"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>


          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete document"}
          </button>

        </div>

      </div>

    </div>

  );

}


export default DeleteModal;
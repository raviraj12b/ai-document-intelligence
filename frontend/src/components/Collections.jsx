function Collections() {

  return (
    <section className="collections-page">

      <div className="collections-card">

        <div className="collections-icon">
          ◇
        </div>


        <p className="collections-eyebrow">
          COLLECTIONS
        </p>


        <h1>
          Organize related documents
        </h1>


        <p className="collections-description">
          Collections will let you group multiple
          documents into shared knowledge spaces
          and query them together.
        </p>


        <div className="collections-preview">

          <div className="collection-preview-item">

            <span>
              Web Development
            </span>

            <small>
              HTML, CSS, JavaScript
            </small>

          </div>


          <div className="collection-preview-item">

            <span>
              Machine Learning
            </span>

            <small>
              ML, Neural Networks, Deep Learning
            </small>

          </div>


          <div className="collection-preview-item">

            <span>
              Interview Preparation
            </span>

            <small>
              Python, SQL, DSA
            </small>

          </div>

        </div>


        <div className="coming-soon-badge">
          Coming in DOCUAI V2
        </div>

      </div>

    </section>
  );

}


export default Collections;
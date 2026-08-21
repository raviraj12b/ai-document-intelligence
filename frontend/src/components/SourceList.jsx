function SourceList({
  sources,
  onSourceClick
}) {

  return (

    <div className="sources">

      <div className="sources-header">

        <h3>
          SOURCES
        </h3>

        <span className="sources-count">
          {sources.length}
        </span>

      </div>


      <div className="sources-list">

        {sources.map((source, index) => (

          <button
            className="source-item"
            key={`${source.source}-${source.page}-${index}`}
            onClick={() =>
              onSourceClick(source.page)
            }
          >

            <span className="source-number">
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </span>


            <div className="source-content">

              <div className="source-document">
                {source.source}
              </div>

              <div className="source-page">
                Page {source.page}
              </div>

            </div>


            <span className="source-arrow">
              →
            </span>

          </button>

        ))}

      </div>

    </div>

  );

}

export default SourceList;

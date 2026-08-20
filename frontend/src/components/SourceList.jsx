function SourceList({ sources }) {

  return (

    <div className="sources">

      <h3>
        SOURCES
      </h3>


      {sources.map((source, index) => (

        <div
          className="source-item"
          key={`${source.source}-${source.page}-${index}`}
        >

          <span className="source-number">

            {String(index + 1).padStart(
              2,
              "0"
            )}

          </span>


          <div>

            <div className="source-document">

              {source.source}

            </div>


            <div className="source-page">

              Page {source.page}

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}


export default SourceList;
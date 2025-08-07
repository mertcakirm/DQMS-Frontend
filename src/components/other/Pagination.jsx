

const Pagination = ({ setPageNum, pageNum }) => {
    return (
        <div className="d-flex px-3 col-12 justify-content-center gap-2">
            {pageNum > 1 ? (
                <button
                    className="print-btn2 d-flex justify-content-center align-items-center"
                    onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
                    disabled={pageNum <= 1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20" height="20" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
                </button>
            ):null}

            <span className="px-3 print-btn2 text-center align-self-center">
         {pageNum}
      </span>
            <button
                className="print-btn2 d-flex justify-content-center align-items-center"
                onClick={() => setPageNum(pageNum + 1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20" height="20" viewBox="0 0 24 24"><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg>
            </button>
        </div>
    );
};
export default Pagination;
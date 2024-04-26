
// First thing that we will do here is that we will create type of the prop that this component will expect.
//This compnonent will accept a pagination data that it will get back from the 
export type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
    }
    return (
    <div className="flex justify-center">
        <ul className="flex border border-slate-300">

            {pageNumbers.map((number) => (
                <li className={`px-2 py-1 ${page === number ? "bg-gray-200" : ""}`}>
                    <button onClick={() => onPageChange(number)}>{number}</button>
                </li>
            ))}
        </ul>
    </div>
    );
}
export default Pagination;
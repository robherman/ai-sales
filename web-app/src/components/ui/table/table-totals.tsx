export const TableTotals = ({
  startIndex,
  endIndex,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
}: any) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div>
        Mostrando {startIndex} a {endIndex} de {totalItems} registros
      </div>
      <div className="flex items-center">
        <span className="mr-2">Registros por página:</span>
        <select
          className="select select-bordered select-sm"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

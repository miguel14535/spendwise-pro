function Filters({
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  categories = [],
}) {
  return (
    <div className="filters-row">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">Todos os tipos</option>
        <option value="income">Receitas</option>
        <option value="expense">Despesas</option>
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="all">Todos status</option>
        <option value="Pago">Pago</option>
        <option value="Pendente">Pendente</option>
      </select>

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        <option value="all">Todas categorias</option>

        {categories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
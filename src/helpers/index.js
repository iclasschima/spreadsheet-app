import { evaluate } from "mathjs";

export const generateInitialCells = () => {
  // function code...
};

export const handleUpdateRowState = (cells, setRowStates, cellId, value) => {};

export const updateRowState = (cells, setRowStates, cellId) => {};

export const handleComputation = (cells, setCells, cellId, value) => {};

export const handleDependencyReevaluation = (cells, setCells) => {
  const tempCells = cells.map((cell) => {
    if (cell.dependencies.startsWith("=")) {
      return {
        ...cell,
        value: computeCellValue(cells, cell.dependencies),
      };
    }
    return cell;
  });

  setCells(tempCells);
};

export const computeCellValue = (cells, value) => {
  if (value.startsWith("=")) {
    try {
      const formula = value.substring(1);
      const scope = {};
      const normalizedFormula = formula.replace(
        /([A-Z])(\d+)/g,
        (match, col, row) => {
          const normalizedRow = parseInt(row, 10).toString();
          return `${col}${normalizedRow}`;
        }
      );

      cells.forEach((cell) => {
        const { id, value } = cell;
        const normalizedId = id.replace(/(\d+)/g, (match, row) => {
          const normalizedRow = parseInt(row, 10).toString();
          return normalizedRow;
        });

        scope[normalizedId] = value;
      });

      const evaluatedValue = evaluate(normalizedFormula, scope);

      return evaluatedValue.toString();
    } catch (error) {
      return value;
    }
  }
  return value;
};

export const serializeData = (cells) => {
  const rows = [];
  for (let i = 0; i < cells.length; i += 3) {
    const row = cells.slice(i, i + 3);
    const rowData = row.map((cell) => cell.value);
    rows.push(rowData.join(","));
  }
  return rows.join("\n");
};

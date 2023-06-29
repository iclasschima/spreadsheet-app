import React, { useState, useEffect } from "react";
import Cell from "../Cell/Cell";
import { saveSpreadsheet, getProcessingStatus } from "../../api";
import { evaluate } from "mathjs";
import {
  serializeData,
  computeCellValue,
  handleDependencyReevaluation,
} from "../../helpers";

function Grid() {
  const [cells, setCells] = useState([]);
  const [processingStatus, setProcessingStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState("");
  const rows = 10;
  const columns = 3;

  const [rowStates, setRowStates] = useState({});

  const referenceRegex = /[A-Z]+\d+/g;

  const generateInitialCells = () => {
    const initialCells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const cell = {
          id: `${String.fromCharCode(65 + col)}${row + 1}`,
          value: "",
          dependencies: "",
        };
        initialCells.push(cell);
      }
    }
    return initialCells;
  };

  const handleUpdateRowState = (cellId, value) => {
    const rowIndex = Math.floor(
      cells.findIndex((cell) => cell.id === cellId) / columns
    );
    setRowStates((prevRowStates) => ({
      ...prevRowStates,
      [rowIndex]: value,
    }));
  };

  const handleCellValueChange = (cellId, newValue) => {
    const updatedCells = cells.map((cell) => {
      if (cell.id === cellId) {
        return {
          ...cell,
          value: newValue,
          dependencies: newValue.startsWith("=") ? newValue : "",
        };
      }
      return cell;
    });

    setCells(updatedCells);
  };

  const updateRowState = (cellId, updatedCells = cells) => {
    const rowCells = updatedCells.filter((cell) => {
      const rowIndex = Math.floor(
        updatedCells.findIndex((c) => c.id === cellId) / columns
      );
      const cellIndex = updatedCells.findIndex((c) => c.id === cell.id);
      const cellRowIndex = Math.floor(cellIndex / columns);
      return cellRowIndex === rowIndex;
    });

    const state = rowCells.find((cell) => cell.value.match(referenceRegex))
      ? "error"
      : "normal";

    handleUpdateRowState(cellId, state);
  };

  const handleComputation = (cellId, value) => {
    // Recompute the values of dependent cells
    updateRowState(cellId);

    if (!value.startsWith("=")) {
      handleDependencyReevaluation(cells, setCells);
      return;
    }

    const updatedCells = cells.map((cell) => {
      if (cell.id === cellId) {
        return {
          ...cell,
          value: computeCellValue(cells, value),
          dependencies: value,
        };
      }
      return cell;
    });

    setCells(updatedCells);
    updateRowState(cellId, updatedCells);
  };

  const saveCells = async () => {
    setSavingStatus("Saving...");
    try {
      const serializedData = serializeData(cells);
      const response = await saveSpreadsheet(serializedData);

      // Handle the response based on the status
      if (response.status === "DONE") {
        setSavingStatus("Saved");
      } else {
        // Still in progress, update the processing status
        setProcessingStatus(response);
      }
    } catch (error) {
      // Handle any errors that occur during the save operation
      console.log("Error saving spreadsheet:", error);
      setSavingStatus("");
    }
  };

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveCells();
    }, 10000);
    return () => {
      clearInterval(saveInterval);
    };
  }, [cells]);

  useEffect(() => {
    // Check processing status when cells change
    if (processingStatus === "IN_PROGRESS") {
      const checkProcessingStatus = async () => {
        setSavingStatus("Saving...");
        try {
          const response = await getProcessingStatus(processingStatus.id);
          if (response.status === "DONE") {
            setSavingStatus("Saved");
          } else {
            // Still in progress, update the processing status
            setProcessingStatus(response);
          }
        } catch (error) {
          console.log("Error checking processing status:", error);
        }
      };

      const checkInterval = setInterval(checkProcessingStatus, 10000);

      return () => {
        clearInterval(checkInterval);
      };
    }
  }, [processingStatus]);

  useEffect(() => {
    const initialCells = generateInitialCells(10, 3);
    setCells(initialCells);
  }, []);

  useEffect(() => {
    const initialRowStates = {};
    for (let row = 0; row < rows; row++) {
      initialRowStates[row] = "normal";
    }
    setRowStates(initialRowStates);
  }, []);

  return (
    <div className="mb-10">
      <div className="h-[30px] text-right">
        <i className="text-green-300">{savingStatus}</i>
      </div>
      {cells.map((cell, index) => {
        const columnIndex = index % 3;
        const rowIndex = Math.floor(index / 3);

        if (columnIndex === 0) {
          return (
            <div
              key={cell.id}
              className={`flex border my-1 items-center flex-row relative ${
                rowStates[rowIndex] === "edit"
                  ? "shadow-lg border-neutral-50"
                  : rowStates[rowIndex] === "error"
                  ? "border-red-700 shadow-lg"
                  : ""
              }`}
            >
              <div className="absolute left-[-25px]">{rowIndex + 1}</div>
              <Cell
                key={cell.id}
                value={cell.value}
                onChange={(newValue) =>
                  handleCellValueChange(cell.id, newValue)
                }
                onBlur={(value) => handleComputation(cell.id, value)}
                onFocus={() => handleUpdateRowState(cell.id, "edit")}
                className={rowStates[rowIndex] === "error" ? "bg-rose-50" : ""}
              />
              {cells[index + 1] && (
                <Cell
                  key={cells[index + 1].id}
                  value={cells[index + 1].value}
                  onChange={(newValue) =>
                    handleCellValueChange(cells[index + 1].id, newValue)
                  }
                  onBlur={(value) =>
                    handleComputation(cells[index + 1].id, value)
                  }
                  onFocus={() =>
                    handleUpdateRowState(cells[index + 1].id, "edit")
                  }
                  className={
                    rowStates[rowIndex] === "error" ? "bg-rose-50" : ""
                  }
                />
              )}
              {cells[index + 2] && (
                <Cell
                  key={cells[index + 2].id}
                  value={cells[index + 2].value}
                  onChange={(newValue) =>
                    handleCellValueChange(cells[index + 2].id, newValue)
                  }
                  onBlur={(value) =>
                    handleComputation(cells[index + 2].id, value)
                  }
                  onFocus={() =>
                    handleUpdateRowState(cells[index + 2].id, "edit")
                  }
                  className={
                    rowStates[rowIndex] === "error" ? "bg-rose-50" : ""
                  }
                />
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default Grid;

"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { useReadSheetQuery } from "@/src/redux/api/googleApi";

interface WriteSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetId: string;
  onConfirm: (values: string[][]) => void;
  isLoading: boolean;
}

const WriteSheetModal: React.FC<WriteSheetModalProps> = ({ isOpen, onClose, sheetId, onConfirm, isLoading }) => {
  const { t } = useTranslation();
  const [gridData, setGridData] = useState<string[][]>([[""]]);

  const { data: sheetData, isLoading: isFetchingData } = useReadSheetQuery({ sheetId }, { skip: !isOpen || !sheetId });

  useEffect(() => {
    if (isOpen) {
      if (sheetData?.values && sheetData.values.length > 0) {
        const maxCols = Math.max(...sheetData.values.map((row) => row?.length || 0), 1);

        const normalized = sheetData.values.map((row) => {
          const padded = row ? [...row] : [];
          while (padded.length < maxCols) {
            padded.push("");
          }
          return padded;
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGridData(normalized);
      } else if (!isFetchingData) {
        setGridData([[""]]);
      }
    }
  }, [isOpen, sheetData, isFetchingData]);

  const addRow = () => {
    const colCount = gridData[0]?.length || 1;
    setGridData([...gridData, Array(colCount).fill("")]);
  };

  const addColumn = () => {
    setGridData(gridData.map((row) => [...row, ""]));
  };

  const removeRow = (rowIndex: number) => {
    if (gridData.length > 1) {
      setGridData(gridData.filter((_, i) => i !== rowIndex));
    }
  };

  const removeColumn = (colIndex: number) => {
    if (gridData[0].length > 1) {
      setGridData(gridData.map((row) => row.filter((_, i) => i !== colIndex)));
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...gridData];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value;
    setGridData(newData);
  };

  const handleConfirm = () => {
    const filteredData = gridData.filter((row) => row.some((cell) => cell.trim() !== ""));
    if (filteredData.length > 0) {
      onConfirm(filteredData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="md:max-w-4xl! max-w-[calc(100%-2rem)]! max-h-[90vh] flex flex-col p-0! dark:border-(--card-border-color)! overflow-hidden gap-0">
        <DialogHeader className="sm:p-6 p-4 border-b bg-white dark:bg-(--card-color)">
          <DialogTitle>{t("google_account_write_sheet_title")}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto sm:p-6 p-4 custom-scrollbar bg-white dark:bg-(--card-color)">
          {isFetchingData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-slate-500 font-medium">{t("loading_sheet_data")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("google_account_write_values_label")}</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addColumn} className="h-8 gap-1.5 font-bold text-xs border-emerald-500/30 text-primary hover:bg-emerald-50">
                    <Plus size={14} /> {t("add_column")}
                  </Button>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-white dark:bg-(--card-color) shadow-sm">
                <div className="overflow-x-auto table-custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-(--card-color)">
                        <th className="w-10 border-r border-slate-200 dark:border-(--card-border-color) uppercase text-[10px] font-bold text-slate-400 text-center">#</th>
                        {gridData[0]?.map((_, colIndex) => (
                          <th key={colIndex} className="px-3 py-2 border-r border-slate-200 dark:border-(--card-border-color) min-w-37.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Col {colIndex + 1}</span>
                              {gridData[0].length > 1 && (
                                <button onClick={() => removeColumn(colIndex)} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </th>
                        ))}
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-slate-200 dark:border-(--card-border-color)">
                          <td className="bg-slate-50 [@media(max-width:1920px)]:min-w-12.25 dark:bg-(--card-color) border-r border-slate-200 dark:border-(--card-border-color) text-[10px] font-bold text-slate-400 text-center">{rowIndex + 1}</td>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} className="p-1 [@media(max-width:1920px)]:min-w-53.75 border-r border-slate-200 dark:border-(--card-border-color) dark:bg-(--card-color)">
                              <Input value={cell} onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)} className="h-9 border-transparent focus:border-primary bg-transparent shadow-none rounded-none focus-visible:ring-0 text-sm" placeholder="..." disabled={isLoading} />
                            </td>
                          ))}
                          <td className="p-1 text-center [@media(max-width:1920px)]:min-w-12.25 dark:bg-(--card-color)">
                            {gridData.length > 1 && (
                              <button onClick={() => removeRow(rowIndex)} className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-2 border-t border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color)">
                  <Button variant="ghost" size="sm" onClick={addRow} className="w-full h-8 gap-1.5 font-bold text-xs text-slate-500 hover:text-primary hover:bg-emerald-50">
                    <Plus size={14} /> {t("add_row")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:p-6 p-4 border-t bg-slate-50 dark:bg-(--card-color) gap-2">
          <Button className="h-11" variant="outline" onClick={onClose} disabled={isLoading}>
            {t("cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || isFetchingData || !gridData.some((row) => row.some((cell) => cell.trim() !== ""))} className="bg-primary hover:bg-primary h-11 text-white min-w-30">
            {isLoading ? t("saving") : t("google_account_write_sheet")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WriteSheetModal;

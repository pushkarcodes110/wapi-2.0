/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { useCreateCurrencyMutation, useGetCurrencyByIdQuery, useUpdateCurrencyMutation } from "@/src/redux/api/currencyApi";
import { currencies } from "@/src/utils/currencies";
import { ArrowLeft, Check, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CurrencyFormProps {
  id?: string;
}

const CurrencyForm = ({ id }: CurrencyFormProps) => {
  const router = useRouter();
  const isEditMode = !!id;

  const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation();
  const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation();
  const { data: currencyData, isLoading: isLoadingCurrency } = useGetCurrencyByIdQuery(id || "", { skip: !isEditMode });

  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [exchangeRate, setExchangeRate] = useState("1");
  const [decimalNumber, setDecimalNumber] = useState("2");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isEditMode && currencyData?.data) {
      const curr = currencyData.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(curr.name);
      setCode(curr.code);
      setSymbol(curr.symbol);
      setExchangeRate(String(curr.exchange_rate));
      setDecimalNumber(String(curr.decimal_number));
      setIsActive(curr.is_active);
    }
  }, [isEditMode, currencyData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error(t("currencies_validation_name_required"));
      return;
    }
    if (!code) {
      toast.error(t("currencies_validation_code_required"));
      return;
    }
    if (!symbol) {
      toast.error(t("currencies_validation_symbol_required"));
      return;
    }
    if (!exchangeRate) {
      toast.error(t("currencies_validation_exchange_rate_required"));
      return;
    }
    if (Number(exchangeRate) < 0) {
      toast.error(t("currencies_validation_exchange_rate_min"));
      return;
    }
    if (!decimalNumber) {
      toast.error(t("currencies_validation_decimal_number_required"));
      return;
    }
    if (Number(decimalNumber) < 0) {
      toast.error(t("currencies_validation_decimal_number_min"));
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      symbol: symbol.trim(),
      exchange_rate: Number(exchangeRate),
      decimal_number: Number(decimalNumber),
      is_active: isActive,
    };

    try {
      if (isEditMode) {
        await updateCurrency({ id: id as string, data: payload }).unwrap();
        toast.success(t("currencies_update_success"));
      } else {
        await createCurrency(payload).unwrap();
        toast.success(t("currencies_create_success"));
      }
      router.push(ROUTES.Currencies);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.error || error?.error || "Something went wrong.");
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingCurrency;

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="sticky top-[100px] z-[50] -mx-4 pt-0! sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-light-body-bg dark:bg-(--dark-body) shadow-[0_-55px_0px_0px_var(--light-body-bg)] dark:shadow-[0_-55px_0px_0px_var(--dark-body)] py-4 mb-5 sm:mb-2 flex flex-col sm:flex-row sm:items-center gap-4 transition-all">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-(--text-green-primary) mb-1">
            {isEditMode ? t("currencies_edit_title") : t("currencies_add_title")}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isEditMode ? t("currencies_edit_subtitle") : t("currencies_add_subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Content — 8 columns: Currency Settings */}
          <div className="xl:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) sm:p-6 p-4">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 shadow-inner" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Currency Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Code Select */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="code" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    Currency Code <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={code}
                    onValueChange={(val) => {
                      setCode(val);
                      const selected = currencies.find((c) => c.code === val);
                      if (selected) {
                        if (!name) setName(selected.name);
                        if (!symbol) setSymbol(selected.symbol);
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg border-gray-200">
                      <SelectValue placeholder="Select currency code" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 dark:bg-(--card-color)">
                      {currencies.map((curr) => (
                        <SelectItem className="dark:hover:bg-(--table-hover)" key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Symbol Select */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="symbol" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    Currency Symbol <span className="text-red-500">*</span>
                  </Label>
                  <Select value={symbol} onValueChange={setSymbol}>
                    <SelectTrigger className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg border-gray-200">
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 dark:bg-(--card-color)">
                      {Array.from(new Set(currencies.map((c) => c.symbol))).map((s) => (
                        <SelectItem className="dark:hover:bg-(--table-hover)" key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Name Input */}
                <div className="space-y-2 flex flex-col md:col-span-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    Currency Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. US Dollar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg"
                    required
                  />
                </div>

                {/* Exchange Rate */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="exchangeRate" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    Exchange Rate (1 USD = ?) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg"
                    required
                  />
                </div>

                {/* Decimal Places */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="decimalNumber" className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    Decimal Places <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="decimalNumber"
                    type="number"
                    min="0"
                    value={decimalNumber}
                    onChange={(e) => setDecimalNumber(e.target.value)}
                    className="h-11 bg-(--input-color) dark:bg-page-body dark:border-(--card-border-color) focus:border-(--text-green-primary) focus:ring-(--text-green-primary) rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — 4 columns: Settings */}
          <div className="xl:col-span-4 space-y-6">
            <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="sm:px-6 px-4 py-4 border-b border-gray-100 dark:border-(--card-border-color)">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t("common_settings")}
                </h2>
              </div>
              <div className="sm:p-6 p-4 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="isActive" className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Active Status
                    </Label>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Enable this currency for system use
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-(--text-green-primary)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end flex-wrap gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6 py-5 h-11 border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color) dark:text-gray-200 shadow-sm dark:hover:bg-(--dark-sidebar) text-gray-700 hover:bg-gray-50 font-medium"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-5 h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50 gap-2 min-w-40"
            disabled={isLoading || !name || !code || !symbol}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-5 h-5 text-white" />
            )}
            {isLoading
              ? isEditMode ? "Saving..." : "Creating..."
              : isEditMode ? "Save Changes" : "Add Currency"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CurrencyForm;

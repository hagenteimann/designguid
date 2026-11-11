import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { exportFont, downloadFont, getExportFormats } from '../services/api';
export function OutputPanel({ qaStatus, fontUrl, isLoading = false, onExport }) {
    const [exporting, setExporting] = useState(null);
    const [exportError, setExportError] = useState(null);
    const handleExport = async (format) => {
        if (!fontUrl)
            return;
        setExporting(format);
        setExportError(null);
        try {
            const blob = await exportFont(fontUrl, format);
            const filename = `generated-font.${format}`;
            downloadFont(blob, filename);
            onExport?.(format);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Export failed';
            setExportError(message);
        }
        finally {
            setExporting(null);
        }
    };
    const exportFormats = getExportFormats();
    return (_jsxs("div", { className: "space-y-4", children: [qaStatus && (_jsxs("div", { className: "bg-white rounded-lg shadow p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-medium text-neutral-700", children: "Quality Assurance" }), _jsx("div", { className: `flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${qaStatus.passed
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'}`, children: qaStatus.passed ? '✓ Passed' : '⚠ Issues' })] }), _jsx("div", { className: "space-y-2", children: qaStatus.checks.map((check, idx) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: `mt-0.5 text-lg leading-none ${check.passed ? 'text-green-600' : 'text-amber-600'}`, children: check.passed ? '✓' : '◆' }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-neutral-700 font-medium", children: check.name }), check.message && (_jsx("p", { className: "text-xs text-neutral-500 mt-0.5", children: check.message }))] })] }, idx))) }), qaStatus.issues.length > 0 && (_jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded p-2", children: [_jsx("p", { className: "text-xs font-medium text-amber-900 mb-1", children: "Known Issues:" }), _jsx("ul", { className: "text-xs text-amber-800 space-y-1", children: qaStatus.issues.map((issue, idx) => (_jsxs("li", { className: "flex gap-2", children: [_jsx("span", { children: "\u2022" }), _jsx("span", { children: issue })] }, idx))) })] }))] })), _jsxs("div", { className: "bg-white rounded-lg shadow p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-neutral-700 mb-2", children: "Export Font" }), _jsx("p", { className: "text-xs text-neutral-500", children: "Choose your preferred format. UFO is for editing, OTF/TTF for installation." })] }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: exportFormats.map((format) => (_jsx("button", { onClick: () => handleExport(format.type), disabled: !fontUrl || isLoading || exporting !== null || !qaStatus?.passed, className: `px-3 py-2 rounded-md text-xs font-medium transition-all ${!fontUrl || isLoading || exporting !== null || !qaStatus?.passed
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                : 'bg-primary-300 hover:bg-primary-400 text-white'}`, children: exporting === format.type ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" }), format.type.toUpperCase()] })) : (format.type.toUpperCase()) }, format.type))) }), _jsxs("div", { className: "space-y-1 text-xs", children: [_jsxs("p", { className: "text-neutral-600", children: [_jsx("span", { className: "font-medium", children: "OTF:" }), " OpenType Format - for installation and design software"] }), _jsxs("p", { className: "text-neutral-600", children: [_jsx("span", { className: "font-medium", children: "TTF:" }), " TrueType Format - universal font format"] }), _jsxs("p", { className: "text-neutral-600", children: [_jsx("span", { className: "font-medium", children: "UFO:" }), " Unified Font Object - for further editing"] })] }), exportError && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded p-2", children: _jsxs("p", { className: "text-xs text-red-700", children: [_jsx("span", { className: "font-medium", children: "Export Error:" }), " ", exportError] }) }))] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-blue-900 mb-2", children: _jsx("span", { className: "font-medium", children: "How to use your font:" }) }), _jsxs("ol", { className: "text-xs text-blue-800 space-y-1 list-decimal list-inside", children: [_jsx("li", { children: "Export in your preferred format" }), _jsx("li", { children: "For OTF/TTF: Install on your system or add to your project" }), _jsx("li", { children: "For UFO: Open in font editors like FontLab, Glyphs, or FontForge" }), _jsx("li", { children: "Use in design tools, websites, or applications" })] })] }), _jsx("div", { className: "bg-neutral-100 rounded-lg p-3 border border-neutral-300", children: _jsxs("p", { className: "text-xs text-neutral-700", children: [_jsx("span", { className: "font-medium", children: "License:" }), " Your generated fonts are yours to use. When sharing, include attribution: \"Generated with FontGen AI\""] }) }), !fontUrl && (_jsx("div", { className: "bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-4 text-center", children: _jsx("p", { className: "text-sm text-neutral-600", children: "Generate a font first to unlock export options" }) }))] }));
}

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
function Input(_a) {
    var { className, type } = _a, props = __rest(_a, ["className", "type"]);
    return (_jsx("input", Object.assign({ type: type, "data-slot": "input", className: cn("file:text-accent placeholder:text-muted-foreground border-secondary-foreground border hover:bg-secondary-foreground transition-colors outline-0 px-4 h-12 rounded-xl bg-secondary text-accent dark:bg-input/30 flex w-full min-w-0 text-base shadow-xs file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className) }, props)));
}
export { Input };

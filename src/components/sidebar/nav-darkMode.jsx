import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NavDarkMode() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "light";
  });

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(mode);
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <div className="flex items-center justify-between max-w-40 gap-4 p-2">
      <Label htmlFor="mode" className={`text-sm leading-none `}>
        Dark Mode
      </Label>
      <Switch
        size="sm"
        id="mode"
        className="cursor-pointer"
        checked={mode === "dark"}
        onCheckedChange={(checked) => setMode(checked ? "dark" : "light")}
      />
    </div>
  );
}
// <div className="flex flex-col gap-5">
//   <IoIosArrowUp onClick={() => setOpenIcon(!openIcon)} />
//   {mode === "dark" ? (
//     <FiSun onClick={() => handleMode()} />
//   ) : (
//     <MdDarkMode onClick={() => handleMode()} />
//   )}

//   <IoLanguageOutline
//     onClick={() => i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")}
//   />
// </div>;

/*isLoading && "cursor-not-allowed opacity-50"*/

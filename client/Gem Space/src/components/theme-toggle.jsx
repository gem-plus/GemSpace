import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="rounded-full">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ColorPicker() {
  const { brandColor, setBrandColor, brandColors } = useTheme();

  const colorKeys = Object.keys(brandColors);

  return (
    <div className="flex items-center gap-2">
      {colorKeys.map((key) => {
        const colorConfig = brandColors[key];
        const isActive = brandColor === key;
        const hue = colorConfig.light.h;

        return (
          <button
            key={key}
            onClick={() => setBrandColor(key)}
            className={`relative h-6 w-6 rounded-full transition-all duration-200 ${
              isActive
                ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                : "hover:scale-105"
            }`}
            style={{
              backgroundColor: `oklch(${colorConfig.light.l} ${colorConfig.light.c} ${hue})`,
              ringColor: `oklch(${colorConfig.light.l} ${colorConfig.light.c} ${hue})`,
            }}
            title={colorConfig.name}
          >
            <span className="sr-only">{colorConfig.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function CompactColorPicker() {
  const { brandColor, setBrandColor, brandColors } = useTheme();

  const colorKeys = Object.keys(brandColors);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          style={{
            backgroundColor: `oklch(${brandColors[brandColor].light.l} ${brandColors[brandColor].light.c} ${brandColors[brandColor].light.h})`,
          }}
        >
          <span className="sr-only">Pick brand color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Brand Color
        </div>
        <div className="flex items-center gap-2 px-2 py-2">
          {colorKeys.map((key) => {
            const colorConfig = brandColors[key];
            const isActive = brandColor === key;
            const hue = colorConfig.light.h;

            return (
              <button
                key={key}
                onClick={() => setBrandColor(key)}
                className={`h-6 w-6 rounded-full transition-all duration-200 ${
                  isActive ? "ring-2 ring-offset-2 ring-offset-popover" : ""
                }`}
                style={{
                  backgroundColor: `oklch(${colorConfig.light.l} ${colorConfig.light.c} ${hue})`,
                  ringColor: `oklch(${colorConfig.light.l} ${colorConfig.light.c} ${hue})`,
                }}
                title={colorConfig.name}
              >
                <span className="sr-only">{colorConfig.name}</span>
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
